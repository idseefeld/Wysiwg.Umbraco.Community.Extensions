import { UmbTextStyles as C } from "@umbraco-cms/backoffice/style";
import { html as g, nothing as B, styleMap as k, css as _, property as y, state as b, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { W as E } from "./wysiwg-base-block-editor-custom.view-ChCFhrhJ.js";
import { U as I } from "./types-eEpi63XY.js";
import { f as M, h as $ } from "./sdk.gen-ZN_nSxDw.js";
var P = Object.defineProperty, H = Object.getOwnPropertyDescriptor, f = (t) => {
  throw TypeError(t);
}, c = (t, e, o, a) => {
  for (var r = a > 1 ? void 0 : a ? H(e, o) : e, d = t.length - 1, l; d >= 0; d--)
    (l = t[d]) && (r = (a ? l(e, o, r) : l(r)) || r);
  return a && r && P(e, o, r), r;
}, U = (t, e, o) => e.has(t) || f("Cannot " + o), z = (t, e, o) => e.has(t) ? f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o), m = (t, e, o) => (U(t, e, "access private method"), o), p, v, w;
const s = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "",
  padding: void 0,
  minHeight: "0"
}, K = "wysiwg-block-layout-view";
let i = class extends E {
  constructor() {
    super(...arguments), z(this, p), this.pageBackroundColor = s.backgroundColor, this.backgroundStyleMap = s, this.isfirstElement = !1, this.pageBackgroundColor = void 0;
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
      backgroundImage: s.backgroundImage,
      backgroundRepeat: s.backgroundRepeat,
      backgroundPosition: s.backgroundPosition,
      backgroundColor: s.backgroundColor,
      padding: s.padding,
      minHeight: s.minHeight
    };
  }
  async prozessSettings(t) {
    if (t.settingsData?.length) {
      const o = this, a = t.layout["Umbraco.BlockGrid"];
      if (!a) {
        console.error("No layout found");
        return;
      }
      const r = a[0].contentKey;
      this.isfirstElement = r === o.contentKey;
      const d = a?.find(
        (n) => n.contentKey === o.contentKey
      ), u = t?.settingsData?.find(
        (n) => n.key === d?.settingsKey
      )?.values ?? [];
      this.setBackgroudStyle(u);
      const h = u?.find((n) => n.alias === "backgroundImage")?.value, S = h?.length ? h[0].mediaKey : "";
      await m(this, p, v).call(this, S).then((n) => {
        n !== void 0 && n !== "error" && this.setBackgroudImageStyle(n);
      }), await m(this, p, w).call(this, "").then((n) => {
        n !== void 0 && n !== "error" && (this.pageBackgroundColor = n);
      });
    }
  }
  async lastStepObservingProperties(t) {
    if (!t) return;
    let e = t.find((o) => o.alias === "pageBackgroundColor")?.value;
    e?.value && (this.pageBackroundColor = e.value);
  }
  setBackgroudStyle(t) {
    const e = this.backgroundStyleDefaults;
    if (t?.length) {
      const o = (t?.find((u) => u.alias === "backgroundColor")?.value ?? {}).value, a = o || (this.pageBackgroundColor ? this.pageBackgroundColor : ""), r = this.isTransparentColor(a);
      a && (e.backgroundColor = r ? "" : a);
      const d = (t?.find((u) => u.alias === "minHeight")?.value ?? "0").toString();
      e.minHeight = d;
      let l = t?.find((u) => u.alias === "padding")?.value.toString();
      l || (l = a && !r ? "10px" : ""), e.padding = l;
    }
    this.backgroundStyleMap = e;
  }
  setBackgroudImageStyle(t) {
    const e = this.backgroundStyles, o = e.padding ?? s.padding;
    t ? (e.backgroundImage = `url('${t}')`, e.backgroundPosition = "inherit", e.padding = !o || o === s.padding ? "10px" : o) : (e.backgroundImage = "none", e.backgroundPosition = "-10000px"), this.backgroundStyleMap = e;
  }
  renderUpdateHint() {
    const t = g`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;
    return !this.isfirstElement || this.updateStatus !== I.Update ? t : g`
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
    const t = { backgroundColor: this.pageBackroundColor }, e = this.backgroundStyleMap;
    return g`
    <umb-ref-grid-block class="wysiwg"
      style=${k(t)}
      standalone
      href=${(this.config?.showContentEdit ? this.config?.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <div slot="name">${this.renderUpdateHint()}</div>
      ${this.unpublished ? g`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : B}

      <umb-block-grid-areas-container
        slot="areas"
        style="${k(e)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
p = /* @__PURE__ */ new WeakSet();
v = async function(t) {
  if (!t)
    return;
  const e = {
    url: "/api/v1/wysiwg/imageurl",
    query: {
      mediaItemId: t
    }
  }, { data: o, error: a } = await M(e);
  if (a)
    return console.error(a), "error";
  if (o !== void 0)
    return o;
};
w = async function(t) {
  if (!t)
    return;
  const e = {
    url: "/api/v1/wysiwg/site-background-color",
    query: {
      pageKey: t
    }
  }, { data: o, error: a } = await $(e);
  if (a)
    return console.error(a), "error";
  if (o !== void 0)
    return o;
};
i.styles = [
  C,
  _`
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
c([
  y({ attribute: !1 })
], i.prototype, "label", 2);
c([
  y({ type: String, reflect: !1 })
], i.prototype, "icon", 2);
c([
  y({ type: Boolean, reflect: !0 })
], i.prototype, "unpublished", 2);
c([
  b()
], i.prototype, "pageBackroundColor", 2);
c([
  b()
], i.prototype, "backgroundStyleMap", 2);
c([
  b()
], i.prototype, "isfirstElement", 2);
c([
  b()
], i.prototype, "pageBackgroundColor", 2);
i = c([
  x(K)
], i);
const R = i;
export {
  i as WysiwgBlockLayoutView,
  R as default
};
//# sourceMappingURL=block-layout.view-lDPcdVm3.js.map
