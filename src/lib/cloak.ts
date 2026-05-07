/**
 * Opens the current page inside an about:blank iframe tab.
 * Common cloaking technique for unblocked game sites.
 */
export function openBlank(): void {
  const win = window.open();
  if (!win) {
    alert("Please allow popups to use this feature.");
    return;
  }
  const url = window.location.href;
  const iframe = win.document.createElement("iframe");

  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.src = url;

  win.document.body.style.margin = "0";
  win.document.body.appendChild(iframe);
}
