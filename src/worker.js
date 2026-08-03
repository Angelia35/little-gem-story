const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const EMAIL_FROM = "Auralis Website <requests@send.auralisgems.com>";
const EMAIL_TO = "hello@auralisgems.com";

const LIMITS = {
  budget: 80,
  style: 300,
  wrist: 100,
  purpose: 100,
  country: 100,
  route: 120,
  reference: 500,
  birth: 250,
  quantity: 100,
  deadline: 100,
  name: 120,
  email: 254,
  notes: 2000,
  pageUrl: 500,
  referrer: 500,
  timezone: 100,
  utmSource: 160,
  utmMedium: 160,
  utmCampaign: 160,
  utmContent: 160,
  utmTerm: 160,
};

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}

function normalize(input) {
  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    data[key] = clean(input[key], max);
  }
  data.website = clean(input.website, 200);
  data.idempotencyKey = clean(input.idempotencyKey, 100);
  data.startedAt = Number(input.startedAt || 0);
  data.email = data.email.toLowerCase();
  return data;
}

function validate(data) {
  const required = [
    ["budget", "preferred budget"],
    ["style", "preferred style"],
    ["wrist", "wrist size"],
    ["purpose", "purpose"],
    ["country", "delivery country"],
    ["email", "email"],
  ];
  const missing = required
    .filter(([key]) => !data[key])
    .map(([, label]) => label);
  if (missing.length) return "Please complete: " + missing.join(", ") + ".";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    return "Please enter a valid email address.";
  }
  if (!data.idempotencyKey || data.idempotencyKey.length < 12) {
    return "Please refresh the page and try again.";
  }
  if (!Number.isFinite(data.startedAt) || Date.now() - data.startedAt < 1200) {
    return "Please review the form and try again.";
  }
  return "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

function emailContent(data, requestId, createdAt) {
  const rows = [
    ["Request ID", requestId],
    ["Submitted", createdAt],
    ["Preferred budget", data.budget],
    ["Preferred colors or style", data.style],
    ["Wrist size", data.wrist],
    ["Purpose", data.purpose],
    ["Delivery country", data.country],
    ["Preferred direction", data.route || "Let Auralis recommend"],
    ["Reference photo or link", data.reference],
    ["Birth date / Five Elements", data.birth],
    ["Quantity", data.quantity || "1 / Not provided"],
    ["Needed-by date", data.deadline],
    ["Name", data.name],
    ["Customer email", data.email],
    ["Other notes", data.notes],
    ["UTM source", data.utmSource],
    ["UTM medium", data.utmMedium],
    ["UTM campaign", data.utmCampaign],
    ["Referrer", data.referrer],
  ];
  const text = rows
    .map(([label, value]) => label + ": " + (value || "Not provided"))
    .join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        '<tr><th style="padding:8px 10px;text-align:left;vertical-align:top;background:#fff7ee;border:1px solid #ead9ca">' +
        escapeHtml(label) +
        '</th><td style="padding:8px 10px;white-space:pre-wrap;border:1px solid #ead9ca">' +
        escapeHtml(value || "Not provided") +
        "</td></tr>",
    )
    .join("");
  const html =
    '<div style="font-family:Arial,sans-serif;color:#2e231e;max-width:760px"><h1 style="font-family:Georgia,serif">New Auralis custom request</h1><p>Reply directly to this email to contact the customer.</p><table style="width:100%;border-collapse:collapse">' +
    htmlRows +
    "</table></div>";
  return { text, html };
}

async function sendNotification(env, data, requestId, createdAt) {
  if (!env.RESEND_API_KEY) {
    throw new Error("Email notification is not configured.");
  }
  const content = emailContent(data, requestId, createdAt);
  const safeName = (data.name || "Customer").replace(/[\r\n]/g, " ").slice(0, 60);
  const safeCountry = (data.country || "Unknown country")
    .replace(/[\r\n]/g, " ")
    .slice(0, 60);
  const safeBudget = (data.budget || "Budget not provided")
    .replace(/[\r\n]/g, " ")
    .slice(0, 60);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      reply_to: data.email,
      subject:
        "[Auralis Custom Request] " +
        safeName +
        " | " +
        safeCountry +
        " | " +
        safeBudget,
      text: content.text,
      html: content.html,
      headers: { "X-Entity-Ref-ID": requestId },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "Email provider error " +
        response.status +
        ": " +
        clean(result.message || result.name || "unknown", 300),
    );
  }
  return clean(result.id || "", 120);
}

function createRequestId() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "AR-" + date + "-" + suffix;
}

