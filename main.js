(function portfolio() {
  var usingSW = ("serviceWorker" in navigator);
  var swRegistration;
  var svcworker;

  initServiceWorker().catch(console.error);

  async function initServiceWorker() {
    swRegistration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none" 
    });

    svcworker = swRegistration.installing || swRegistration.waiting || swRegistration.active;

    navigator.serviceWorker.addEventListener("controllerchange", function onController() {
      svcworker = navigator.serviceWorker.controller;
    });
  }
})();
