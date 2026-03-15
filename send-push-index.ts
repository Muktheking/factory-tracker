// supabase/functions/send-push/index.ts
// Sends Web Push notifications to subscribed devices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, title, body, url = "/" } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all push subscriptions for this user
    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;
    if (!subs?.length) return new Response(JSON.stringify({ sent: 0 }), { headers: corsHeaders });

    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@fashion-passion.com";

    const payload = JSON.stringify({ title, body, url, tag: `fp-${Date.now()}` });

    let sent = 0;
    const expired: string[] = [];

    for (const sub of subs) {
      try {
        const res = await sendWebPush(sub.subscription, payload, {
          privateKey: VAPID_PRIVATE_KEY,
          publicKey: VAPID_PUBLIC_KEY,
          subject: VAPID_SUBJECT,
        });
        if (res.status === 410 || res.status === 404) {
          expired.push(sub.id); // subscription expired
        } else {
          sent++;
        }
      } catch (err) {
        console.error("Push error for sub", sub.id, err);
      }
    }

    // Clean up expired subscriptions
    if (expired.length) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }

    return new Response(JSON.stringify({ sent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ── Minimal Web Push implementation using VAPID ──────────────────────────────
async function sendWebPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: string,
  vapid: { privateKey: string; publicKey: string; subject: string }
) {
  const { endpoint, keys } = subscription;
  const audience = new URL(endpoint).origin;

  // Build VAPID JWT
  const header = btoa(JSON.stringify({ typ: "JWT", alg: "ES256" })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const now = Math.floor(Date.now() / 1000);
  const claims = btoa(JSON.stringify({ aud: audience, exp: now + 12 * 3600, sub: vapid.subject })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const signingInput = `${header}.${claims}`;
  const privateKeyBytes = base64UrlDecode(vapid.privateKey);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBytes,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${arrayBufferToBase64Url(signature)}`;

  // Encrypt payload using Web Push encryption (RFC 8291)
  const encryptedPayload = await encryptPayload(payload, keys.p256dh, keys.auth);

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `vapid t=${jwt},k=${vapid.publicKey}`,
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      "TTL": "86400",
    },
    body: encryptedPayload,
  });
}

async function encryptPayload(payload: string, p256dh: string, auth: string) {
  const serverKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
  const clientPublicKey = await crypto.subtle.importKey("raw", base64UrlDecode(p256dh), { name: "ECDH", namedCurve: "P-256" }, false, []);

  const sharedSecret = await crypto.subtle.deriveBits({ name: "ECDH", public: clientPublicKey }, serverKeys.privateKey as CryptoKey, 256);
  const authBuffer = base64UrlDecode(auth);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const serverPublicKeyRaw = await crypto.subtle.exportKey("raw", serverKeys.publicKey as CryptoKey);

  // HKDF
  const prk = await hkdf(authBuffer, new Uint8Array(sharedSecret), new TextEncoder().encode("Content-Encoding: auth\0"), 32);
  const cek = await hkdf(salt, prk, buildInfo("aesgcm", new Uint8Array(serverPublicKeyRaw), base64UrlDecode(p256dh)), 16);
  const nonce = await hkdf(salt, prk, buildInfo("nonce", new Uint8Array(serverPublicKeyRaw), base64UrlDecode(p256dh)), 12);

  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const payloadBytes = new TextEncoder().encode(payload);
  const paddedPayload = new Uint8Array(payloadBytes.length + 2);
  paddedPayload.set(payloadBytes, 2);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, paddedPayload);

  // Build aes128gcm content encoding
  const result = new Uint8Array(21 + serverPublicKeyRaw.byteLength + encrypted.byteLength);
  result.set(salt, 0);
  new DataView(result.buffer).setUint32(16, 4096, false);
  result[20] = serverPublicKeyRaw.byteLength;
  result.set(new Uint8Array(serverPublicKeyRaw), 21);
  result.set(new Uint8Array(encrypted), 21 + serverPublicKeyRaw.byteLength);
  return result;
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number) {
  const key = await crypto.subtle.importKey("raw", ikm, { name: "HKDF" }, false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8);
  return new Uint8Array(bits);
}

function buildInfo(type: string, serverKey: Uint8Array, clientKey: Uint8Array) {
  const info = new Uint8Array(18 + type.length + 1 + 2 + serverKey.length + 2 + clientKey.length);
  const enc = new TextEncoder();
  info.set(enc.encode("Content-Encoding: "), 0);
  info.set(enc.encode(type), 18);
  info[18 + type.length] = 0;
  new DataView(info.buffer).setUint16(18 + type.length + 1, serverKey.length, false);
  info.set(serverKey, 18 + type.length + 3);
  new DataView(info.buffer).setUint16(18 + type.length + 3 + serverKey.length, clientKey.length, false);
  info.set(clientKey, 18 + type.length + 3 + serverKey.length + 2);
  return info;
}

function base64UrlDecode(str: string) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Uint8Array.from(atob(padded + "=".repeat(padLen)), (c) => c.charCodeAt(0));
}

function arrayBufferToBase64Url(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
