import { useEffect } from "react";

export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (!href) return;

      // Ignore external links, new tab links, downloads, hash links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const nextUrl = new URL(href, window.location.href);

      // Only block same-origin app navigation
      if (nextUrl.origin !== window.location.origin) return;

      const shouldLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?",
      );

      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [isDirty]);
}