/**
 * Service worker registration. Loaded as a plain <script> in <head> so it
 * executes before React hydrates but doesn't block rendering (module script).
 *
 * When a new SW is waiting (app updated), we dispatch a custom event so the
 * in-app UpdateToast component can prompt the user to reload.
 */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // When a new SW installs, tell it to skip waiting immediately — the
        // user gets the update automatically on the next navigation without
        // needing to press anything.
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // New SW is waiting — tell it to activate right away.
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            }
          });
        });
      })
      .catch(() => {});

    // When the SW changes (new one took control), reload all clients so they
    // immediately use the fresh cached assets.
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
