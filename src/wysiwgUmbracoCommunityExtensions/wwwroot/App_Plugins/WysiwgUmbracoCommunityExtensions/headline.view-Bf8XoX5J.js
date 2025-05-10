import { UmbTextStyles as u } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as p, html as x, css as z, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as b } from "./wysiwg-base-block-editor-custom.view-CYVB1wdx.js";
var k = Object.getOwnPropertyDescriptor, C = (i, e, o, l) => {
  for (var t = l > 1 ? void 0 : l ? k(e, o) : e, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (t = n(t) || t);
  return t;
};
const B = "wysiwg-block-headline-view";
let r = class extends b {
  constructor() {
    super(...arguments), this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var t, s, n, m, d, c, f, y;
    let i = "h1", e = "";
    if ((t = this.datasetSettings) != null && t.length) {
      const h = this.layout, g = (s = this.datasetSettings.filter(
        (a) => (h == null ? void 0 : h.settingsKey) === a.key
      )[0]) == null ? void 0 : s.values;
      i = ((m = (n = g.filter((a) => a.alias === "size")[0]) == null ? void 0 : n.value) == null ? void 0 : m.toString().toLowerCase()) ?? i;
      const w = ((c = (d = g.filter((a) => a.alias === "color")[0]) == null ? void 0 : d.value) == null ? void 0 : c.value) ?? this.defaultColor.value;
      w && !this.isTransparentColor(w) && (e = `color: ${w};`);
      const v = ((f = g.filter((a) => a.alias === "margin")[0]) == null ? void 0 : f.value) ?? "";
      v && (e += `margin: ${v};`), e && (e = `style="${e}"`);
    }
    const o = ((y = this.content) == null ? void 0 : y.text) ?? "Headline", l = `<${i} class="headline" ${e}>${o}</${i}>`;
    return x`${p(l)}`;
  }
};
r.styles = [
  u,
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
r = C([
  $(B)
], r);
const W = r;
export {
  r as WysiwgBlockHeadlineView,
  W as default
};
//# sourceMappingURL=headline.view-Bf8XoX5J.js.map
