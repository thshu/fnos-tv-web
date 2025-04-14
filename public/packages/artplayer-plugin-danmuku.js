/*!
 * artplayer-plugin-danmuku.js v5.1.6
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2025 Harvey Zack
 * Released under the MIT License.
 */
!function (t, e, i, a, n, o, s, l) {
    var r = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {},
        d = "function" == typeof r[a] && r[a], p = d.i || {}, u = d.cache || {},
        h = "undefined" != typeof module && "function" == typeof module.require && module.require.bind(module);

    function m(e, i) {
        if (!u[e]) {
            if (!t[e]) {
                if (n[e]) return n[e];
                var o = "function" == typeof r[a] && r[a];
                if (!i && o) return o(e, !0);
                if (d) return d(e, !0);
                if (h && "string" == typeof e) return h(e);
                var s = Error("Cannot find module '" + e + "'");
                throw s.code = "MODULE_NOT_FOUND", s
            }
            p.resolve = function (i) {
                var a = t[e][1][i];
                return null != a ? a : i
            }, p.cache = {};
            var l = u[e] = new m.Module(e);
            t[e][0].call(l.exports, p, l, l.exports, r)
        }
        return u[e].exports;

        function p(t) {
            var e = p.resolve(t);
            return !1 === e ? {} : m(e)
        }
    }

    m.isParcelRequire = !0, m.Module = function (t) {
        this.id = t, this.bundle = m, this.require = h, this.exports = {}
    }, m.modules = t, m.cache = u, m.parent = d, m.distDir = void 0, m.publicUrl = void 0, m.devServer = void 0, m.i = p, m.register = function (e, i) {
        t[e] = [function (t, e) {
            e.exports = i
        }, {}]
    }, Object.defineProperty(m, "root", {
        get: function () {
            return r[a]
        }
    }), r[a] = m;
    for (var c = 0; c < e.length; c++) m(e[c]);
    if (i) {
        var f = m(i);
        "object" == typeof exports && "undefined" != typeof module ? module.exports = f : "function" == typeof define && define.amd && define(function () {
            return f
        })
    }
}({
    bgm6t: [function (t, e, i, a) {
        var n = t("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(i), n.export(i, "default", () => u);
        var o = t("./danmuku"), s = n.interopDefault(o), l = t("./setting"), r = n.interopDefault(l),
            d = t("./heatmap"), p = n.interopDefault(d);

        function u(t) {
            return e => {
                let i = new (0, s.default)(e, t), a = new (0, r.default)(e, i);
                return i.option.heatmap && (0, p.default)(e, i, i.option.heatmap), {
                    name: "artplayerPluginDanmuku",
                    emit: i.emit.bind(i),
                    load: i.load.bind(i),
                    config: i.config.bind(i),
                    hide: i.hide.bind(i),
                    show: i.show.bind(i),
                    reset: i.reset.bind(i),
                    mount: a.mount.bind(a),
                    get option() {
                        return i.option
                    },
                    get isHide() {
                        return i.isHide
                    },
                    get isStop() {
                        return i.isStop
                    }
                }
            }
        }

        u.icons = r.default.icons, "undefined" != typeof window && (window.artplayerPluginDanmuku = u)
    }, {
        "./danmuku": "4ns48",
        "./setting": "lO8OT",
        "./heatmap": "8AxLD",
        "@parcel/transformer-js/src/esmodule-helpers.js": "9pCYc"
    }], "4ns48": [function (t, e, i, a) {
        var n = t("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(i);
        var o = t("./bilibili"), s = t("bundle-text:./worker"), l = n.interopDefault(s);

        class r {
            constructor(t, e) {
                let {constructor: i, template: a} = t;
                this.utils = i.utils, this.validator = i.validator, this.$danmuku = a.$danmuku, this.$player = a.$player, this.art = t, this.queue = [], this.$refs = [], this.isStop = !1, this.isHide = !1, this.timer = null, this.index = 0, this.option = r.option, this.states = {
                    wait: [],
                    ready: [],
                    emit: [],
                    stop: []
                }, this.config(e);
                let n = new Blob([l.default], {type: "application/javascript"});
                this.worker = new Worker(URL.createObjectURL(n)), this.start = this.start.bind(this), this.stop = this.stop.bind(this), this.reset = this.reset.bind(this), this.resize = this.resize.bind(this), this.destroy = this.destroy.bind(this), t.on("video:play", this.start), t.on("video:playing", this.start), t.on("video:pause", this.stop), t.on("video:waiting", this.stop), t.on("destroy", this.destroy), t.on("resize", this.resize), this.load()
            }

            static get option() {
                return {
                    danmuku: [],
                    speed: 5,
                    margin: [10, "25%"],
                    opacity: 1,
                    color: "#FFFFFF",
                    mode: 0,
                    modes: [0, 1, 2],
                    fontSize: 25,
                    antiOverlap: !0,
                    synchronousPlayback: !1,
                    mount: void 0,
                    heatmap: !1,
                    width: 512,
                    points: [],
                    filter: () => !0,
                    beforeEmit: () => !0,
                    beforeVisible: () => !0,
                    visible: !0,
                    emitter: !0,
                    maxLength: 200,
                    lockTime: 5,
                    theme: "dark",
                    OPACITY: {},
                    FONT_SIZE: {},
                    MARGIN: {},
                    SPEED: {},
                    COLOR: []
                }
            }

            static get scheme() {
                return {
                    danmuku: "array|function|string",
                    speed: "number",
                    margin: "array",
                    opacity: "number",
                    color: "string",
                    mode: "number",
                    modes: "array",
                    fontSize: "number|string",
                    antiOverlap: "boolean",
                    synchronousPlayback: "boolean",
                    mount: "?htmldivelement|string",
                    heatmap: "object|boolean",
                    width: "number",
                    points: "array",
                    filter: "function",
                    beforeEmit: "function",
                    beforeVisible: "function",
                    visible: "boolean",
                    emitter: "boolean",
                    maxLength: "number",
                    lockTime: "number",
                    theme: "string",
                    OPACITY: "object",
                    FONT_SIZE: "object",
                    MARGIN: "object",
                    SPEED: "object",
                    COLOR: "array"
                }
            }

            static get cssText() {
                return ` user-select: none; position: absolute; white-space: pre; pointer-events: none; perspective: 500px; display: inline-block; will-change: transform; font-weight: normal; line-height: 1.125; visibility: hidden; font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif; text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px; `
            }

            get isRotate() {
                return this.art.plugins?.autoOrientation?.state
            }

            get marginTop() {
                let {clamp: t} = this.utils, e = this.option.margin[0], {clientHeight: i} = this.$player;
                return "number" == typeof e ? t(e, 0, i) : "string" == typeof e && e.endsWith("%") ? t(i * (parseFloat(e) / 100), 0, i) : r.option.margin[0]
            }

            get marginBottom() {
                let {clamp: t} = this.utils, e = this.option.margin[1], {clientHeight: i} = this.$player;
                return "number" == typeof e ? t(e, 0, i) : "string" == typeof e && e.endsWith("%") ? t(i * (parseFloat(e) / 100), 0, i) : r.option.margin[1]
            }

            get fontSize() {
                let {clamp: t} = this.utils, {clientHeight: e} = this.$player, i = this.option.fontSize;
                return "number" == typeof i ? Math.round(t(i, 12, e)) : "string" == typeof i && i.endsWith("%") ? Math.round(t(e * (parseFloat(i) / 100), 12, e)) : r.option.fontSize
            }

            get $ref() {
                let t = this.$refs.pop() || document.createElement("div");
                return t.style.cssText = r.cssText, t.dataset.mode = "", t.className = "", t
            }

            get readys() {
                let {currentTime: t} = this.art, e = [];
                return this.filter("ready", t => e.push(t)), this.filter("wait", i => {
                    t + .1 >= i.time && i.time >= t - .1 && e.push(i)
                }), e
            }

            get visibles() {
                let t = [], {clientWidth: e} = this.$player, i = this.getLeft(this.$player);
                return this.filter("emit", a => {
                    let n = a.$ref.offsetTop, o = this.getLeft(a.$ref) - i, s = a.$ref.clientHeight,
                        l = a.$ref.clientWidth, r = o + l, d = r / a.$restTime, p = {};
                    p.top = n, p.left = o, p.height = s, p.width = l, p.right = e - r, p.speed = d, p.distance = r, p.time = a.$restTime, p.mode = a.mode, t.push(p)
                }), t
            }

            get speed() {
                return this.option.synchronousPlayback && this.art.playbackRate ? this.option.speed / Number(this.art.playbackRate) : this.option.speed
            }

            async load(t) {
                let {errorHandle: e} = this.utils, i = [], a = t || this.option.danmuku;
                try {
                    "function" == typeof a ? i = await a() : a instanceof Promise ? i = await a : "string" == typeof a ? i = await (0, o.bilibiliDanmuParseFromUrl)(a) : Array.isArray(a) && (i = a), e(Array.isArray(i), "Danmuku need return an array as result"), void 0 === t && (this.reset(), this.queue = [], this.states = {
                        wait: [],
                        ready: [],
                        emit: [],
                        stop: []
                    }, this.$refs = [], this.$danmuku.innerText = "");
                    for (let t = 0; t < i.length; t++) {
                        let e = i[t];
                        await this.emit(e)
                    }
                    this.art.emit("artplayerPluginDanmuku:loaded", this.queue)
                } catch (t) {
                    throw this.art.emit("artplayerPluginDanmuku:error", t), t
                }
                return this
            }

            async emit(t) {
                let {clamp: e} = this.utils;
                if (this.validator(t, {
                    text: "string",
                    mode: "?number",
                    color: "?string",
                    time: "?number",
                    border: "?boolean",
                    style: "?object"
                }), !t.text.trim() || (t.time ? t.time = e(t.time, 0, 1 / 0) : t.time = this.art.currentTime + .5, void 0 === t.mode && (t.mode = this.option.mode), void 0 === t.style && (t.style = {}), void 0 === t.color && (t.color = this.option.color), ![0, 1, 2].includes(t.mode) || !this.option.filter(t))) return this;
                let i = {...t, $state: "wait", $id: this.index++, $ref: null, $restTime: 0, $lastStartTime: 0};
                return this.setState(i, "wait"), this.queue.push(i), this
            }

            config(t) {
                let {clamp: e} = this.utils, {$controlsCenter: i} = this.art.template;
                return Object.keys(t).some(e => JSON.stringify(this.option[e]) !== JSON.stringify(t[e])) && (this.option = Object.assign({}, r.option, this.option, t), this.validator(this.option, r.scheme), this.option.mode = e(this.option.mode, 0, 2), this.option.speed = e(this.option.speed, 1, 10), this.option.opacity = e(this.option.opacity, 0, 1), this.option.lockTime = e(this.option.lockTime, 1, 60), this.option.maxLength = e(this.option.maxLength, 1, 1e3), this.option.mount = this.option.mount || i, this.option.visible ? this.show() : this.hide(), this.art.emit("artplayerPluginDanmuku:config", this.option)), this
            }

            getLeft(t) {
                let e = t.getBoundingClientRect();
                return this.isRotate ? e.top : e.left
            }

            postMessage(t = {}) {
                return new Promise(e => {
                    t.id = Date.now(), this.worker.postMessage(t), this.worker.onmessage = i => {
                        let {data: a} = i;
                        a.id === t.id && e(a)
                    }
                })
            }

            filter(t, e) {
                let i = this.states[t] || [];
                for (let t = 0; t < i.length; t++) e(i[t]);
                return i
            }

            setState(t, e) {
                this.states[t.$state] = this.states[t.$state].filter(e => e !== t), t.$state = e, t.$ref && (t.$ref.dataset.state = e), this.states[e].push(t)
            }

            makeWait(t) {
                this.setState(t, "wait"), t.$ref && (t.$ref.style.cssText = r.cssText, t.$ref.style.visibility = "hidden", t.$ref.style.marginLeft = "0px", t.$ref.style.transform = "translateX(0px)", t.$ref.style.transition = "transform 0s linear 0s", this.$refs.push(t.$ref), t.$ref = null)
            }

            update() {
                let {setStyles: t} = this.utils;
                return this.timer = window.requestAnimationFrame(async () => {
                    if (this.art.playing && !this.isHide) {
                        this.filter("emit", t => {
                            let e = (Date.now() - t.$lastStartTime) / 1e3;
                            t.$restTime -= e, t.$lastStartTime = Date.now(), t.$restTime <= 0 && this.makeWait(t)
                        });
                        let e = this.readys;
                        for (let i = 0; i < e.length; i++) {
                            let a = e[i];
                            if (await this.option.beforeVisible(a)) {
                                let {clientWidth: e, clientHeight: i} = this.$player;
                                a.$ref = this.$ref, a.$ref.innerText = a.text, this.$danmuku.appendChild(a.$ref), a.$ref.style.opacity = this.option.opacity, a.$ref.style.fontSize = `${this.fontSize}px`, a.$ref.style.color = a.color, a.$ref.style.border = a.border ? `1px solid ${a.color}` : null, a.$ref.style.backgroundColor = a.border ? "rgb(0 0 0 / 50%)" : null, t(a.$ref, a.style), a.$lastStartTime = Date.now(), a.$restTime = this.speed;
                                let n = e + a.$ref.clientWidth, {result: o} = await this.postMessage({
                                    type: "getDanmuTop",
                                    target: {mode: a.mode, height: a.$ref.clientHeight, speed: n / a.$restTime},
                                    visibles: this.visibles,
                                    antiOverlap: this.option.antiOverlap,
                                    clientWidth: e,
                                    clientHeight: i,
                                    marginBottom: this.marginBottom,
                                    marginTop: this.marginTop
                                });
                                if (a.$ref) if (this.isStop || void 0 === o) this.setState(a, "ready"), this.$refs.push(a.$ref), a.$ref = null; else {
                                    switch (this.setState(a, "emit"), a.$ref.style.top = `${o}px`, a.$ref.style.visibility = "visible", a.$ref.dataset.mode = a.mode, a.mode) {
                                        case 0:
                                            a.$ref.style.left = `${e}px`, a.$ref.style.marginLeft = "0px", a.$ref.style.transform = `translateX(${-n}px)`, a.$ref.style.transition = `transform ${a.$restTime}s linear 0s`;
                                            break;
                                        case 1:
                                        case 2:
                                            a.$ref.style.left = "50%", a.$ref.style.marginLeft = `-${a.$ref.clientWidth / 2}px`
                                    }
                                    this.art.emit("artplayerPluginDanmuku:visible", a)
                                }
                            }
                        }
                    }
                    this.isStop || this.update()
                }), this
            }

            resize() {
                let {clientWidth: t} = this.$player;
                this.filter("stop", e => {
                    0 === e.mode && (e.$ref.style.left = `${t}px`)
                }), this.filter("emit", e => {
                    if (e.$lastStartTime = Date.now(), 0 === e.mode) {
                        let i = t + e.$ref.clientWidth;
                        e.$ref.style.left = `${t}px`, e.$ref.style.transform = `translateX(${-i}px)`, e.$ref.style.transition = `transform ${e.$restTime}s linear 0s`
                    }
                })
            }

            continue() {
                let {clientWidth: t} = this.$player;
                return this.filter("stop", e => {
                    if (this.setState(e, "emit"), e.$lastStartTime = Date.now(), 0 === e.mode) {
                        let i = t + e.$ref.clientWidth;
                        e.$ref.style.transform = `translateX(${-i}px)`, e.$ref.style.transition = `transform ${e.$restTime}s linear 0s`
                    }
                }), this
            }

            suspend() {
                let {clientWidth: t} = this.$player;
                return this.filter("emit", e => {
                    if (this.setState(e, "stop"), 0 === e.mode) {
                        let i = t - (this.getLeft(e.$ref) - this.getLeft(this.$player));
                        e.$ref.style.transform = `translateX(${-i}px)`, e.$ref.style.transition = "transform 0s linear 0s"
                    }
                }), this
            }

            stop() {
                return this.isStop = !0, this.suspend(), window.cancelAnimationFrame(this.timer), this.art.emit("artplayerPluginDanmuku:stop"), this
            }

            start() {
                return this.isStop = !1, this.continue(), this.update(), this.art.emit("artplayerPluginDanmuku:start"), this
            }

            reset() {
                return this.queue.forEach(t => this.makeWait(t)), this.art.emit("artplayerPluginDanmuku:reset"), this
            }

            show() {
                return this.isHide = !1, this.$danmuku.style.opacity = 1, this.option.visible = !0, this.art.emit("artplayerPluginDanmuku:show"), this
            }

            hide() {
                return this.isHide = !0, this.$danmuku.style.opacity = 0, this.option.visible = !1, this.art.emit("artplayerPluginDanmuku:hide"), this
            }

            destroy() {
                this.stop(), this.worker.terminate(), this.art.off("video:play", this.start), this.art.off("video:playing", this.start), this.art.off("video:pause", this.stop), this.art.off("video:waiting", this.stop), this.art.off("resize", this.reset), this.art.off("destroy", this.destroy), this.art.emit("artplayerPluginDanmuku:destroy")
            }
        }

        i.default = r
    }, {
        "./bilibili": "f83sx",
        "bundle-text:./worker": "lfIAi",
        "@parcel/transformer-js/src/esmodule-helpers.js": "9pCYc"
    }], f83sx: [function (t, e, i, a) {
        var n = t("@parcel/transformer-js/src/esmodule-helpers.js");

        function o(t) {
            switch (t) {
                case 1:
                case 2:
                case 3:
                default:
                    return 0;
                case 4:
                    return 2;
                case 5:
                    return 1
            }
        }

        function s(t) {
            if ("string" != typeof t) return [];
            let e = new RegExp(/<d (?:.*? )??p="(?<p>.+?)"(?: .*?)?>(?<text>.+?)<\/d>/gs);
            return Array.from(t.matchAll(e)).map(t => {
                let e = t.groups.p.split(",");
                return e.length >= 8 ? {
                    text: t.groups.text.trim().replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&"),
                    time: Number(e[0]),
                    mode: o(Number(e[1])),
                    fontSize: Number(e[2]),
                    color: `#${Number(e[3]).toString(16)}`,
                    timestamp: Number(e[4]),
                    pool: Number(e[5]),
                    userID: e[6],
                    rowID: Number(e[7])
                } : null
            }).filter(Boolean)
        }

        function l({data: t}) {
            let {xml: e, id: i} = t;
            if (!i || !e) return;
            let a = s(e);
            self.postMessage({danmus: a, id: i})
        }

        function r(t) {
            return new Promise(async e => {
                let i = await fetch(t), a = await i.text();
                try {
                    let t = function () {
                        let t = new Blob([` ${o.toString()} ${s.toString()} onmessage = ${l.toString()} `], {type: "application/javascript"});
                        return new Worker(URL.createObjectURL(t))
                    }();
                    t.onmessage = i => {
                        let {danmus: a, id: n} = i.data;
                        n && a && (e(a), t.terminate())
                    }, t.postMessage({xml: a, id: Date.now()})
                } catch (t) {
                    e(s(a))
                }
            })
        }

        n.defineInteropFlag(i), n.export(i, "bilibiliDanmuParseFromUrl", () => r)
    }, {"@parcel/transformer-js/src/esmodule-helpers.js": "9pCYc"}], "9pCYc": [function (t, e, i, a) {
        i.interopDefault = function (t) {
            return t && t.__esModule ? t : {default: t}
        }, i.defineInteropFlag = function (t) {
            Object.defineProperty(t, "__esModule", {value: !0})
        }, i.exportAll = function (t, e) {
            return Object.keys(t).forEach(function (i) {
                "default" === i || "__esModule" === i || Object.prototype.hasOwnProperty.call(e, i) || Object.defineProperty(e, i, {
                    enumerable: !0,
                    get: function () {
                        return t[i]
                    }
                })
            }), e
        }, i.export = function (t, e, i) {
            Object.defineProperty(t, e, {enumerable: !0, get: i})
        }
    }, {}], lfIAi: [function (t, e, i, a) {
        e.exports = '!function(e,t,i,o,n,r,f,d){var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},u="function"==typeof l[o]&&l[o],h=u.i||{},p=u.cache||{},s="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function a(t,i){if(!p[t]){if(!e[t]){if(n[t])return n[t];var r="function"==typeof l[o]&&l[o];if(!i&&r)return r(t,!0);if(u)return u(t,!0);if(s&&"string"==typeof t)return s(t);var f=Error("Cannot find module \'"+t+"\'");throw f.code="MODULE_NOT_FOUND",f}h.resolve=function(i){var o=e[t][1][i];return null!=o?o:i},h.cache={};var d=p[t]=new a.Module(t);e[t][0].call(d.exports,h,d,d.exports,l)}return p[t].exports;function h(e){var t=h.resolve(e);return!1===t?{}:a(t)}}a.isParcelRequire=!0,a.Module=function(e){this.id=e,this.bundle=a,this.require=s,this.exports={}},a.modules=e,a.cache=p,a.parent=u,a.distDir=void 0,a.publicUrl=void 0,a.devServer=void 0,a.i=h,a.register=function(t,i){e[t]=[function(e,t){t.exports=i},{}]},Object.defineProperty(a,"root",{get:function(){return l[o]}}),l[o]=a;for(var c=0;c<t.length;c++)a(t[c]);if(i){var g=a(i);"object"==typeof exports&&"undefined"!=typeof module?module.exports=g:"function"==typeof define&&define.amd&&define(function(){return g})}}({"59OZS":[function(e,t,i,o){function n({target:e,visibles:t,clientWidth:i,clientHeight:o,marginBottom:n,marginTop:r,antiOverlap:f}){let d=o-n,l=t.filter(t=>t.mode===e.mode&&t.top<=d).sort((e,t)=>e.top-t.top);if(0===l.length)if(2===e.mode)return d-e.height;else return r;if(l.unshift({type:"top",top:0,left:0,right:0,height:r,width:i,speed:0,distance:i}),l.push({type:"bottom",top:d,left:0,right:0,height:n,width:i,speed:0,distance:i}),2===e.mode)for(let t=l.length-2;t>=0;t-=1){let i=l[t],o=l[t+1],n=i.top+i.height;if(o.top-n>=e.height)return o.top-e.height}else for(let t=1;t<l.length;t+=1){let i=l[t],o=l[t-1],n=o.top+o.height;if(i.top-n>=e.height)return n}let u=[];for(let e=1;e<l.length-1;e+=1){let t=l[e];if(u.length){let e=u[u.length-1];e[0].top===t.top?e.push(t):u.push([t])}else u.push([t])}if(f)switch(e.mode){case 0:{let t=u.find(t=>t.every(t=>!(i<t.distance)&&(!!(e.speed<t.speed)||!!(t.right/(e.speed-t.speed)>t.time))));return t&&t[0]?t[0].top:void 0}case 1:case 2:return}else{switch(e.mode){case 0:u.sort((e,t)=>{let i=Math.min(...t.map(e=>e.right)),o=Math.min(...e.map(e=>e.right));return i*t.length-o*e.length});break;case 1:case 2:u.sort((e,t)=>{let i=Math.max(...t.map(e=>e.width));return Math.max(...e.map(e=>e.width))*e.length-i*t.length})}return u[0][0].top}}onmessage=e=>{let{data:t}=e;if(!t.id||!t.type)return;let i=(0,({getDanmuTop:n})[t.type])(t);self.postMessage({result:i,id:t.id})}},{}]},["59OZS"],"59OZS","parcelRequire4dc0",{});'
    }, {}], lO8OT: [function (t, e, i, a) {
        var n = t("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(i);
        var o = t("bundle-text:./style.less"), s = n.interopDefault(o), l = t("bundle-text:./img/on.svg"),
            r = n.interopDefault(l), d = t("bundle-text:./img/off.svg"), p = n.interopDefault(d),
            u = t("bundle-text:./img/config.svg"), h = n.interopDefault(u), m = t("bundle-text:./img/style.svg"),
            c = n.interopDefault(m), f = t("bundle-text:./img/mode_0_off.svg"), g = n.interopDefault(f),
            y = t("bundle-text:./img/mode_0_on.svg"), v = n.interopDefault(y),
            x = t("bundle-text:./img/mode_1_off.svg"), k = n.interopDefault(x),
            b = t("bundle-text:./img/mode_1_on.svg"), $ = n.interopDefault(b),
            w = t("bundle-text:./img/mode_2_off.svg"), M = n.interopDefault(w),
            E = t("bundle-text:./img/mode_2_on.svg"), S = n.interopDefault(E), D = t("bundle-text:./img/check_on.svg"),
            A = n.interopDefault(D), F = t("bundle-text:./img/check_off.svg"), z = n.interopDefault(F);
        if (i.default = class {
            constructor(t, e) {
                this.art = t, this.danmuku = e, this.utils = t.constructor.utils;
                let {setStyle: i} = this.utils, {$controlsCenter: a} = t.template;
                i(a, "display", "flex"), this.template = {
                    $controlsCenter: a,
                    $mount: a,
                    $danmuku: null,
                    $toggle: null,
                    $config: null,
                    $configPanel: null,
                    $configModes: null,
                    $style: null,
                    $stylePanel: null,
                    $styleModes: null,
                    $colors: null,
                    $opacitySlider: null,
                    $opacityValue: null,
                    $marginSlider: null,
                    $marginValue: null,
                    $fontSizeSlider: null,
                    $fontSizeValue: null,
                    $speedSlider: null,
                    $speedValue: null,
                    $input: null,
                    $send: null
                }, this.slider = {
                    opacity: null,
                    margin: null,
                    fontSize: null,
                    speed: null
                }, this.emitting = !1, this.isLock = !1, this.timer = null, this.createTemplate(), this.createSliders(), this.createEvents(), this.mount(this.option.mount), t.on("resize", () => this.resize()), t.on("fullscreen", t => this.onFullscreen(t)), t.on("fullscreenWeb", t => this.onFullscreen(t)), t.proxy(this.template.$config, "mouseenter", () => {
                    this.onMouseEnter({$control: this.template.$config, $panel: this.template.$configPanel})
                }), t.proxy(this.template.$style, "mouseenter", () => {
                    this.onMouseEnter({$control: this.template.$style, $panel: this.template.$stylePanel})
                })
            }

            static get icons() {
                return {
                    $on: r.default,
                    $off: p.default,
                    $config: h.default,
                    $style: c.default,
                    $mode_0_off: g.default,
                    $mode_0_on: v.default,
                    $mode_1_off: k.default,
                    $mode_1_on: $.default,
                    $mode_2_off: M.default,
                    $mode_2_on: S.default,
                    $check_on: A.default,
                    $check_off: z.default
                }
            }

            get option() {
                return this.danmuku.option
            }

            get outside() {
                return this.template.$mount !== this.template.$controlsCenter
            }

            get TEMPLATE() {
                let {option: t} = this;
                return `<div class="apd-toggle">${r.default}${p.default}</div><div class="apd-config">${h.default}<div class="apd-config-panel"><div class="apd-config-panel-inner"><div class="apd-config-mode">\u{6309}\u{7C7B}\u{578B}\u{5C4F}\u{853D}<div class="apd-modes"><div data-mode="0" class="apd-mode">${g.default}${v.default}<div>\u{6EDA}\u{52A8}</div></div><div data-mode="1" class="apd-mode">${k.default}${$.default}<div>\u{9876}\u{90E8}</div></div><div data-mode="2" class="apd-mode">${M.default}${S.default}<div>\u{5E95}\u{90E8}</div></div></div></div><div class="apd-config-other"><div class="apd-other apd-anti-overlap">${A.default}${z.default} \u{9632}\u{6B62}\u{5F39}\u{5E55}\u{91CD}\u{53E0}</div><div class="apd-other apd-sync-video">${A.default}${z.default} \u{540C}\u{6B65}\u{89C6}\u{9891}\u{901F}\u{5EA6}</div></div><div class="apd-config-slider apd-config-opacity">\u{4E0D}\u{900F}\u{660E}\u{5EA6}<div class="apd-slider"></div><div class="apd-value">\u{672A}\u{77E5}</div></div><div class="apd-config-slider apd-config-margin">\u{663E}\u{793A}\u{533A}\u{57DF}<div class="apd-slider"></div><div class="apd-value">\u{672A}\u{77E5}</div></div><div class="apd-config-slider apd-config-fontSize">\u{5F39}\u{5E55}\u{5B57}\u{53F7}<div class="apd-slider"></div><div class="apd-value">\u{672A}\u{77E5}</div></div><div class="apd-config-slider apd-config-speed">\u{5F39}\u{5E55}\u{901F}\u{5EA6}<div class="apd-slider"></div><div class="apd-value">\u{672A}\u{77E5}</div></div></div></div></div><div class="apd-emitter"><div class="apd-style">${c.default}<div class="apd-style-panel"><div class="apd-style-panel-inner"><div class="apd-style-mode">\u{6A21}\u{5F0F}<div class="apd-modes"><div data-mode="0" class="apd-mode">${v.default}<div>\u{6EDA}\u{52A8}</div></div><div data-mode="1" class="apd-mode">${$.default}<div>\u{9876}\u{90E8}</div></div><div data-mode="2" class="apd-mode">${S.default}<div>\u{5E95}\u{90E8}</div></div></div></div><div class="apd-style-color">\u{989C}\u{8272}<div class="apd-colors">${this.COLOR.map(t => `<div data-color="${t}" class="apd-color" style="background-color: ${t}"></div>`).join("")}</div></div></div></div></div><input class="apd-input" placeholder="\u{53D1}\u{4E2A}\u{53CB}\u{5584}\u{7684}\u{5F39}\u{5E55}\u{89C1}\u{8BC1}\u{5F53}\u{4E0B}" autocomplete="off" maxLength="${t.maxLength}" /><div class="apd-send">\u{53D1}\u{9001}</div></div>`
            }

            get OPACITY() {
                return {min: 0, max: 100, steps: [], ...this.option.OPACITY}
            }

            get FONT_SIZE() {
                return {min: 12, max: 120, steps: [], ...this.option.FONT_SIZE}
            }

            get MARGIN() {
                return {
                    min: 0,
                    max: 3,
                    steps: [{name: "1/4", value: [10, "75%"]}, {name: "半屏", value: [10, "50%"]}, {
                        name: "3/4",
                        value: [10, "25%"]
                    }, {name: "满屏", value: [10, 10]}], ...this.option.MARGIN
                }
            }

            get SPEED() {
                return {
                    min: 0,
                    max: 4,
                    steps: [{name: "极慢", value: 10}, {name: "较慢", value: 7.5, hide: !0}, {
                        name: "适中",
                        value: 5
                    }, {name: "较快", value: 2.5, hide: !0}, {name: "极快", value: 1}], ...this.option.SPEED
                }
            }

            get COLOR() {
                return this.option.COLOR.length ? this.option.COLOR : ["#FE0302", "#FF7204", "#FFAA02", "#FFD302", "#FFFF00", "#A0EE00", "#00CD00", "#019899", "#4266BE", "#89D5FF", "#CC0273", "#222222", "#9B9B9B", "#FFFFFF"]
            }

            query(t) {
                let {query: e} = this.utils, {$danmuku: i} = this.template;
                return e(t, i)
            }

            append(t, e) {
                let {append: i} = this.utils;
                [...t.children].some(t => t === e) || i(t, e)
            }

            setData(t, e) {
                let {$player: i} = this.art.template, {$mount: a} = this.template;
                i.dataset[t] = e, this.outside && (a.dataset[t] = e)
            }

            createTemplate() {
                let {createElement: t, tooltip: e} = this.utils, i = t("div");
                i.className = "artplayer-plugin-danmuku", i.innerHTML = this.TEMPLATE, this.template.$danmuku = i, this.template.$toggle = this.query(".apd-toggle"), this.template.$config = this.query(".apd-config"), this.template.$configPanel = this.query(".apd-config-panel"), this.template.$configModes = this.query(".apd-config-mode .apd-modes"), this.template.$style = this.query(".apd-style"), this.template.$stylePanel = this.query(".apd-style-panel"), this.template.$styleModes = this.query(".apd-style-mode .apd-modes"), this.template.$colors = this.query(".apd-colors"), this.template.$antiOverlap = this.query(".apd-anti-overlap"), this.template.$syncVideo = this.query(".apd-sync-video"), this.template.$opacitySlider = this.query(".apd-config-opacity .apd-slider"), this.template.$opacityValue = this.query(".apd-config-opacity .apd-value"), this.template.$marginSlider = this.query(".apd-config-margin .apd-slider"), this.template.$marginValue = this.query(".apd-config-margin .apd-value"), this.template.$fontSizeSlider = this.query(".apd-config-fontSize .apd-slider"), this.template.$fontSizeValue = this.query(".apd-config-fontSize .apd-value"), this.template.$speedSlider = this.query(".apd-config-speed .apd-slider"), this.template.$speedValue = this.query(".apd-config-speed .apd-value"), this.template.$input = this.query(".apd-input"), this.template.$send = this.query(".apd-send");
                let {$toggle: a} = this.template;
                this.art.on("artplayerPluginDanmuku:show", () => {
                    e(a, "关闭弹幕")
                }), this.art.on("artplayerPluginDanmuku:hide", () => {
                    e(a, "打开弹幕")
                })
            }

            createEvents() {
                let {
                    $toggle: t,
                    $configModes: e,
                    $styleModes: i,
                    $colors: a,
                    $antiOverlap: n,
                    $syncVideo: o,
                    $send: s,
                    $input: l
                } = this.template;
                this.art.proxy(t, "click", () => {
                    this.danmuku.config({visible: !this.option.visible}), this.reset()
                }), this.art.proxy(e, "click", t => {
                    let e = t.target.closest(".apd-mode");
                    if (!e) return;
                    let i = Number(e.dataset.mode);
                    this.option.modes.includes(i) ? this.danmuku.config({modes: this.option.modes.filter(t => t !== i)}) : this.danmuku.config({modes: [...this.option.modes, i]}), this.reset()
                }), this.art.proxy(n, "click", () => {
                    this.danmuku.config({antiOverlap: !this.option.antiOverlap}), this.reset()
                }), this.art.proxy(o, "click", () => {
                    this.danmuku.config({synchronousPlayback: !this.option.synchronousPlayback}), this.reset()
                }), this.art.proxy(i, "click", t => {
                    let e = t.target.closest(".apd-mode");
                    if (!e) return;
                    let i = Number(e.dataset.mode);
                    this.danmuku.config({mode: i}), this.reset()
                }), this.art.proxy(a, "click", t => {
                    let e = t.target.closest(".apd-color");
                    e && (this.danmuku.config({color: e.dataset.color}), this.reset())
                }), this.art.proxy(s, "click", () => this.emit()), this.art.proxy(l, "keypress", t => {
                    "Enter" === t.key && (t.preventDefault(), this.emit())
                })
            }

            createSliders() {
                this.slider.opacity = this.createSlider({
                    ...this.OPACITY,
                    container: this.template.$opacitySlider,
                    findIndex: () => Math.round(100 * this.option.opacity),
                    onChange: t => {
                        let {$opacityValue: e} = this.template;
                        e.textContent = `${t}%`, this.danmuku.config({opacity: t / 100})
                    }
                }), this.slider.margin = this.createSlider({
                    ...this.MARGIN,
                    container: this.template.$marginSlider,
                    findIndex: () => this.MARGIN.steps.findIndex(t => t.value[0] === this.option.margin[0] && t.value[1] === this.option.margin[1]),
                    onChange: t => {
                        let e = this.MARGIN.steps[t];
                        if (!e) return;
                        let {$marginValue: i} = this.template;
                        i.textContent = e.name, this.danmuku.config({margin: e.value})
                    }
                }), this.slider.fontSize = this.createSlider({
                    ...this.FONT_SIZE,
                    container: this.template.$fontSizeSlider,
                    findIndex: () => this.danmuku.fontSize,
                    onChange: t => {
                        let {$fontSizeValue: e} = this.template;
                        e.textContent = `${t}px`, t !== this.danmuku.fontSize && this.danmuku.config({fontSize: t})
                    }
                }), this.slider.speed = this.createSlider({
                    ...this.SPEED,
                    container: this.template.$speedSlider,
                    findIndex: () => this.SPEED.steps.findIndex(t => t.value === this.option.speed),
                    onChange: t => {
                        let e = this.SPEED.steps[t];
                        if (!e) return;
                        let {$speedValue: i} = this.template;
                        i.textContent = e.name, this.danmuku.config({speed: e.value})
                    }
                })
            }

            createSlider({min: t, max: e, container: i, findIndex: a, onChange: n, steps: o = []}) {
                let {query: s, clamp: l, setStyle: r} = this.utils;
                r(i, "touch-action", "none"), i.innerHTML = `<div class="apd-slider-line"><div class="apd-slider-points">${o.map(() => '<div class="apd-slider-point"></div>').join("")}</div><div class="apd-slider-progress"></div></div><div class="apd-slider-dot"></div><div class="apd-slider-steps">${o.map(t => t.hide ? "" : `<div class="apd-slider-step">${t.name}</div>`).join("")}</div>`;
                let d = s(".apd-slider-dot", i), p = s(".apd-slider-progress", i), u = !1;

                function h(i = a()) {
                    if (i < t || i > e) return;
                    let s = (i - t) / (e - t);
                    d.style.left = `${100 * s}%`, 0 === o.length && (p.style.width = d.style.left), n(i)
                }

                function m(a) {
                    let {top: n, height: o, left: s, width: r} = i.getBoundingClientRect();
                    this.art.isRotate ? h(Math.round(l(a.clientY - n, 0, o) / o * (e - t) + t)) : h(Math.round(l(a.clientX - s, 0, r) / r * (e - t) + t))
                }

                return this.art.proxy(i, "click", t => {
                    m.call(this, t)
                }), this.art.proxy(i, "pointerdown", t => {
                    u = 0 === t.button
                }), this.art.proxy(document, "pointermove", t => {
                    u && m.call(this, t)
                }), this.art.proxy(document, "pointerup", t => {
                    u && (u = !1, m.call(this, t))
                }), {reset: h}
            }

            onFullscreen(t) {
                let {$danmuku: e, $controlsCenter: i, $mount: a} = this.template;
                this.outside ? t ? this.append(i, e) : this.append(a, e) : this.append(i, e)
            }

            onMouseEnter({$control: t, $panel: e}) {
                let {$player: i} = this.art.template, a = t.getBoundingClientRect(), n = e.getBoundingClientRect(),
                    o = i.getBoundingClientRect(), s = n.width / 2 - a.width / 2, l = o.left - (a.left - s),
                    r = a.right + s - o.right;
                l > 0 ? e.style.left = `${-s + l}px` : r > 0 ? e.style.left = `${-s - r}px` : e.style.left = `${-s}px`
            }

            async emit() {
                let {$input: t} = this.template, e = t.value.trim();
                if (!e.length || this.isLock || this.emitting) return;
                let i = {text: e, mode: this.option.mode, color: this.option.color, time: this.art.currentTime};
                try {
                    this.emitting = !0;
                    let e = await this.option.beforeEmit(i);
                    if (this.emitting = !1, !0 !== e) return;
                    i.border = !0, delete i.time, this.danmuku.emit(i), t.value = "", this.lock()
                } catch (t) {
                    this.emitting = !1
                }
            }

            lock() {
                let {addClass: t} = this.utils, {$send: e} = this.template;
                this.isLock = !0;
                let i = this.option.lockTime;
                e.innerText = i, t(e, "apd-lock");
                let a = () => {
                    this.timer = setTimeout(() => {
                        0 === i ? this.unlock() : (e.innerText = i -= 1, a())
                    }, 1e3)
                };
                a()
            }

            unlock() {
                let {removeClass: t} = this.utils, {$send: e} = this.template;
                clearTimeout(this.timer), this.isLock = !1, e.innerText = "发送", t(e, "apd-lock")
            }

            resize() {
                if (this.outside || this.art.fullscreen || this.art.fullscreenWeb) return;
                let {$player: t, $controlsCenter: e} = this.art.template, {$danmuku: i} = this.template;
                this.art.width < this.option.width ? this.append(t, i) : this.append(e, i)
            }

            reset() {
                let {inverseClass: t, tooltip: e} = this.utils, {$toggle: i, $colors: a} = this.template;
                this.slider.opacity.reset(), this.slider.margin.reset(), this.slider.fontSize.reset(), this.slider.speed.reset(), this.setData("danmukuVisible", this.option.visible), this.setData("danmukuMode", this.option.mode), this.setData("danmukuColor", this.option.color), this.setData("danmukuMode0", this.option.modes.includes(0)), this.setData("danmukuMode1", this.option.modes.includes(1)), this.setData("danmukuMode2", this.option.modes.includes(2)), this.setData("danmukuAntiOverlap", this.option.antiOverlap), this.setData("danmukuSyncVideo", this.option.synchronousPlayback), this.setData("danmukuTheme", this.option.theme), this.setData("danmukuEmitter", this.option.emitter);
                let n = Array.from(a.children).find(t => t.dataset.color === this.option.color.toUpperCase());
                n && t(n, "apd-active"), e(i, this.option.visible ? "关闭弹幕" : "打开弹幕"), this.resize()
            }

            mount(t) {
                let {errorHandle: e} = this.utils, i = "string" == typeof t ? document.querySelector(t) : t;
                e(i, `Can not find the mount point: ${t}`), this.append(i, this.template.$danmuku), this.template.$mount = i, this.reset()
            }
        }, "undefined" != typeof document) {
            let t = "artplayer-plugin-danmuku", e = document.getElementById(t);
            e || ((e = document.createElement("style")).id = t, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
                document.head.appendChild(e)
            }) : (document.head || document.documentElement).appendChild(e)), e.textContent = s.default
        }
    }, {
        "bundle-text:./style.less": "hViDo",
        "bundle-text:./img/on.svg": "9pjcf",
        "bundle-text:./img/off.svg": "b2dkP",
        "bundle-text:./img/config.svg": "l8tyy",
        "bundle-text:./img/style.svg": "5iZC3",
        "bundle-text:./img/mode_0_off.svg": "i0Vut",
        "bundle-text:./img/mode_0_on.svg": "hOSvZ",
        "bundle-text:./img/mode_1_off.svg": "bOXC3",
        "bundle-text:./img/mode_1_on.svg": "lKuh0",
        "bundle-text:./img/mode_2_off.svg": "eB8W6",
        "bundle-text:./img/mode_2_on.svg": "bpe2E",
        "bundle-text:./img/check_on.svg": "kL9zy",
        "bundle-text:./img/check_off.svg": "22xpM",
        "@parcel/transformer-js/src/esmodule-helpers.js": "9pCYc"
    }], hViDo: [function (t, e, i, a) {
        e.exports = '.artplayer-plugin-danmuku{z-index:99;color:#fff;flex-shrink:0;justify-content:center;align-items:center;gap:10px;width:100%;height:32px;font-size:12px;font-weight:300;display:flex;position:relative}.artplayer-plugin-danmuku .apd-icon{cursor:pointer;opacity:.75;fill:#fff;transition:all .2s}.artplayer-plugin-danmuku .apd-icon:hover{opacity:1}.artplayer-plugin-danmuku .apd-config{display:flex;position:relative}.artplayer-plugin-danmuku .apd-config .apd-config-panel{opacity:0;pointer-events:none;width:320px;padding:10px;position:absolute;bottom:24px;left:0}.artplayer-plugin-danmuku .apd-config .apd-config-panel .apd-config-panel-inner{background-color:#000000d9;border-radius:3px;width:100%;padding:10px}.artplayer-plugin-danmuku .apd-config:hover .apd-config-panel{opacity:100;pointer-events:all}.artplayer-plugin-danmuku .apd-config-mode,.artplayer-plugin-danmuku .apd-config-slider,.artplayer-plugin-danmuku .apd-config-other,.artplayer-plugin-danmuku .apd-style-mode{margin-bottom:15px}.artplayer-plugin-danmuku .apd-modes{align-items:center;gap:20px;margin-top:5px;display:flex}.artplayer-plugin-danmuku .apd-modes .apd-mode{cursor:pointer;text-align:center}.artplayer-plugin-danmuku .apd-modes .apd-mode:hover{color:#00a1d6}.artplayer-plugin-danmuku .apd-config-slider{align-items:center;gap:12px;display:flex}.artplayer-plugin-danmuku .apd-config-slider .apd-value{text-align:right;width:32px}.artplayer-plugin-danmuku .apd-slider{cursor:pointer;flex:1;justify-content:center;align-items:center;height:20px;display:flex;position:relative}.artplayer-plugin-danmuku .apd-slider .apd-slider-line{background-color:#ffffff40;border-radius:3px;width:100%;height:2px;position:relative;overflow:hidden}.artplayer-plugin-danmuku .apd-slider .apd-slider-points{justify-content:space-between;align-items:center;display:flex;position:absolute;inset:0}.artplayer-plugin-danmuku .apd-slider .apd-slider-points .apd-slider-point{background-color:#ffffff80;border-radius:50%;width:2px;height:2px}.artplayer-plugin-danmuku .apd-slider .apd-slider-progress{background-color:#00a1d6;width:0%;height:100%}.artplayer-plugin-danmuku .apd-slider .apd-slider-dot{background-color:#00a1d6;border-radius:50%;width:12px;height:12px;position:absolute;left:0%;transform:translate(-6px)}.artplayer-plugin-danmuku .apd-slider .apd-slider-steps{color:#777;justify-content:space-between;align-items:center;width:calc(100% + 32px);display:flex;position:absolute;bottom:-12px}.artplayer-plugin-danmuku .apd-slider .apd-slider-steps .apd-slider-step{text-align:center;flex-shrink:0;width:36px;scale:.95}.artplayer-plugin-danmuku .apd-config-other{align-items:center;gap:20px;display:flex}.artplayer-plugin-danmuku .apd-config-other .apd-check-off,.artplayer-plugin-danmuku .apd-config-other .apd-check-on{width:16px;height:16px}.artplayer-plugin-danmuku .apd-config-other .apd-other{cursor:pointer;align-items:center;gap:2px;display:flex}.artplayer-plugin-danmuku .apd-config-other .apd-other:hover{color:#00a1d6}.artplayer-plugin-danmuku .apd-emitter{background-color:#ffffff40;border-radius:5px;flex:1;align-items:center;height:100%;display:flex}.artplayer-plugin-danmuku .apd-style{justify-content:center;align-items:center;display:flex;position:relative}.artplayer-plugin-danmuku .apd-style .apd-style-panel{opacity:0;pointer-events:none;width:200px;padding:10px;position:absolute;bottom:24px;left:0}.artplayer-plugin-danmuku .apd-style .apd-style-panel .apd-style-panel-inner{background-color:#000000d9;border-radius:3px;width:100%;padding:10px}.artplayer-plugin-danmuku .apd-style:hover .apd-style-panel{opacity:100;pointer-events:all}.artplayer-plugin-danmuku .apd-colors{flex-wrap:wrap;gap:8px;margin-top:5px;display:flex}.artplayer-plugin-danmuku .apd-colors .apd-color{cursor:pointer;border-radius:2px;width:16px;height:16px}.artplayer-plugin-danmuku .apd-colors .apd-color.apd-active{border:1px solid #000;box-shadow:0 0 0 1px #fff}.artplayer-plugin-danmuku .apd-input{color:#fff;background-color:#0000;border:none;outline:none;flex:1;width:auto;min-width:0;height:100%;line-height:1}.artplayer-plugin-danmuku .apd-input::placeholder{color:#ffffff80}.artplayer-plugin-danmuku .apd-send{cursor:pointer;width:60px;height:100%;text-shadow:none;background-color:#00a1d6;border-top-right-radius:5px;border-bottom-right-radius:5px;flex-shrink:0;justify-content:center;align-items:center;display:flex}.artplayer-plugin-danmuku .apd-send.apd-lock{cursor:not-allowed;color:#666;background-color:#e7e7e7}.art-controls-center .apd-emitter{flex:none;width:260px}.art-fullscreen .artplayer-plugin-danmuku,.art-fullscreen-web .artplayer-plugin-danmuku{gap:16px;height:38px}.art-fullscreen .artplayer-plugin-danmuku .apd-config-icon,.art-fullscreen-web .artplayer-plugin-danmuku .apd-config-icon,.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-off,.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-off,.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-on,.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-on{width:28px;height:28px}.art-fullscreen .artplayer-plugin-danmuku .apd-emitter,.art-fullscreen-web .artplayer-plugin-danmuku .apd-emitter{flex:none;width:400px}.art-video-player>.artplayer-plugin-danmuku{padding:0 10px;position:absolute;bottom:-40px;left:0;right:0}.art-video-player:has(>.artplayer-plugin-danmuku){margin-bottom:40px}[data-danmuku-emitter=false] .apd-emitter{display:none!important}[data-danmuku-emitter=false] .art-controls-center .artplayer-plugin-danmuku{justify-content:flex-end;gap:18px}[data-danmuku-emitter=false].art-fullscreen .art-controls-center .artplayer-plugin-danmuku,[data-danmuku-emitter=false].art-fullscreen-web .art-controls-center .artplayer-plugin-danmuku{gap:24px}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-icon{fill:#333}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-emitter{background-color:#f1f2f3}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-input{color:#000}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-input::placeholder{color:#0000004d}[data-danmuku-visible=false] .apd-toggle-off{display:block}[data-danmuku-visible=false] .apd-toggle-on,[data-danmuku-visible=true] .apd-toggle-off{display:none}[data-danmuku-visible=true] .apd-toggle-on{display:block}[data-danmuku-anti-overlap=false] .apd-anti-overlap .apd-check-on{display:none}[data-danmuku-anti-overlap=false] .apd-anti-overlap .apd-check-off,[data-danmuku-anti-overlap=true] .apd-anti-overlap .apd-check-on{display:block}[data-danmuku-anti-overlap=true] .apd-anti-overlap .apd-check-off,[data-danmuku-sync-video=false] .apd-sync-video .apd-check-on{display:none}[data-danmuku-sync-video=false] .apd-sync-video .apd-check-off,[data-danmuku-sync-video=true] .apd-sync-video .apd-check-on{display:block}[data-danmuku-sync-video=true] .apd-sync-video .apd-check-off{display:none}[data-danmuku-mode0=false] .apd-config-mode .apd-mode-0-off{display:block}[data-danmuku-mode0=false] .apd-config-mode .apd-mode-0-on{display:none}[data-danmuku-mode0=false] .art-danmuku [data-mode="0"]{opacity:0!important}[data-danmuku-mode0=true] .apd-config-mode .apd-mode-0-off{display:none}[data-danmuku-mode0=true] .apd-config-mode .apd-mode-0-on{display:block}[data-danmuku-mode="0"] .apd-style-mode [data-mode="0"]{color:#00a1d6}[data-danmuku-mode="0"] .apd-style-mode [data-mode="0"] path{fill:#00a1d6}[data-danmuku-mode1=false] .apd-config-mode .apd-mode-1-off{display:block}[data-danmuku-mode1=false] .apd-config-mode .apd-mode-1-on{display:none}[data-danmuku-mode1=false] .art-danmuku [data-mode="1"]{opacity:0!important}[data-danmuku-mode1=true] .apd-config-mode .apd-mode-1-off{display:none}[data-danmuku-mode1=true] .apd-config-mode .apd-mode-1-on{display:block}[data-danmuku-mode="1"] .apd-style-mode [data-mode="1"]{color:#00a1d6}[data-danmuku-mode="1"] .apd-style-mode [data-mode="1"] path{fill:#00a1d6}[data-danmuku-mode2=false] .apd-config-mode .apd-mode-2-off{display:block}[data-danmuku-mode2=false] .apd-config-mode .apd-mode-2-on{display:none}[data-danmuku-mode2=false] .art-danmuku [data-mode="2"]{opacity:0!important}[data-danmuku-mode2=true] .apd-config-mode .apd-mode-2-off{display:none}[data-danmuku-mode2=true] .apd-config-mode .apd-mode-2-on{display:block}[data-danmuku-mode="2"] .apd-style-mode [data-mode="2"]{color:#00a1d6}[data-danmuku-mode="2"] .apd-style-mode [data-mode="2"] path{fill:#00a1d6}'
    }, {}], "9pjcf": [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="apd-icon apd-toggle-on" data-pointer="none" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.989 4.828q-.705 0-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5q-1.022.027-2.164.068a4.01 4.01 0 0 0-3.83 3.44q-.246 1.725-.245 4.185-.001 2.947.35 5.116a4.01 4.01 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.04 2.04 0 0 1-1.91-1.708q-.325-1.987-.325-4.798 0-2.344.225-3.904c.14-.977.96-1.713 1.945-1.747q3.666-.13 6.063-.131 2.398 0 6.064.13c.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507q-1.35-.048-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59q-.571-.006-1.088-.007zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.6 8.6 0 0 0 .748-1.42L15.183 7.8a14 14 0 0 1-.814 1.804h-1.518l.693-.308a9 9 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795zm7.458.11v-.858h-1.254v.858zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2zm2.321 0v-.902h1.254v.902z" clip-rule="evenodd"/><path fill="#00AEEC" fill-rule="evenodd" d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005a1 1 0 0 0 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295" clip-rule="evenodd"/></svg>'
    }, {}], b2dkP: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="apd-icon apd-toggle-off" data-pointer="none" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566q.81-.012 1.515-.012h.13q.517 0 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46q1.182.03 2.53.078c1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813a179 179 0 0 0-6.064-.131q-2.397 0-6.063.13a2.04 2.04 0 0 0-1.945 1.748q-.225 1.56-.225 3.904.001 2.811.325 4.798c.154.949.95 1.66 1.91 1.708a98 98 0 0 0 5.416.139.988.988 0 0 1 0 1.975 100 100 0 0 1-5.513-.141A4.01 4.01 0 0 1 2.197 17.7q-.353-2.169-.351-5.116-.001-2.46.245-4.184A4.01 4.01 0 0 1 5.92 4.96q1.142-.04 2.164-.069Zm4.436 4.707h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.6 8.6 0 0 0 .748-1.42l-1.089-.384a14 14 0 0 1-.814 1.804h-1.518l.693-.308a9 9 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364m-4.18 3.564.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795zm7.458.11v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2zm2.321 0v-.902H15.8v.902h-1.254Zm3.517 10.594a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.5 2.5 0 0 1-1.109.259m2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239" clip-rule="evenodd"/></svg>'
    }, {}], l8tyy: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="apd-icon apd-config-icon" data-pointer="none" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m15.645 4.881 1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a111 111 0 0 0-1.1-.007h-.131q-.705 0-1.515.012L8.783 2.3A.998.998 0 0 0 7.12 3.408l.988 1.484q-1.033.028-2.188.069a4.01 4.01 0 0 0-3.83 3.44q-.246 1.725-.245 4.185-.001 2.947.35 5.116a4.01 4.01 0 0 0 3.763 3.363 100 100 0 0 0 5.513.141.988.988 0 0 0 0-1.975 98 98 0 0 1-5.416-.139 2.04 2.04 0 0 1-1.91-1.708q-.325-1.986-.325-4.798 0-2.344.225-3.904c.14-.977.96-1.713 1.945-1.747q3.666-.13 6.063-.131 2.398 0 6.064.13c.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09a2 2 0 0 1-.007.135l-.002.01a1 1 0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507q-1.357-.048-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235q.207-.074.433-.074h1.553V9.584h-1.264a8.5 8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305a8.6 8.6 0 0 0-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 5.502h2.16l-.564 1.068h-1.595zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187zm2.322.007v-.893h1.241v.893zm.528 2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0" clip-rule="evenodd"/></svg>'
    }, {}], "5iZC3": [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="36" height="24" class="apd-icon apd-style-icon" data-pointer="none" viewBox="0 0 22 22"><path d="M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1M6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34M11 5.98 12.87 11H9.13z"/></svg>'
    }, {}], i0Vut: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-0-off" data-pointer="none" viewBox="0 0 28 28"><path fill="#00AEEC" d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15M11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-3 2H6V9h2zm4 4h-2v-2h2zm2-1a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1"/><path fill="#00AEEC" d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071m-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586m4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001"/></svg>'
    }, {}], hOSvZ: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-0-on" data-pointer="none" viewBox="0 0 28 28"><path fill="#FFF" d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4M11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-3 2H6V9h2zm4 4h-2v-2h2zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2"/></svg>'
    }, {}], bOXC3: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-1-off" data-pointer="none" viewBox="0 0 28 28"><path fill="#00AEEC" d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15m-4-8h2v2h-2zM9 9H7V7h2zm4 0h-2V7h2zm2-2h2v2h-2z"/><path fill="#00AEEC" d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071m-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586m4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001"/></svg>'
    }, {}], lKuh0: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-1-on" data-pointer="none" viewBox="0 0 28 28"><path fill="#FFF" d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4M9 9H7V7h2zm4 0h-2V7h2zm4 0h-2V7h2zm4 0h-2V7h2z"/></svg>'
    }, {}], eB8W6: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-2-off" data-pointer="none" viewBox="0 0 28 28"><path fill="#00AEEC" d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15M9 21H7v-2h2zm4 0h-2v-2h2z"/><path fill="#00AEEC" d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071m-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586m4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001"/></svg>'
    }, {}], bpe2E: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="28" height="28" class="apd-icon apd-mode-2-on" data-pointer="none" viewBox="0 0 28 28"><path fill="#FFF" d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4M9 21H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"/></svg>'
    }, {}], kL9zy: [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="apd-icon apd-check-on" data-pointer="none" viewBox="0 0 32 32"><path fill="#00AEEC" d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4"/></svg>'
    }, {}], "22xpM": [function (t, e, i, a) {
        e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="apd-icon apd-check-off" data-pointer="none" viewBox="0 0 32 32"><path fill="#FFF" d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4"/></svg>'
    }, {}], "8AxLD": [function (t, e, i, a) {
        var n = t("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(i), n.export(i, "default", () => l);
        let o = {
            map: (t, e, i, a, n) => (t - e) * (n - a) / (i - e) + a, range(t, e, i) {
                let a = Math.round(t / i) * i;
                return Array.from({length: Math.floor((e - t) / i)}, (t, e) => e * i + a)
            }
        }, s = (t, e) => {
            let i = e[0] - t[0], a = e[1] - t[1];
            return {length: Math.sqrt(Math.pow(i, 2) + Math.pow(a, 2)), angle: Math.atan2(a, i)}
        };

        function l(t, e, i) {
            let {query: a} = t.constructor.utils;
            t.controls.add({
                name: "heatmap",
                position: "top",
                html: "",
                style: {
                    position: "absolute",
                    top: "-100px",
                    left: "0px",
                    right: "0px",
                    height: "100px",
                    width: "100%",
                    pointerEvents: "none"
                },
                mounted(n) {
                    let l = null, r = null;

                    function d(p = []) {
                        if (l = null, r = null, n.innerHTML = "", !t.duration || t.option.isLive) return;
                        let u = {w: n.offsetWidth, h: n.offsetHeight}, h = {
                            xMin: 0,
                            xMax: u.w,
                            yMin: 0,
                            yMax: 128,
                            scale: .25,
                            opacity: .2,
                            minHeight: Math.floor(.05 * u.h),
                            sampling: Math.floor(u.w / 100),
                            smoothing: .2,
                            flattening: .2
                        };
                        "object" == typeof i && Object.assign(h, i);
                        let m = [];
                        if (Array.isArray(p) && p.length) m = [...p]; else {
                            let i = t.duration / u.w;
                            for (let t = 0; t <= u.w; t += h.sampling) {
                                let a = e.queue.filter(({time: e}) => e > t * i && e <= (t + h.sampling) * i).length;
                                m.push([t, a])
                            }
                        }
                        if (0 === m.length) return;
                        let c = m[m.length - 1], f = c[0], g = c[1];
                        f !== u.w && m.push([u.w, g]);
                        let y = m.map(t => t[1]), v = (Math.min(...y) + Math.max(...y)) / 2;
                        for (let t = 0; t < m.length; t++) {
                            let e = m[t], i = e[1];
                            e[1] = i * (i > v ? 1 + h.scale : 1 - h.scale) + h.minHeight
                        }
                        let x = (t, e, i, a) => {
                                let n = s(e || t, i || t), l = o.map(Math.cos(n.angle) * h.flattening, 0, 1, 1, 0),
                                    r = n.angle * l + (a ? Math.PI : 0), d = n.length * h.smoothing;
                                return [t[0] + Math.cos(r) * d, t[1] + Math.sin(r) * d]
                            }, k = (t, e, i) => {
                                let a = x(i[e - 1], i[e - 2], t), n = x(t, i[e - 1], i[e + 1], !0),
                                    o = e === i.length - 1 ? " z" : "";
                                return `C ${a[0]},${a[1]} ${n[0]},${n[1]} ${t[0]},${t[1]}${o}`
                            },
                            b = m.map(t => [o.map(t[0], h.xMin, h.xMax, 0, u.w), o.map(t[1], h.yMin, h.yMax, u.h, 0)]).reduce((t, e, i, a) => 0 === i ? `M ${a[a.length - 1][0]},${u.h} L ${e[0]},${u.h} L ${e[0]},${e[1]}` : `${t} ${k(e, i, a)}`, "");
                        n.innerHTML = `<svg viewBox="0 0 ${u.w} ${u.h}"><defs><linearGradient id="heatmap-solids" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${h.opacity}" /><stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${h.opacity}" id="heatmap-start" /><stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" /><stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" /></linearGradient></defs><path fill="url(#heatmap-solids)" d="${b}"></path></svg>`, l = a("#heatmap-start", n), r = a("#heatmap-stop", n), l.setAttribute("offset", `${100 * t.played}%`), r.setAttribute("offset", `${100 * t.played}%`)
                    }

                    t.on("video:timeupdate", () => {
                        l && r && (l.setAttribute("offset", `${100 * t.played}%`), r.setAttribute("offset", `${100 * t.played}%`))
                    }), t.on("setBar", (t, e) => {
                        l && r && "played" === t && (l.setAttribute("offset", `${100 * e}%`), r.setAttribute("offset", `${100 * e}%`))
                    }), t.on("ready", () => d()), t.on("resize", () => d()), t.on("artplayerPluginDanmuku:loaded", () => d()), t.on("artplayerPluginDanmuku:points", t => d(t))
                }
            })
        }
    }, {"@parcel/transformer-js/src/esmodule-helpers.js": "9pCYc"}]
}, ["bgm6t"], "bgm6t", "parcelRequire4dc0", {});