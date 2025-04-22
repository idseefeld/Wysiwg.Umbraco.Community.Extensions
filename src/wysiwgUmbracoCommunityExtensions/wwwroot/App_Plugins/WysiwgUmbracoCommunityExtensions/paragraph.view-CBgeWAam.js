import { UmbTextStyles as u } from "@umbraco-cms/backoffice/style";
import { LitElement as _, unsafeHTML as x, html as P, css as S, property as w, state as b, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as T } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as k } from "@umbraco-cms/backoffice/property";
var z = Object.defineProperty, C = Object.getOwnPropertyDescriptor, y = (e) => {
  throw TypeError(e);
}, c = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? C(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && z(t, i, s), s;
}, m = (e, t, i) => t.has(e) || y("Cannot " + i), O = (e, t, i) => (m(e, t, "read from private field"), t.get(e)), $ = (e, t, i) => t.has(e) ? y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), D = (e, t, i, a) => (m(e, t, "write to private field"), t.set(e, i), i), v;
const G = "wysiwg-block-paragraph-view";
let l = class extends T(_) {
  constructor() {
    super(), $(this, v), this.consumeContext(
      k,
      async (e) => this.getSettings(e)
    );
  }
  async getSettings(e) {
    var t;
    D(this, v, e), this.observe(
      (t = O(this, v)) == null ? void 0 : t.properties,
      async (i) => {
        var s, o;
        const a = i;
        if (a != null && a.length) {
          const r = a.filter((h) => h.editorAlias === "Umbraco.BlockGrid"), f = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          console.debug("editSettingsPath: ", f);
          let g = r[0];
          if (r.length > 1)
            for (let h = 0; h < r.length; h++) {
              const n = r[h];
              if (n.alias && f.indexOf(n.alias) >= 0) {
                g = n;
                break;
              }
            }
          const p = g.value;
          console.debug("thisGrid.alias: ", g.alias), (o = p.settingsData) != null && o.length && (this.datasetSettings = p.settingsData);
        }
      },
      "_observeProperties"
    );
  }
  render() {
    var o, r, f, g;
    let e = { value: "" }, t = "";
    if ((o = this.datasetSettings) != null && o.length) {
      const p = this.layout, n = ((f = ((r = this.datasetSettings.filter(
        (d) => (p == null ? void 0 : p.settingsKey) === d.key
      )[0]) == null ? void 0 : r.values).filter((d) => d.alias === "color")[0]) == null ? void 0 : f.value) ?? e;
      n != null && n.value && (t = `color: ${n == null ? void 0 : n.value};`);
    }
    t && (t = `style="${t}"`);
    var i = (g = this.content) == null ? void 0 : g.text, a = i == null ? void 0 : i.markup;
    const s = `<div class="paragraph" ${t}>${a}</div>`;
    return P`${x(s)}`;
  }
};
v = /* @__PURE__ */ new WeakMap();
l.styles = [
  u,
  S`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
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
    `
];
c([
  w({ attribute: !1 })
], l.prototype, "content", 2);
c([
  w({ attribute: !1 })
], l.prototype, "config", 2);
c([
  w({ attribute: !1 })
], l.prototype, "settings", 2);
c([
  b()
], l.prototype, "datasetSettings", 2);
l = c([
  E(G)
], l);
const V = l;
export {
  l as WysiwgBlockParagraphView,
  V as default
};
//# sourceMappingURL=paragraph.view-CBgeWAam.js.map
