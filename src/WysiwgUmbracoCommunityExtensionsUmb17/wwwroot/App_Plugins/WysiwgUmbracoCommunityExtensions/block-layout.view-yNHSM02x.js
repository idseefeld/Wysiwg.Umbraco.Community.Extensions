import { UmbTextStyles as x } from "@umbraco-cms/backoffice/style";
import { html as y, nothing as E, styleMap as v, css as M, property as f, state as k, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as P } from "./wysiwg-base-block-editor-custom.view-Bj-ISVRt.js";
import { U as H } from "./types-eEpi63XY.js";
import { f as I, h as z } from "./sdk.gen-DoNa0lH6.js";
var U = Object.defineProperty, W = Object.getOwnPropertyDescriptor, S = (t) => {
  throw TypeError(t);
}, d = (t, o, e, n) => {
  for (var i = n > 1 ? void 0 : n ? W(o, e) : o, u = t.length - 1, a; u >= 0; u--)
    (a = t[u]) && (i = (n ? a(o, e, i) : a(i)) || i);
  return n && i && U(o, e, i), i;
}, D = (t, o, e) => o.has(t) || S("Cannot " + e), K = (t, o, e) => o.has(t) ? S("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(t) : o.set(t, e), w = (t, o, e) => (D(t, o, "access private method"), e), m, C, _;
const c = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "",
  padding: void 0,
  minHeight: "0"
}, A = "wysiwg-block-layout-view";
let s = class extends P {
  constructor() {
    super(...arguments), K(this, m), this.pageBackroundColor = c.backgroundColor, this.backgroundStyleMap = c, this.isfirstElement = !1, this.pageBackgroundColor = void 0;
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
      const h = a[0].contentKey;
      this.isfirstElement = h === u.contentKey;
      const b = a == null ? void 0 : a.find(
        (r) => r.contentKey === u.contentKey
      ), g = (n = t == null ? void 0 : t.settingsData) == null ? void 0 : n.find(
        (r) => r.key === (b == null ? void 0 : b.settingsKey)
      ), l = (g == null ? void 0 : g.values) ?? [];
      this.setBackgroudStyle(l);
      const p = (i = l == null ? void 0 : l.find((r) => r.alias === "backgroundImage")) == null ? void 0 : i.value, B = p != null && p.length ? p[0].mediaKey : "";
      await w(this, m, C).call(this, B).then((r) => {
        r !== void 0 && r !== "error" && this.setBackgroudImageStyle(r);
      }), await w(this, m, _).call(this, o.toString()).then((r) => {
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
      const u = (((e = t == null ? void 0 : t.find((l) => l.alias === "backgroundColor")) == null ? void 0 : e.value) ?? {}).value, a = u || (this.pageBackgroundColor ? this.pageBackgroundColor : ""), h = this.isTransparentColor(a);
      a && (o.backgroundColor = h ? "" : a);
      const b = (((n = t == null ? void 0 : t.find((l) => l.alias === "minHeight")) == null ? void 0 : n.value) ?? "0").toString();
      o.minHeight = b;
      let g = (i = t == null ? void 0 : t.find((l) => l.alias === "padding")) == null ? void 0 : i.value.toString();
      g || (g = a && !h ? "10px" : ""), o.padding = g;
    }
    this.backgroundStyleMap = o;
  }
  setBackgroudImageStyle(t) {
    const o = this.backgroundStyles, e = o.padding ?? c.padding;
    t ? (o.backgroundImage = `url('${t}')`, o.backgroundPosition = "inherit", o.padding = !e || e === c.padding ? "10px" : e) : (o.backgroundImage = "none", o.backgroundPosition = "-10000px"), this.backgroundStyleMap = o;
  }
  renderUpdateHint() {
    const t = y`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;
    return !this.isfirstElement || this.updateStatus !== H.Update ? t : y`
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
          ></uui-tag>` : E}

      <umb-block-grid-areas-container
        slot="areas"
        style="${v(o)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
m = /* @__PURE__ */ new WeakSet();
C = async function(t) {
  if (!t)
    return;
  const o = {
    url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/imageurl",
    query: {
      mediaItemId: t
    }
  }, { data: e, error: n } = await I(o);
  if (n)
    return console.error(n), "error";
  if (e !== void 0)
    return e;
};
_ = async function(t) {
  if (!t)
    return;
  const o = {
    url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/site-background-color",
    query: {
      pageKey: t
    }
  }, { data: e, error: n } = await z(o);
  if (n)
    return console.error(n), "error";
  if (e !== void 0)
    return e;
};
s.styles = [
  x,
  M`
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
  k()
], s.prototype, "pageBackroundColor", 2);
d([
  k()
], s.prototype, "backgroundStyleMap", 2);
d([
  k()
], s.prototype, "isfirstElement", 2);
d([
  k()
], s.prototype, "pageBackgroundColor", 2);
s = d([
  $(A)
], s);
const G = s;
export {
  s as WysiwgBlockLayoutView,
  G as default
};
//# sourceMappingURL=block-layout.view-yNHSM02x.js.map
