import { UmbTextStyles as o } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as h, html as g, css as w, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { W as d } from "./wysiwg-base-block-editor-custom.view-Bzwoj4f9.js";
var y = Object.getOwnPropertyDescriptor, c = (e, n, a, i) => {
  for (var t = i > 1 ? void 0 : i ? y(n, a) : n, l = e.length - 1, r; l >= 0; l--)
    (r = e[l]) && (t = r(t) || t);
  return t;
};
const v = "wysiwg-block-headline-view";
let s = class extends d {
  render() {
    var i;
    const e = this.getLayoutSettings(), n = ((i = this.content) == null ? void 0 : i.text) ?? "Headline", a = `<${e.size} class="headline" ${e.inlineStyle}>${n}</${e.size}>`;
    return g`${h(a)}`;
  }
};
s.styles = [
  o,
  w`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      h1, h2, h3 {
        margin: 0;
      }
      .headline{
        color: var(--wysiwg-headline-color, inherit);
        text-shadow: var(--wysiwg-headline-text-shadow, none);
      }
      h1 {
        font-size: var(--wysiwg-headline-1-font-size, 32px);
        line-height: var(--wysiwg-headline-1-line-height, 1.2em);
        margin: var(--wysiwg-headline-1-margin, 0);
      }
      h2 {
        font-size: var(--wysiwg-headline-2-font-size, 28px);
        line-height: var(--wysiwg-headline-2-line-height, 1.2em);
        margin: var(--wysiwg-headline-2-margin, 0);
      }
      h3 {
        font-size: var(--wysiwg-headline-3-font-size , 24px);
        line-height: var(--wysiwg-headline-3-line-height, 1.2em);
        margin: var(--wysiwg-headline-3-margin, 0);
      }
    `
];
s = c([
  m(v)
], s);
const u = s;
export {
  s as WysiwgBlockHeadlineView,
  u as default
};
//# sourceMappingURL=headline.view-C0xQLh0P.js.map
