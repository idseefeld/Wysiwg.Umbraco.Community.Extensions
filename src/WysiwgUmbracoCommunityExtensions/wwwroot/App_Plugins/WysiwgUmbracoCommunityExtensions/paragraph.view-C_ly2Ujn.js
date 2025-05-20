import { UmbTextStyles as g } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as h, html as l, css as w, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { W as v } from "./wysiwg-base-block-editor-custom.view-Bzwoj4f9.js";
var d = Object.getOwnPropertyDescriptor, y = (a, e, r, t) => {
  for (var i = t > 1 ? void 0 : t ? d(e, r) : e, n = a.length - 1, o; n >= 0; n--)
    (o = a[n]) && (i = o(i) || i);
  return i;
};
const c = "wysiwg-block-paragraph-view";
let s = class extends v {
  update(a) {
    super.update(a), a.has("content") && this.disableLinks();
  }
  disableLinks() {
    var r;
    const a = (r = this.shadowRoot) == null ? void 0 : r.querySelector("div.paragraph");
    if (!a) return;
    const e = a.querySelector("a");
    e && (e.addEventListener("click", (t) => {
      t.preventDefault();
    }), this.requestUpdate());
  }
  render() {
    var i;
    const a = this.getLayoutSettings();
    var e = (i = this.content) == null ? void 0 : i.text, r = e == null ? void 0 : e.markup;
    const t = `<div class="paragraph" ${a.inlineStyle}>${r}</div>`;
    return l`${h(t)}`;
  }
};
s.styles = [
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
s = y([
  p(c)
], s);
const x = s;
export {
  s as WysiwgBlockParagraphView,
  x as default
};
//# sourceMappingURL=paragraph.view-C_ly2Ujn.js.map
