import { UmbTextStyles as g } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as h, html as l, css as w, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { W as d } from "./wysiwg-base-block-editor-custom.view-vKxVjFVc.js";
var c = Object.getOwnPropertyDescriptor, v = (r, e, i, t) => {
  for (var a = t > 1 ? void 0 : t ? c(e, i) : e, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (a = o(a) || a);
  return a;
};
const y = "wysiwg-block-paragraph-view";
let n = class extends d {
  disableLinks() {
    var i;
    const r = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#paragraph");
    if (!r) return;
    const e = r.querySelectorAll("a");
    e != null && e.length && e.forEach((t) => {
      try {
        t.addEventListener(
          "click",
          (a) => {
            a.preventDefault();
          },
          { capture: !0 }
          // Use capture to prevent the event from bubbling up
        );
      } catch (a) {
        console.warn("Error adding event listeners to links:", a);
      }
    });
  }
  updated(r) {
    super.updated(r), this.disableLinks();
  }
  render() {
    var a;
    const r = this.getLayoutSettings();
    var e = (a = this.content) == null ? void 0 : a.text, i = e == null ? void 0 : e.markup;
    const t = `<div id="paragraph" ${r.inlineStyle}>${i}</div>`;
    return l`${h(t)}`;
  }
};
n.styles = [
  g,
  w`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      #paragraph {
        font-size: var(--wysiwg-font-size-16);
        line-height: var(--wysiwg-line-height-24);
        text-shadow: var(--wysiwg-paragraph-text-shadow, none);
      }
      h2, h3{
        color: var(--wysiwg-paragraph-headline-color, inherit);
        text-shadow: var(--wysiwg-paragraph-headline-text-shadow, none);
      }
      h2 {
        font-size: var(--wysiwg-font-size-24, 24px);
        line-height: var(--wysiwg-line-height-28, 28px);
        margin: var(--wysiwg-headline-paragraph-2-margin, 0);
      }

      h3 {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-headline-paragraph-3-margin, 0);
      }

      p
      {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-p-paragraph-margin, 0);
        padding: var(--wysiwg-p-paragraph-padding, 0);
        color: var(--wysiwg-paragraph-color, inherit);
      }

      a{
        color: inherit;
        text-decoration: var(--wysiwg-link-text-decoration, underline);
      }

      a:hover{
        color: var(--wysiwg-link-hover-color, inherit);
      }
    `
];
n = v([
  p(y)
], n);
const x = n;
export {
  n as WysiwgBlockParagraphView,
  x as default
};
//# sourceMappingURL=paragraph.view-YJ5i0mqz.js.map