async function finishEmail(env, data, id, createdAt) {
  try {
    const messageId = await sendNotification(env, data, id, createdAt);
    await env.REQUESTS_DB.prepare(
      "UPDATE custom_requests SET email_status='sent', email_message_id=?, email_error=NULL WHERE request_id=?",
    )
      .bind(messageId, id)
      .run();
    return reply({ ok: true, saved: true, emailSent: true, requestId: id });
  } catch (error) {
    const errorMessage = clean(
      error && error.message ? error.message : "Unknown email error",
      500,
    );
    await env.REQUESTS_DB.prepare(
      "UPDATE custom_requests SET email_status='failed', email_error=? WHERE request_id=?",
    )
      .bind(errorMessage, id)
      .run();
    console.error("Auralis request email failed", id, errorMessage);
    return reply(
      {
        ok: false,
        saved: true,
        emailSent: false,
        requestId: id,
        message:
          "The request was saved, but the email notification could not be sent.",
      },
      502,
    );
  }
}

async function handleCustomRequest(request, env) {
  if (!env.REQUESTS_DB) {
    return reply(
      { ok: false, message: "The request service is not configured." },
      503,
    );
  }
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return reply({ ok: false, message: "Request origin was not accepted." }, 403);
  }
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return reply({ ok: false, message: "JSON is required." }, 415);
  }
  const declaredSize = Number(request.headers.get("Content-Length") || 0);
  if (declaredSize > 30000) {
    return reply({ ok: false, message: "The request is too large." }, 413);
  }

  let input;
  try {
    input = await request.json();
  } catch (error) {
    return reply({ ok: false, message: "The request could not be read." }, 400);
  }
  const data = normalize(input || {});
  if (data.website) {
    return reply({ ok: false, message: "The request could not be submitted." }, 400);
  }
  const validationError = validate(data);
  if (validationError) {
    return reply({ ok: false, message: validationError }, 400);
  }

  const existing = await env.REQUESTS_DB.prepare(
    "SELECT request_id, created_at, email_status FROM custom_requests WHERE idempotency_key=?",
  )
    .bind(data.idempotencyKey)
    .first();
  if (existing) {
    if (existing.email_status === "sent") {
      return reply({
        ok: true,
        saved: true,
        emailSent: true,
        duplicate: true,
        requestId: existing.request_id,
      });
    }
    return finishEmail(env, data, existing.request_id, existing.created_at);
  }

  const recent = await env.REQUESTS_DB.prepare(
    "SELECT request_id FROM custom_requests WHERE email=? AND created_unix>? LIMIT 1",
  )
    .bind(data.email, Math.floor(Date.now() / 1000) - 30)
    .first();
  if (recent) {
    return reply(
      { ok: false, message: "Please wait a moment before sending another request." },
      429,
    );
  }

  const id = createRequestId();
  const createdAt = new Date().toISOString();
  const createdUnix = Math.floor(Date.now() / 1000);
  const userAgent = clean(request.headers.get("User-Agent") || "", 300);
  try {
    await env.REQUESTS_DB.prepare(
      `INSERT INTO custom_requests (
        request_id,idempotency_key,created_at,created_unix,status,email_status,
        budget,style,wrist,purpose,country,route,reference,birth,quantity,deadline,name,email,notes,
        page_url,referrer,timezone,utm_source,utm_medium,utm_campaign,utm_content,utm_term,user_agent
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
      .bind(
        id,
        data.idempotencyKey,
        createdAt,
        createdUnix,
        "new",
        "pending",
        data.budget,
        data.style,
        data.wrist,
        data.purpose,
        data.country,
        data.route,
        data.reference,
        data.birth,
        data.quantity,
        data.deadline,
        data.name,
        data.email,
        data.notes,
        data.pageUrl,
        data.referrer,
        data.timezone,
        data.utmSource,
        data.utmMedium,
        data.utmCampaign,
        data.utmContent,
        data.utmTerm,
        userAgent,
      )
      .run();
  } catch (error) {
    console.error(
      "Auralis request storage failed",
      clean(error && error.message ? error.message : "unknown", 300),
    );
    return reply(
      {
        ok: false,
        message: "The request could not be saved. Please try again or use WhatsApp.",
      },
      500,
    );
  }

  return finishEmail(env, data, id, createdAt);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/custom-request" || url.pathname === "/api/custom-request/") {
      if (request.method !== "POST") {
        return reply({ ok: false, message: "Method not allowed." }, 405);
      }
      return handleCustomRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
