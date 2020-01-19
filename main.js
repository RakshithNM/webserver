(function portfolio() {
  var isOnline = ("onLine" in navigator) ? navigator.onLine : true;
  var swRegistration;
  var svcworker;

  document.addEventListener("DOMContentLoaded", ready, false);

  function ready() {
    var body = document.querySelector('body');
    if(!isOnline) {
      body.style = "background: red"
    }
    window.addEventListener("online", function online() {
      body.style = "background: green"
      isOnline = true;
    })

    window.addEventListener("offline", function offline() {
      body.style = "background: red"
      isOnline = false;
    })
  }

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
