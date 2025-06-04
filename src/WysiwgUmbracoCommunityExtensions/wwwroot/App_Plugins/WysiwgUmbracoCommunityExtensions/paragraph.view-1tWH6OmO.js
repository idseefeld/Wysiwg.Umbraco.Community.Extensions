import { UmbTextStyles as g } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as h, html as l, css as w, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { W as c } from "./wysiwg-base-block-editor-custom.view--GL6EEZz.js";
var d = Object.getOwnPropertyDescriptor, v = (a, e, i, t) => {
  for (var r = t > 1 ? void 0 : t ? d(e, i) : e, s = a.length - 1, o; s >= 0; s--)
    (o = a[s]) && (r = o(r) || r);
  return r;
};
const y = "wysiwg-block-paragraph-view";
let n = class extends c {
  disableLinks() {
    var i;
    const a = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#paragraph");
    if (!a) return;
    const e = a.querySelectorAll("a");
    e != null && e.length && e.forEach((t) => {
      try {
        t.addEventListener(
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
  updated(a) {
    super.updated(a), this.disableLinks();
  }
  render() {
    var r;
    const a = this.getLayoutSettings();
    var e = (r = this.content) == null ? void 0 : r.text, i = e == null ? void 0 : e.markup;
    const t = `<div id="paragraph" ${a.inlineStyle}>${i}</div>`;
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
      .paragraph {
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
//# sourceMappingURL=paragraph.view-1tWH6OmO.js.map
