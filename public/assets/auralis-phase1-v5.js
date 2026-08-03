(function () {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        menu.classList.contains("open") ? "true" : "false",
      );
    });
  }
  function track(name, params) {
    try {
      if (typeof gtag === "function") gtag("event", name, params || {});
    } catch (e) {}
  }
  document.addEventListener(
    "click",
    function (e) {
      const a = e.target.closest && e.target.closest("a,button");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const label = (a.textContent || "").trim().slice(0, 80);
      if (href.includes("wa.me"))
        track("whatsapp_click", {
          event_category: "lead",
          event_label: label,
          link_url: href,
        });
      if (href.includes("/custom-order"))
        track("custom_order_click", {
          event_category: "lead",
          event_label: label,
          link_url: href,
        });
      if (href.includes("pricing-process"))
        track("pricing_process_click", {
          event_category: "decision_support",
          event_label: label,
          link_url: href,
        });
    },
    true,
  );

  const form = document.getElementById("budgetRequestForm");
  if (!form) return;
  const $ = (id) => document.getElementById(id);
  const submitButton = $("submitRequest");
  const status = $("formStatus");
  const email = $("email");
  let started = false;
  let startedAt = Date.now();
  let idempotencyKey = createId();

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function")
      return window.crypto.randomUUID();
    return "req-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
  function v(id) {
    const el = $(id);
    return el ? String(el.value || "").trim() : "";
  }
  function message() {
    return [
      "Hi Auralis Jewelry, I would like help choosing a crystal bracelet based on my budget.",
      "",
      "Preferred budget: " + (v("budget") || "Not provided"),
      "Preferred colors or style: " + (v("style") || "Not provided"),
      "Wrist size: " + (v("wrist") || "Not provided"),
      "For myself or as a gift: " + (v("purpose") || "Not provided"),
      "Delivery country: " + (v("country") || "Not provided"),
      "Preferred direction: " + (v("route") || "Let Auralis recommend"),
      "Reference photo or link: " +
        (v("reference") || "I will attach it in WhatsApp / None yet"),
      "Birth date or Five Elements request: " +
        (v("birth") || "No / Not provided"),
      "Quantity: " + (v("quantity") || "1 / Not provided"),
      "Needed-by date: " + (v("deadline") || "Not provided"),
      "Name: " + (v("name") || "Not provided"),
      "Email: " + (v("email") || "Not provided"),
      "Other notes: " + (v("notes") || "None"),
      "",
      "Please recommend a suitable ready-to-ship, simple personalization, or fully custom option. I understand the quote is confirmed before payment.",
    ].join("\n");
  }
  function updatePreview() {
    const p = $("requestPreview");
    if (p) p.textContent = message();
  }
  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("success", "error");
    if (type) status.classList.add(type);
    status.classList.add("show");
  }
  function validateBase() {
    if (email) email.required = false;
    return form.reportValidity();
  }
  function validateDirect() {
    if (email) email.required = true;
    const isValid = form.reportValidity();
    if (email) email.required = false;
    return isValid;
  }
  function attribution() {
    const current = {};
    const params = new URLSearchParams(window.location.search);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach((key) => {
      if (params.get(key)) current[key] = params.get(key).slice(0, 160);
    });
    try {
      const previous = JSON.parse(
        sessionStorage.getItem("auralis_attribution") || "{}",
      );
      const merged = Object.assign({}, previous, current);
      if (Object.keys(current).length)
        sessionStorage.setItem("auralis_attribution", JSON.stringify(merged));
      return merged;
    } catch (e) {
      return current;
    }
  }
  function payload() {
    const source = attribution();
    return {
      budget: v("budget"),
      style: v("style"),
      wrist: v("wrist"),
      purpose: v("purpose"),
      country: v("country"),
      route: v("route"),
      reference: v("reference"),
      birth: v("birth"),
      quantity: v("quantity"),
      deadline: v("deadline"),
      name: v("name"),
      email: v("email"),
      notes: v("notes"),
      website: v("website"),
      startedAt: startedAt,
      idempotencyKey: idempotencyKey,
      pageUrl: window.location.href.slice(0, 500),
      referrer: String(document.referrer || "").slice(0, 500),
      timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || "").slice(
        0,
        100,
      ),
      utmSource: source.utm_source || "",
      utmMedium: source.utm_medium || "",
      utmCampaign: source.utm_campaign || "",
      utmContent: source.utm_content || "",
      utmTerm: source.utm_term || "",
    };
  }

  form.addEventListener("input", () => {
    if (!started) {
      started = true;
      track("budget_form_started", { event_category: "lead_form" });
    }
    updatePreview();
  });
  form.addEventListener("change", updatePreview);

  const wa = $("sendWhatsApp");
  if (wa)
    wa.addEventListener("click", function () {
      if (!validateBase()) return;
      const url =
        "https://wa.me/8618357590167?text=" + encodeURIComponent(message());
      track("whatsapp_click", {
        event_category: "lead",
        event_label: "Custom order form",
        method: "whatsapp",
        budget: v("budget"),
        route: v("route"),
      });
      window.open(url, "_blank", "noopener");
    });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateDirect()) return;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Submitting…";
    }
    setStatus("Submitting your request securely…", "");
    try {
      const response = await fetch("/api/custom-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload()),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (result.saved && result.requestId) {
          setStatus(
            "Your request was saved as " +
              result.requestId +
              ", but the email notification could not be sent. Please use WhatsApp and include this request number.",
            "error",
          );
          track("custom_request_saved_notification_failed", {
            event_category: "lead_form",
            request_id: result.requestId,
          });
          return;
        }
        throw new Error(
          result.message ||
            "The request could not be submitted. Please try again or use WhatsApp.",
        );
      }
      setStatus(
        "Thank you — your request " +
          result.requestId +
          " has been received. Auralis will reply to " +
          v("email") +
          " within 1–2 business days.",
        "success",
      );
      track("custom_request_submitted", {
        event_category: "lead",
        method: "direct_submit",
        request_id: result.requestId,
        budget: v("budget"),
        route: v("route"),
      });
      form.reset();
      started = false;
      startedAt = Date.now();
      idempotencyKey = createId();
      updatePreview();
    } catch (error) {
      setStatus(
        error && error.message
          ? error.message
          : "The request could not be submitted. Please try again or use WhatsApp.",
        "error",
      );
      track("custom_request_submit_error", { event_category: "lead_form" });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = "Submit Request";
      }
    }
  });

  attribution();
  updatePreview();
})();

