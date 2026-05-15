import { UmbTextStyles as E } from "@umbraco-cms/backoffice/style";
import { html as y, nothing as M, styleMap as v, css as $, property as f, state as m, customElement as P } from "@umbraco-cms/backoffice/external/lit";
import "./wysiwg-image-and-crop-picker.element-BRcRF30-.js";
import "./wysiwg-card-image.element-SMTzqmtn.js";
import { W as S } from "./services.gen-ya8kz8Ij.js";
import { W as H } from "./wysiwg-base-block-editor-custom.view-BXBLmnky.js";
import { U } from "./types-eEpi63XY.js";
var W = Object.defineProperty, z = Object.getOwnPropertyDescriptor, C = (t) => {
  throw TypeError(t);
}, d = (t, o, e, n) => {
  for (var i = n > 1 ? void 0 : n ? z(o, e) : o, u = t.length - 1, a; u >= 0; u--)
    (a = t[u]) && (i = (n ? a(o, e, i) : a(i)) || i);
  return n && i && W(o, e, i), i;
}, K = (t, o, e) => o.has(t) || C("Cannot " + e), D = (t, o, e) => o.has(t) ? C("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(t) : o.set(t, e), w = (t, o, e) => (K(t, o, "access private method"), e), k, _, B;
const c = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "",
  padding: void 0,
  minHeight: "0"
}, I = "wysiwg-block-layout-view";
let s = class extends H {
  constructor() {
    super(...arguments), D(this, k), this.pageBackroundColor = c.backgroundColor, this.backgroundStyleMap = c, this.isfirstElement = !1, this.pageBackgroundColor = void 0;
  }
  get backgroundStyles() {
    return {
      backgroundImage: this.backgroundStyleMap.backgroundImage,
      backgroundRepeat: this.backgroundStyleMap.backgroundRepeat,
      backgroundPosition: this.backgroundStyleMap.backgroundPosition,
      backgroundColor: this.backgroundStyleMap.backgroundColor,
      padding: this.backgroundStyleMap.padding,
      minHeight: this.backgroundStyleMap.minHeight
    };
  }
  get backgroundStyleDefaults() {
    return {
      backgroundImage: c.backgroundImage,
      backgroundRepeat: c.backgroundRepeat,
      backgroundPosition: c.backgroundPosition,
      backgroundColor: c.backgroundColor,
      padding: c.padding,
      minHeight: c.minHeight
    };
  }
  async prozessSettings(t) {
    var e, n, i;
    const o = "";
    if ((e = t.settingsData) != null && e.length) {
      const u = this, a = t.layout["Umbraco.BlockGrid"];
      if (!a) {
        console.error("No layout found");
        return;
      }
      const p = a[0].contentKey;
      this.isfirstElement = p === u.contentKey;
      const b = a == null ? void 0 : a.find(
        (r) => r.contentKey === u.contentKey
      ), g = (n = t == null ? void 0 : t.settingsData) == null ? void 0 : n.find(
        (r) => r.key === (b == null ? void 0 : b.settingsKey)
      ), l = (g == null ? void 0 : g.values) ?? [];
      this.setBackgroudStyle(l);
      const h = (i = l == null ? void 0 : l.find((r) => r.alias === "backgroundImage")) == null ? void 0 : i.value, x = h != null && h.length ? h[0].mediaKey : "";
      await w(this, k, _).call(this, x).then((r) => {
        r !== void 0 && r !== "error" && this.setBackgroudImageStyle(r);
      }), await w(this, k, B).call(this, o.toString()).then((r) => {
        r !== void 0 && r !== "error" && (this.pageBackgroundColor = r);
      });
    }
  }
  async lastStepObservingProperties(t) {
    var e;
    if (!t) return;
    let o = (e = t.find((n) => n.alias === "pageBackgroundColor")) == null ? void 0 : e.value;
    o != null && o.value && (this.pageBackroundColor = o.value);
  }
  setBackgroudStyle(t) {
    var e, n, i;
    const o = this.backgroundStyleDefaults;
    if (t != null && t.length) {
      const u = (((e = t == null ? void 0 : t.find((l) => l.alias === "backgroundColor")) == null ? void 0 : e.value) ?? {}).value, a = u || (this.pageBackgroundColor ? this.pageBackgroundColor : ""), p = this.isTransparentColor(a);
      a && (o.backgroundColor = p ? "" : a);
      const b = (((n = t == null ? void 0 : t.find((l) => l.alias === "minHeight")) == null ? void 0 : n.value) ?? "0").toString();
      o.minHeight = b;
      let g = (i = t == null ? void 0 : t.find((l) => l.alias === "padding")) == null ? void 0 : i.value.toString();
      g || (g = a && !p ? "10px" : ""), o.padding = g;
    }
    this.backgroundStyleMap = o;
  }
  setBackgroudImageStyle(t) {
    const o = this.backgroundStyles, e = o.padding ?? c.padding;
    t ? (o.backgroundImage = `url('${t}')`, o.backgroundPosition = "inherit", o.padding = !e || e === c.padding ? "10px" : e) : (o.backgroundImage = "none", o.backgroundPosition = "-10000px"), this.backgroundStyleMap = o;
  }
  renderUpdateHint() {
    const t = y`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;
    return !this.isfirstElement || this.updateStatus !== U.Update ? t : y`
        <uui-button id="tooltip-toggle" popovertarget="tooltip-popover" look="primary" type="button" color="danger" compact style="margin-right: 0.5rem;" label="Update Available">
          <uui-icon name="alert"></uui-icon>
        </uui-button>${t}

        <uui-popover-container id="tooltip-popover">

          <div class="popover-container" style="display: flex;flex-direction: column;padding: 1rem;border-radius: 3px;width: 200px;background: var(--uui-color-danger);box-shadow: var(--uui-shadow-depth-3);color: white;line-height: 1.4em;">
            <h3>
              <umb-localize key="wysiwg_updateAvailableTitle" .debug=${this._debug}>
                Update Available
              </umb-localize>
            </h3>
            <p>
              <umb-localize key="wysiwg_updateAvailable" .debug=${this._debug}>
                An update is available for the WYSIWYG extensions.
              </umb-localize>
            </p>
          </div>

        </uui-popover-container>
      `;
  }
  render() {
    var e, n;
    const t = { backgroundColor: this.pageBackroundColor }, o = this.backgroundStyleMap;
    return y`
    <umb-ref-grid-block class="wysiwg"
      style=${v(t)}
      standalone
      href=${((e = this.config) != null && e.showContentEdit ? (n = this.config) == null ? void 0 : n.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <div slot="name">${this.renderUpdateHint()}</div>
      ${this.unpublished ? y`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : M}

      <umb-block-grid-areas-container
        slot="areas"
        style="${v(o)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
k = /* @__PURE__ */ new WeakSet();
_ = async function(t) {
  if (!t)
    return;
  const o = {
    query: {
      mediaItemId: t
    }
  }, { data: e, error: n } = await S.imageUrl(o);
  if (n)
    return console.error(n), "error";
  if (e !== void 0)
    return e;
};
B = async function(t) {
  if (!t)
    return;
  const o = {
    query: {
      mediaItemId: t
    }
  }, { data: e, error: n } = await S.siteBackgroundColor(o);
  if (n)
    return console.error(n), "error";
  if (e !== void 0)
    return e;
};
s.styles = [
  E,
  $`
      :host {
        display: flex;
        height: 100%;
        box-sizing: border-box;
      }

      .left,
      .right {
        display: flexbox;
      }
    `
];
d([
  f({ attribute: !1 })
], s.prototype, "label", 2);
d([
  f({ type: String, reflect: !1 })
], s.prototype, "icon", 2);
d([
  f({ type: Boolean, reflect: !0 })
], s.prototype, "unpublished", 2);
d([
  m()
], s.prototype, "pageBackroundColor", 2);
d([
  m()
], s.prototype, "backgroundStyleMap", 2);
d([
  m()
], s.prototype, "isfirstElement", 2);
d([
  m()
], s.prototype, "pageBackgroundColor", 2);
s = d([
  P(I)
], s);
const N = s;
export {
  s as WysiwgBlockLayoutView,
  N as default
};
//# sourceMappingURL=block-layout.view-CUYASreV.js.map
