/*
Auralis Jewelry — Tracking V2
Version: 2.0 — 2026-09-01

Purpose:
- Retire legacy request_quote_click.
- Keep one clear event name per user action.
- Remain compatible with pages that already load Auralis shared JS.
- Never send form field values, email addresses, names, birth dates, or other PII.

Event taxonomy:
custom_order_click       = user opens /custom-order (micro conversion)
whatsapp_click           = user clicks WhatsApp contact (strong contact intent)
email_click              = user clicks an email link (strong contact intent)
pricing_process_click    = user opens pricing/process support content
custom_request_submitted = successful direct form submission (handled by phase1-v5)
wholesale_inquiry_submit = wholesale form submission intent (handled by shared form JS)
*/

(function () {
  "use strict";

  if (window.__AURALIS_TRACKING_V2__) return;
  window.__AURALIS_TRACKING_V2__ = true;

  function sendEvent(name, params) {
    try {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", name, params || {});
    } catch (e) {}
  }

  function cleanLabel(el, href) {
    return (
      (el && (el.textContent || el.getAttribute("aria-label"))) ||
      href ||
      "link"
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
  }

  function safePath() {
    try {
      return window.location.pathname || "/";
    } catch (e) {
      return "/";
    }
  }

  function isWhatsApp(href) {
    return /(?:wa\.me|api\.whatsapp\.com|whatsapp\.com)/i.test(href || "");
  }

  /*
   * Older Auralis shared JS already records:
   * whatsapp_click, custom_order_click and pricing_process_click.
   * On those pages V2 only adds email_click, preventing duplicate events.
   */
  function hasLegacySharedClickTracker() {
    try {
      return Array.prototype.some.call(document.scripts, function (s) {
        var src = s.getAttribute("src") || "";
        return /\/assets\/auralis-(?:phase1(?:-v[45])?|phase3-v[23])\.js/i.test(src);
      });
    } catch (e) {
      return false;
    }
  }

  var legacyShared = hasLegacySharedClickTracker();

  document.addEventListener(
    "click",
    function (event) {
      var el =
        event.target.closest &&
        event.target.closest("a,button");

      if (!el) return;

      var href = el.getAttribute("href") || "";
      var id = el.getAttribute("id") || "";
      var label = cleanLabel(el, href);
      var common = {
        event_label: label,
        link_url: href || undefined,
        source_path: safePath(),
        tracking_version: "v2"
      };

      // Legacy shared click trackers do not consistently track mailto links.
      if (/^mailto:/i.test(href) || id === "sendEmail" || id === "wholesaleEmail") {
        sendEvent("email_click", Object.assign({
          event_category: "contact",
          contact_method: "email"
        }, common));
        return;
      }

      // Avoid duplicate WhatsApp/custom-order/pricing events on pages
      // already covered by the existing shared Auralis JS.
      if (legacyShared) return;

      if (isWhatsApp(href) || id === "sendWhatsApp" || id === "wholesaleWhatsApp") {
        sendEvent("whatsapp_click", Object.assign({
          event_category: "contact",
          contact_method: "whatsapp"
        }, common));
        return;
      }

      if (href.indexOf("/custom-order") !== -1) {
        sendEvent("custom_order_click", Object.assign({
          event_category: "conversion_intent",
          destination_path: "/custom-order"
        }, common));
        return;
      }

      if (href.indexOf("pricing-process") !== -1) {
        sendEvent("pricing_process_click", Object.assign({
          event_category: "decision_support"
        }, common));
      }
    },
    true
  );
})();
