/**
 * ThemeScript — inline, blocking script that applies the persisted theme to
 * <html> before first paint, preventing a flash of the wrong palette/mode.
 *
 * It mirrors the keys used by ThemeProvider but runs ahead of React hydration.
 */

import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PALETTE,
  THEME_STORAGE_KEYS,
} from "@/constants/theme";

export function ThemeScript() {
  const script = `(function(){try{
    var m = localStorage.getItem('${THEME_STORAGE_KEYS.mode}') || '${DEFAULT_THEME_MODE}';
    var p = localStorage.getItem('${THEME_STORAGE_KEYS.palette}') || '${DEFAULT_THEME_PALETTE}';
    var resolved = m === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : m;
    var el = document.documentElement;
    el.setAttribute('data-palette', p);
    el.setAttribute('data-theme', resolved);
    el.setAttribute('data-mode', m);
  }catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
