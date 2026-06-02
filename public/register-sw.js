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
        // Detect when a new SW has installed and is waiting.
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content available — notify the app.
              window.dispatchEvent(new CustomEvent("sw-update-ready"));
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed (e.g. dev mode, insecure origin). Silently ignore.
      });
  });
}
