export function openEditor(href: string) {
  let fullUrl: URL;
  try {
    // Use the current document base URI as the base to resolve relative URLs
    // This respects the <base> tag and works the same as HTML anchors
    // Note: This may resolve into an external URL, but we validate that later
    fullUrl = new URL(href, document.baseURI);
  } catch {
    // Invalid URL, skip
    return;
  }

  // Only handle the anchor tag if the follow holds true:
  // - The HREF is relative to the origin of the current location.
  if (fullUrl.origin !== location.origin) {
    return;
  }

  // Change the history!
  history.pushState(null, '', fullUrl);
}
