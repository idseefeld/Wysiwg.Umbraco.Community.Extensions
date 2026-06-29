import { UmbTextStyles as g } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as h, html as l, css as p, customElement as w } from "@umbraco-cms/backoffice/external/lit";
import { W as d } from "./wysiwg-base-block-editor-custom.view-Bo_aBM4F.js";
var c = Object.getOwnPropertyDescriptor, y = (e, a, i, r) => {
  for (var t = r > 1 ? void 0 : r ? c(a, i) : a, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (t = o(t) || t);
  return t;
};
const v = "wysiwg-block-paragraph-view";
let n = class extends d {
  disableLinks() {
    const e = this.shadowRoot?.querySelector("#paragraph");
    if (!e) return;
    const a = e.querySelectorAll("a");
    a?.length && a.forEach((i) => {
      try {
        i.addEventListener(
          "click",
          (r) => {
            r.preventDefault();
          },
          { capture: !0 }
          // Use capture to prevent the event from bubbling up
        );
      } catch (r) {
        console.warn("Error adding event listeners to links:", r);
      }
    });
  }
  updated(e) {
    super.updated(e), this.disableLinks();
  }
  render() {
    const e = this.getLayoutSettings();
    var a = this.content?.text, i = a?.markup;
    const r = `<div id="paragraph" ${e.inlineStyle}>${i}</div>`;
    return l`${h(r)}`;
  }
};
n.styles = [
  g,
  p`
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
n = y([
  w(v)
], n);
const x = n;
export {
  n as WysiwgBlockParagraphView,
  x as default
};
//# sourceMappingURL=paragraph.view-st0bYYTt.js.map
