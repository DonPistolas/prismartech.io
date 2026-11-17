/*
 * Medición para publicidad (Google Ads / GA4 y Meta Ads).
 * Pega tus IDs aquí y todo el sitio queda medido. Vacío = no se carga nada.
 *   GA4:        G-XXXXXXXXXX       (analytics.google.com → Admin → Flujos de datos)
 *   Google Ads: AW-XXXXXXXXXX      (opcional, para conversiones de campañas)
 *   Meta Pixel: 15-16 dígitos      (business.facebook.com → Administrador de eventos)
 */
window.PRISMA_TRACKING = {
  ga4: "",
  googleAds: "",
  metaPixel: ""
};

(function () {
  var cfg = window.PRISMA_TRACKING;

  if (cfg.ga4 || cfg.googleAds) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + (cfg.ga4 || cfg.googleAds);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    if (cfg.ga4) gtag("config", cfg.ga4);
    if (cfg.googleAds) gtag("config", cfg.googleAds);
  }

  if (cfg.metaPixel) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", cfg.metaPixel);
    fbq("track", "PageView");
  }

  /* Cualquier elemento con data-track="nombre" manda un evento al hacer clic.
     Los clics a WhatsApp cuentan como "Contact" (Meta) y "generate_lead" (Google). */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (!el) return;
    var name = el.getAttribute("data-track");
    var isLead = /whatsapp|muestra|pedido/i.test(name);
    if (window.gtag) gtag("event", isLead ? "generate_lead" : "select_content", { event_label: name });
    if (window.fbq) fbq("track", isLead ? "Contact" : "ViewContent", { content_name: name });
  });
})();
