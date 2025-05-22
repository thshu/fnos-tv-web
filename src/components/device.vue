<script>
let device = {}
var Ea = typeof window < "u";

let d = function (v) {
  v = v.toLowerCase(),
      v = v.replace(/(motorola edge)/, "").trim();
  let x = /(edg)[ /]([\w.]+)/.exec(v) || /(edga)[ /]([\w.]+)/.exec(v) || /(edgios)[ /]([\w.]+)/.exec(v) || /(edge)[ /]([\w.]+)/.exec(v) || /(opera)[ /]([\w.]+)/.exec(v) || /(opr)[ /]([\w.]+)/.exec(v) || /(chrome)[ /]([\w.]+)/.exec(v) || /(safari)[ /]([\w.]+)/.exec(v) || /(firefox)[ /]([\w.]+)/.exec(v) || v.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(v) || []
      , S = /(version)[ /]([\w.]+)/.exec(v)
      , O = /(ipad)/.exec(v) || /(iphone)/.exec(v) || /(windows)/.exec(v) || /(android)/.exec(v) || []
      , E = x[1] || "";
  E === "edge" && (O = [""]),
  E === "opr" && (E = "opera");
  let P;
  S && S.length > 2 && (P = S[2]),
      P = P || x[2] || "0";
  let _ = parseInt(P.split(".")[0], 10);
  return isNaN(_) && (_ = 0),
      {
        browser: E,
        version: P,
        platform: O[0] || "",
        versionMajor: _
      }
}

function i(v) {
  let x = /FNOS\/([\d.]+)|FNAppType\/(\w+)|FNAppVer\/([\d.]+)/g, S = {}, O;
  for (; (O = x.exec(v)) !== null;)
    O[1] && (S.fnOSVersion = O[1]),
    O[2] && (S.fnAppType = O[2]),
    O[3] && (S.fnAppVersion = O[3]);
  return S
}

function e() {
  var x;
  if (!Ea)
    return !1;
  let v = ((x = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : x.toLowerCase()) ?? "";
  return v.indexOf("netcast") !== -1 || v.indexOf("web0s") !== -1
}

function n(v) {
  let x = ["mobi", "ipad", "iphone", "ipod", "silk", "gt-p1000", "nexus 7", "kindle fire", "opera mini"]
      , S = v.toLowerCase();
  for (let O = 0, E = x.length; O < E; O++)
    if (S.indexOf(x[O]) !== -1)
      return !0;
  return !1
}

let h = navigator == null ? void 0 : navigator.userAgent
let m = d(h)
let g = i(h)

if (g.fnAppVersion ? (device.isFnApp = !0,
    device.fnAppVersion = g.fnAppVersion,
    device.fnOSVersion = g.fnOSVersion,
    device.fnAppType = g.fnAppType) : device.isFnApp = !1,
m.browser && (device[m.browser] = !0,
    device.version = m.version,
    device.versionMajor = m.versionMajor),
m.platform && (device[m.platform] = !0),
    device.edgeChromium = device.edg || device.edga || device.edgios,
!device.chrome && !device.edgeChromium && !device.edge && !device.opera && h.toLowerCase().indexOf("webkit") !== -1 && (device.safari = !0),
    device.osx = h.toLowerCase().indexOf("mac os x") !== -1,
device.osx && !device.iphone && !device.ipod && !device.ipad && (navigator == null ? void 0 : navigator.maxTouchPoints) > 1 && (device.ipad = !0),
h.toLowerCase().indexOf("playstation 4") !== -1 && (device.ps4 = !0,
    device.tv = !0),
n(h) && (device.mobile = !0),
h.toLowerCase().indexOf("xbox") !== -1 && (device.xboxOne = !0,
    device.tv = !0),
    device.animate = typeof document < "u" && document.documentElement.animate != null,
    device.hisense = h.toLowerCase().includes("hisense"),
    device.tizen = h.toLowerCase().indexOf("tizen") !== -1 || window.tizen != null,
    device.vidaa = h.toLowerCase().includes("vidaa"),
    device.web0s = e(),
    device.edgeUwp = device.edge && (h.toLowerCase().indexOf("msapphost") !== -1 || h.toLowerCase().indexOf("webview") !== -1),
    device.web0s)
  device.web0sVersion = o(b);
else if (device.tizen) {
  delete device.safari;
  let v = navigator == null ? void 0 : navigator.appVersion.match(/Tizen (\d+).(\d+)/);
  device.tizenVersion = parseInt((v == null ? void 0 : v[1]) ?? "", 10)
} else
  device.orsay = h.toLowerCase().indexOf("smarthub") !== -1;

var Ie = (s, e, t) => e in s ? Re(s, e, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: t
}) : s[e] = t;

var ge = (s, e, t) => Ie(s, typeof e != "symbol" ? e + "" : e, t);

class MediaCanPlayChecker {
  constructor() {
    ge(this, "videoTestElement");
    ge(this, "maxChannelCount", null);
    ge(this, "hevc");
    ge(this, "eac3");
    ge(this, "ac3");
    ge(this, "audioChannels");
    this.videoTestElement = document.createElement("video"),
        this.hevc = this.supportsHevc(),
        this.eac3 = this.supportsEac3(),
        this.ac3 = this.supportsAc3(),
        this.audioChannels = this.getPhysicalAudioChannels()
  }
  supportsHevc() {
    // return PresetPlayer.isHevcSupported()
    return true
  }
  supportsEac3() {
    return device.tizen || device.web0s ? !0 : device.iOS && device.iOSVersion < 11 ? !1 : !!this.videoTestElement.canPlayType('audio/mp4; codecs="ec-3"').replace(/no/, "")
  }
  supportsAc3() {
    return device.edgeUwp || device.tizen || device.web0s ? !0 : device.iOS && device.iOSVersion < 11 ? !1 : !!this.videoTestElement.canPlayType('audio/mp4; codecs="ac-3"').replace(/no/, "")
  }
  getPhysicalAudioChannels() {
    const e = parseInt("-1", 10);
    if (e > 0)
      return e;
    const t = device.safari || device.chrome || device.edgeChromium || device.firefox || device.tv || device.ps4 || device.xboxOne
        , i = this.supportsAc3() || this.supportsEac3()
        , r = this.getSpeakerCount();
    return i && t ? r > 6 ? r : 6 : r > 2 ? t ? r : 2 : r > 0 ? r : t ? 6 : 2
  }
  getSpeakerCount() {
    if (this.maxChannelCount != null)
      return this.maxChannelCount;
    this.maxChannelCount = -1;
    const e = window.AudioContext || window.webkitAudioContext || !1;
    if (e) {
      const t = new e;
      this.maxChannelCount = t.destination.maxChannelCount
    }
    return this.maxChannelCount
  }
}

const mediaCanPlay = new MediaCanPlayChecker;

export default {
  device,
  mediaCanPlay
}
</script>