(function () {
  function track(name, params) {
    try {
      if (typeof gtag === "function") gtag("event", name, params || {});
    } catch (e) {}
  }
  const form = document.getElementById("wholesaleInquiryForm");
  if (!form) return;
  let started = false;
  const $ = (id) => document.getElementById(id);
  function v(id) {
    const el = $(id);
    return el ? String(el.value || "").trim() : "";
  }
  function message() {
    return [
      "Hi Auralis Jewelry, I would like a boutique wholesale recommendation.",
      "",
      "Business or store name: " + (v("wBusiness") || "Not provided"),
      "Website or social page: " + (v("wWebsite") || "Not provided"),
      "Business type: " + (v("wType") || "Not provided"),
      "Target market / delivery country: " + (v("wCountry") || "Not provided"),
      "Target retail price per piece: " + (v("wRetail") || "Not provided"),
      "Preferred initial purchase budget: " + (v("wBudget") || "Not provided"),
      "Estimated quantity: " + (v("wQuantity") || "Not provided"),
      "Preferred styles or colors: " + (v("wStyle") || "Not provided"),
      "Order direction: " + (v("wRoute") || "Let Auralis recommend"),
      "Packaging / branding: " + (v("wPackaging") || "Not provided"),
      "Needed-by date: " + (v("wDeadline") || "Not provided"),
      "Contact name: " + (v("wName") || "Not provided"),
      "Email: " + (v("wEmail") || "Not provided"),
      "WhatsApp: " + (v("wWhatsApp") || "Not provided"),
      "Other notes: " + (v("wNotes") || "None"),
      "",
      "Please recommend suitable ready-to-ship, simple personalization or custom capsule options. Please confirm MOQ, sample terms, materials, packaging, price and production timing before payment.",
    ].join("\n");
  }
  function update() {
    const p = $("wholesalePreview");
    if (p) p.textContent = message();
  }
  form.addEventListener("input", () => {
    if (!started) {
      started = true;
      track("wholesale_form_started", { event_category: "b2b_lead" });
    }
    update();
  });
  form.addEventListener("change", update);
  function valid() {
    return form.reportValidity();
  }
  const wa = $("wholesaleWhatsApp");
  if (wa)
    wa.addEventListener("click", () => {
      if (!valid()) return;
      track("wholesale_inquiry_submit", {
        event_category: "b2b_lead",
        method: "whatsapp",
        business_type: v("wType"),
        quantity: v("wQuantity"),
      });
      window.open(
        "https://wa.me/8618357590167?text=" + encodeURIComponent(message()),
        "_blank",
        "noopener",
      );
    });
  const em = $("wholesaleEmail");
  if (em)
    em.addEventListener("click", () => {
      if (!valid()) return;
      track("wholesale_inquiry_submit", {
        event_category: "b2b_lead",
        method: "email",
        business_type: v("wType"),
        quantity: v("wQuantity"),
      });
      window.location.href =
        "mailto:hello@auralisgems.com?subject=" +
        encodeURIComponent("Auralis boutique wholesale inquiry") +
        "&body=" +
        encodeURIComponent(message());
    });
  const cp = $("wholesaleCopy");
  if (cp)
    cp.addEventListener("click", async () => {
      if (!valid()) return;
      const s = $("wholesaleStatus");
      try {
        await navigator.clipboard.writeText(message());
        s.textContent =
          "Wholesale inquiry copied. Paste it into WhatsApp or email.";
        s.classList.add("show");
        track("wholesale_request_copy", { event_category: "b2b_lead" });
      } catch (e) {
        s.textContent =
          "Copy was blocked. Select the preview below and copy it manually.";
        s.classList.add("show");
      }
    });
  update();
})();
