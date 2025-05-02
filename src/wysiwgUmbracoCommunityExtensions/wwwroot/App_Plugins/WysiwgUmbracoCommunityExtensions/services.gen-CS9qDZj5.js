import { J as a, x as t } from "./services.gen-B_ebHh4e.js";
const r = a(t());
class g {
  static getServerConfiguration(e) {
    return ((e == null ? void 0 : e.client) ?? r).get({
      ...e,
      url: "/umbraco/management/api/v1/server/configuration"
    });
  }
  static getServerInformation(e) {
    return ((e == null ? void 0 : e.client) ?? r).get({
      ...e,
      url: "/umbraco/management/api/v1/server/information"
    });
  }
  static getServerStatus(e) {
    return ((e == null ? void 0 : e.client) ?? r).get({
      ...e,
      url: "/umbraco/management/api/v1/server/status"
    });
  }
  static getServerTroubleshooting(e) {
    return ((e == null ? void 0 : e.client) ?? r).get({
      ...e,
      url: "/umbraco/management/api/v1/server/troubleshooting"
    });
  }
  static getServerUpgradeCheck(e) {
    return ((e == null ? void 0 : e.client) ?? r).get({
      ...e,
      url: "/umbraco/management/api/v1/server/upgrade-check"
    });
  }
}
export {
  g as S,
  r as c
};
//# sourceMappingURL=services.gen-CS9qDZj5.js.map
