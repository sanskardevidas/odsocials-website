/* Shared mobile navigation; delegated events also support page re-renders. */
(function () {
  "use strict";
  document.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-od-nav-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", toggle.getAttribute("aria-expanded") !== "true" ? "true" : "false");
      return;
    }
    var link = event.target.closest("[data-od-nav] a");
    if (link) {
      link.closest("[data-od-header]").querySelector("[data-od-nav-toggle]").setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var toggle = document.querySelector('[data-od-nav-toggle][aria-expanded="true"]');
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}());
