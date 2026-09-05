import { css as o, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { W as h } from "./wysiwg-base-block-editor-custom.view-CxUo8Q00.js";
var w = Object.getOwnPropertyDescriptor, d = (e, i, s, l) => {
  for (var n = l > 1 ? void 0 : l ? w(i, s) : i, a = e.length - 1, r; a >= 0; a--)
    (r = e[a]) && (n = r(n) || n);
  return n;
};
const m = "wysiwg-block-headline-view";
let t = class extends h {
  render() {
    const e = this.getLayoutSettings(), i = this.content?.text ?? "Headline", s = `<${e.size} class="headline" ${e.inlineStyle}>${i}</${e.size}>`;
    return this.setEditorLink(s);
  }
};
t.styles = [
  h.baseStyles,
  o`
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
t = d([
  g(m)
], t);
const v = t;
export {
  t as WysiwgBlockHeadlineView,
  v as default
};
//# sourceMappingURL=headline.view-BYyisxcy.js.map
