import { UmbTextStyles as p } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as u, html as x, css as z, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as b } from "./wysiwg-base-block-editor-custom.view-DVhqiDDI.js";
var k = Object.getOwnPropertyDescriptor, H = (i, e, o, l) => {
  for (var t = l > 1 ? void 0 : l ? k(e, o) : e, s = i.length - 1, a; s >= 0; s--)
    (a = i[s]) && (t = a(t) || t);
  return t;
};
const S = "wysiwg-block-headline-view";
let r = class extends b {
  render() {
    var t, s, a, m, d, c, y, f;
    let i = "h1", e = "";
    if ((t = this.datasetSettings) != null && t.length) {
      const h = this.layout, g = (s = this.datasetSettings.filter(
        (n) => (h == null ? void 0 : h.settingsKey) === n.key
      )[0]) == null ? void 0 : s.values;
      i = ((m = (a = g.filter((n) => n.alias === "size")[0]) == null ? void 0 : a.value) == null ? void 0 : m.toString().toLowerCase()) ?? i;
      const w = ((c = (d = g.filter((n) => n.alias === "color")[0]) == null ? void 0 : d.value) == null ? void 0 : c.value) ?? "";
      w && !this.isTransparentColor(w) && (e = `color: ${w};`);
      const v = ((y = g.filter((n) => n.alias === "margin")[0]) == null ? void 0 : y.value) ?? "";
      v && (e += `margin: ${v};`), e && (e = `style="${e}"`);
    }
    const o = ((f = this.content) == null ? void 0 : f.text) ?? "Headline", l = `<${i} class="headline" ${e}>${o}</${i}>`;
    return x`${u(l)}`;
  }
};
r.styles = [
  p,
  z`
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
r = H([
  $(S)
], r);
const W = r;
export {
  r as WysiwgBlockHeadlineView,
  W as default
};
//# sourceMappingURL=headline.view-Bs57Ozuv.js.map
