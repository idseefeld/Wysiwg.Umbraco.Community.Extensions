import { UmbTextStyles as u } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as p, html as x, css as z, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as b } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var k = Object.getOwnPropertyDescriptor, B = (i, e, o, l) => {
  for (var t = l > 1 ? void 0 : l ? k(e, o) : e, n = i.length - 1, a; n >= 0; n--)
    (a = i[n]) && (t = a(t) || t);
  return t;
};
const C = "wysiwg-block-headline-view";
let r = class extends b {
  constructor() {
    super(...arguments), this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var t, n, a, m, w, f, c, d;
    let i = "h1", e = "";
    if ((t = this.datasetSettings) != null && t.length) {
      const g = this.layout, h = (n = this.datasetSettings.filter(
        (s) => (g == null ? void 0 : g.settingsKey) === s.key
      )[0]) == null ? void 0 : n.values;
      i = ((m = (a = h.filter((s) => s.alias === "size")[0]) == null ? void 0 : a.value) == null ? void 0 : m.toString().toLowerCase()) ?? i;
      const y = ((f = (w = h.filter((s) => s.alias === "color")[0]) == null ? void 0 : w.value) == null ? void 0 : f.value) ?? this.defaultColor.value;
      y && (e = `color: ${y};`);
      const v = ((c = h.filter((s) => s.alias === "margin")[0]) == null ? void 0 : c.value) ?? "";
      v && (e += `margin: ${v};`), e && (e = `style="${e}"`);
    }
    const o = ((d = this.content) == null ? void 0 : d.text) ?? "Headline", l = `<${i} ${e}>${o}</${i}>`;
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
r = B([
  $(C)
], r);
const W = r;
export {
  r as WysiwgBlockHeadlineView,
  W as default
};
//# sourceMappingURL=headline.view-DPLPckUa.js.map
