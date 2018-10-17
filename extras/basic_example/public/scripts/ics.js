/*
 * Intel WebRTC SDK version 4.1.0
 * Copyright (c) 2018 Intel <http://webrtc.intel.com>
 * Homepage: http://webrtc.intel.com
 */


!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Ics = e()
    }
}(function () {
    return function () {
        return function e(t, n, i) {
            function r(a, s) {
                if (!n[a]) {
                    if (!t[a]) {
                        var c = "function" == typeof require && require;
                        if (!s && c) return c(a, !0);
                        if (o) return o(a, !0);
                        var u = new Error("Cannot find module '" + a + "'");
                        throw u.code = "MODULE_NOT_FOUND", u
                    }
                    var d = n[a] = {exports: {}};
                    t[a][0].call(d.exports, function (e) {
                        return r(t[a][1][e] || e)
                    }, d, d.exports, e, t, n, i)
                }
                return n[a].exports
            }

            for (var o = "function" == typeof require && require, a = 0; a < i.length; a++) r(i[a]);
            return r
        }
    }()({
        1: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            n.Base64 = function () {
                var e, t, n, i, r, o, a, s, c;
                for (-1, e = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"], t = [], r = 0; r < e.length; r += 1) t[e[r]] = r;
                return o = function (e) {
                    n = e, i = 0
                }, a = function () {
                    var e;
                    return n ? i >= n.length ? -1 : (e = 255 & n.charCodeAt(i), i += 1, e) : -1
                }, s = function () {
                    if (!n) return -1;
                    for (; ;) {
                        if (i >= n.length) return -1;
                        var e = n.charAt(i);
                        if (i += 1, t[e]) return t[e];
                        if ("A" === e) return 0
                    }
                }, c = function (e) {
                    return 1 === (e = e.toString(16)).length && (e = "0" + e), e = "%" + e, unescape(e)
                }, {
                    encodeBase64: function (t) {
                        var n, i, r;
                        for (o(t), n = "", i = new Array(3), r = !1; !r && -1 !== (i[0] = a());) i[1] = a(), i[2] = a(), n += e[i[0] >> 2], -1 !== i[1] ? (n += e[i[0] << 4 & 48 | i[1] >> 4], -1 !== i[2] ? (n += e[i[1] << 2 & 60 | i[2] >> 6], n += e[63 & i[2]]) : (n += e[i[1] << 2 & 60], n += "=", r = !0)) : (n += e[i[0] << 4 & 48], n += "=", n += "=", r = !0);
                        return n
                    }, decodeBase64: function (e) {
                        var t, n, i;
                        for (o(e), t = "", n = new Array(4), i = !1; !i && -1 !== (n[0] = s()) && -1 !== (n[1] = s());) n[2] = s(), n[3] = s(), t += c(n[0] << 2 & 255 | n[1] >> 4), -1 !== n[2] ? (t += c(n[1] << 4 & 255 | n[2] >> 2), -1 !== n[3] ? t += c(n[2] << 6 & 255 | n[3]) : i = !0) : i = !0;
                        return t
                    }
                }
            }()
        }, {}],
        2: [function (e, t, n) {
            "use strict";

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            Object.defineProperty(n, "__esModule", {value: !0});
            n.AudioCodec = {
                PCMU: "pcmu",
                PCMA: "pcma",
                OPUS: "opus",
                G722: "g722",
                ISAC: "iSAC",
                ILBC: "iLBC",
                AAC: "aac",
                AC3: "ac3",
                NELLYMOSER: "nellymoser"
            }, n.AudioCodecParameters = function e(t, n, r) {
                i(this, e), this.name = t, this.channelCount = n, this.clockRate = r
            }, n.AudioEncodingParameters = function e(t, n) {
                i(this, e), this.codec = t, this.maxBitrate = n
            }, n.VideoCodec = {
                VP8: "vp8",
                VP9: "vp9",
                H264: "h264",
                H265: "h265"
            }, n.VideoCodecParameters = function e(t, n) {
                i(this, e), this.name = t, this.profile = n
            }, n.VideoEncodingParameters = function e(t, n) {
                i(this, e), this.codec = t, this.maxBitrate = n
            }
        }, {}],
        3: [function (e, t, n) {
            "use strict";

            function i(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function r(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function o(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            Object.defineProperty(n, "__esModule", {value: !0});
            n.EventDispatcher = function () {
                var e = {dispatcher: {}};
                e.dispatcher.eventListeners = {}, this.addEventListener = function (t, n) {
                    void 0 === e.dispatcher.eventListeners[t] && (e.dispatcher.eventListeners[t] = []), e.dispatcher.eventListeners[t].push(n)
                }, this.removeEventListener = function (t, n) {
                    if (e.dispatcher.eventListeners[t]) {
                        var i = e.dispatcher.eventListeners[t].indexOf(n);
                        -1 !== i && e.dispatcher.eventListeners[t].splice(i, 1)
                    }
                }, this.clearEventListener = function (t) {
                    e.dispatcher.eventListeners[t] = []
                }, this.dispatchEvent = function (t) {
                    e.dispatcher.eventListeners[t.type] && e.dispatcher.eventListeners[t.type].map(function (e) {
                        e(t)
                    })
                }
            };
            var a = n.IcsEvent = function e(t) {
                o(this, e), this.type = t
            };
            n.MessageEvent = function (e) {
                function t(e, n) {
                    o(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.origin = n.origin, r.message = n.message, r.to = n.to, r
                }

                return r(t, a), t
            }(), n.ErrorEvent = function (e) {
                function t(e, n) {
                    o(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.error = n.error, r
                }

                return r(t, a), t
            }(), n.MuteEvent = function (e) {
                function t(e, n) {
                    o(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.kind = n.kind, r
                }

                return r(t, a), t
            }()
        }, {}],
        4: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var i = e("./mediastream-factory.js");
            Object.keys(i).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return i[e]
                    }
                })
            });
            var r = e("./stream.js");
            Object.keys(r).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return r[e]
                    }
                })
            });
            var o = e("./mediaformat.js");
            Object.keys(o).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return o[e]
                    }
                })
            })
        }, {"./mediaformat.js": 6, "./mediastream-factory.js": 7, "./stream.js": 10}],
        5: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var i = function () {
                var e = function () {
                }, t = {DEBUG: 0, TRACE: 1, INFO: 2, WARNING: 3, ERROR: 4, NONE: 5};
                t.log = window.console.log.bind(window.console);
                var n = function (e) {
                    return "function" == typeof window.console[e] ? window.console[e].bind(window.console) : window.console.log.bind(window.console)
                }, i = function (i) {
                    t.debug = i <= 0 ? n("log") : e, t.trace = i <= 1 ? n("trace") : e, t.info = i <= 2 ? n("info") : e, t.warning = i <= 3 ? n("warn") : e, t.error = i <= 4 ? n("error") : e
                };
                return i(0), t.setLogLevel = i, t
            }();
            n.default = i
        }, {}],
        6: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            n.AudioSourceInfo = {
                MIC: "mic",
                SCREENCAST: "screen-cast",
                FILE: "file",
                MIXED: "mixed"
            }, n.VideoSourceInfo = {
                CAMERA: "camera",
                SCREENCAST: "screen-cast",
                FILE: "file",
                MIXED: "mixed"
            }, n.TrackKind = {AUDIO: "audio", VIDEO: "video", AUDIO_AND_VIDEO: "av"}, n.Resolution = function e(t, n) {
                !function (e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.width = t, this.height = n
            }
        }, {}],
        7: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.MediaStreamFactory = n.StreamConstraints = n.VideoTrackConstraints = n.AudioTrackConstraints = void 0;
            var i, r = function () {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var i = t[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                        }
                    }

                    return function (t, n, i) {
                        return n && e(t.prototype, n), i && e(t, i), t
                    }
                }(), o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, a = d(e("./utils.js")), s = e("./logger.js"), c = (i = s) && i.__esModule ? i : {default: i},
                u = d(e("./mediaformat.js"));

            function d(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function l(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            n.AudioTrackConstraints = function e(t) {
                if (l(this, e), !Object.values(u.AudioSourceInfo).some(function (e) {
                    return e === t
                })) throw new TypeError("Invalid source.");
                this.source = t, this.deviceId = void 0
            }, n.VideoTrackConstraints = function e(t) {
                if (l(this, e), !Object.values(u.VideoSourceInfo).some(function (e) {
                    return e === t
                })) throw new TypeError("Invalid source.");
                this.source = t, this.deviceId = void 0, this.resolution = void 0, this.frameRate = void 0
            }, n.StreamConstraints = function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                    n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                l(this, e), this.audio = t, this.video = n
            };

            function f(e) {
                return "object" === o(e.video) && e.video.source === u.VideoSourceInfo.SCREENCAST
            }

            n.MediaStreamFactory = function () {
                function e() {
                    l(this, e)
                }

                return r(e, null, [{
                    key: "createMediaStream", value: function (e) {
                        if ("object" !== (void 0 === e ? "undefined" : o(e)) || !e.audio && !e.video) return Promise.reject(new TypeError("Invalid constrains"));
                        if (!f(e) && "object" === o(e.audio) && e.audio.source === u.AudioSourceInfo.SCREENCAST) return Promise.reject(new TypeError("Cannot share screen without video."));
                        if (f(e) && !a.isChrome() && !a.isFirefox()) return Promise.reject(new TypeError("Screen sharing only supports Chrome and Firefox."));
                        if (f(e) && "object" === o(e.audio) && e.audio.source !== u.AudioSourceInfo.SCREENCAST) return Promise.reject(new TypeError("Cannot capture video from screen cast while capture audio from other source."));
                        if (f(e) && a.isChrome()) {
                            if (!e.extensionId) return Promise.reject(new TypeError("Extension ID must be specified for screen sharing on Chrome."));
                            var t = ["screen", "window", "tab"];
                            return e.audio && t.push("audio"), new Promise(function (n, i) {
                                chrome.runtime.sendMessage(e.extensionId, {getStream: t}, function (t) {
                                    if (void 0 === t) return i(new Error(chrome.runtime.lastError.message));
                                    e.audio && "object" !== o(t.options) && c.default.warning("Desktop sharing with audio requires the latest Chrome extension. Your audio constraints will be ignored.");
                                    var r = Object.create({});
                                    e.audio && "object" === o(t.options) && (t.options.canRequestAudioTrack ? r.audio = {
                                        mandatory: {
                                            chromeMediaSource: "desktop",
                                            chromeMediaSourceId: t.streamId
                                        }
                                    } : c.default.warning("Sharing screen with audio was not selected by user.")), r.video = Object.create({}), r.video.mandatory = Object.create({}), r.video.mandatory.chromeMediaSource = "desktop", r.video.mandatory.chromeMediaSourceId = t.streamId, e.video.resolution && (r.video.mandatory.maxHeight = r.video.mandatory.minHeight = e.video.resolution.height, r.video.mandatory.maxWidth = r.video.mandatory.minWidth = e.video.resolution.width), e.video.frameRate && (r.video.mandatory.minFrameRate = e.video.frameRate, r.video.mandatory.maxFrameRate = e.video.frameRate), n(navigator.mediaDevices.getUserMedia(r))
                                })
                            })
                        }
                        if (!e.audio && !e.video) return Promise.reject(new TypeError("At least one of audio and video must be requested."));
                        var n = Object.create({});
                        return "object" === o(e.audio) && e.audio.source === u.AudioSourceInfo.MIC ? (n.audio = Object.create({}), a.isEdge() ? n.audio.deviceId = e.audio.deviceId : n.audio.deviceId = {exact: e.audio.deviceId}) : n.audio = e.audio, "object" === o(e.audio) && e.audio.source === u.AudioSourceInfo.SCREENCAST && (c.default.warning("Screen sharing with audio is not supported in Firefox."), n.audio = !1), "object" === o(e.video) ? (n.video = Object.create({}), "number" == typeof e.video.frameRate && (n.video.frameRate = e.video.frameRate), e.video.resolution && e.video.resolution.width && e.video.resolution.height && (n.video.width = Object.create({}), n.video.width.exact = e.video.resolution.width, n.video.height = Object.create({}), n.video.height.exact = e.video.resolution.height), "string" == typeof e.video.deviceId && (n.video.deviceId = {exact: e.video.deviceId}), a.isFirefox() && e.video.source === u.VideoSourceInfo.SCREENCAST && (n.video.mediaSource = "screen")) : n.video = e.video, navigator.mediaDevices.getUserMedia(n)
                    }
                }]), e
            }()
        }, {"./logger.js": 5, "./mediaformat.js": 6, "./utils.js": 11}],
        8: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.PublishOptions = n.Publication = n.PublicationSettings = n.VideoPublicationSettings = n.AudioPublicationSettings = void 0;
            var i = o(e("./utils.js")), r = (o(e("./mediaformat.js")), e("../base/event.js"));

            function o(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            n.AudioPublicationSettings = function e(t) {
                a(this, e), this.codec = t
            }, n.VideoPublicationSettings = function e(t, n, i, r, o) {
                a(this, e), this.codec = t, this.resolution = n, this.frameRate = i, this.bitrate = r, this.keyFrameInterval = o
            }, n.PublicationSettings = function e(t, n) {
                a(this, e), this.audio = t, this.video = n
            }, n.Publication = function (e) {
                function t(e, n, r, o, s) {
                    a(this, t);
                    var c = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return Object.defineProperty(c, "id", {
                        configurable: !1,
                        writable: !1,
                        value: e || i.createUuid()
                    }), c.stop = n, c.getStats = r, c.mute = o, c.unmute = s, c
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, r.EventDispatcher), t
            }(), n.PublishOptions = function e(t, n) {
                a(this, e), this.audio = t, this.video = n
            }
        }, {"../base/event.js": 3, "./mediaformat.js": 6, "./utils.js": 11}],
        9: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.reorderCodecs = function (e, t, n) {
                if (!n || 0 === n.length) return e;
                n = "audio" === t ? n.concat(f) : n.concat(p);
                var i = e.split("\r\n"), r = u(i, "m=", t);
                if (null === r) return e;
                var o = i[r].split(" ");
                o.splice(0, 3);
                var s = [], c = !0, v = !1, m = void 0;
                try {
                    for (var _, g = n[Symbol.iterator](); !(c = (_ = g.next()).done); c = !0) for (var b = _.value, y = 0; y < i.length; y++) {
                        var S = d(i, y, -1, "a=rtpmap", b);
                        if (null !== S) {
                            var P = l(i[S]);
                            P && (s.push(P), y = S)
                        }
                    }
                } catch (e) {
                    v = !0, m = e
                } finally {
                    try {
                        !c && g.return && g.return()
                    } finally {
                        if (v) throw m
                    }
                }
                s = function (e, t) {
                    var n = !0, i = !1, r = void 0;
                    try {
                        for (var o, s = t[Symbol.iterator](); !(n = (o = s.next()).done); n = !0) {
                            var c = o.value, d = u(e, "a=fmtp", "apt=" + c);
                            if (null !== d) {
                                var l = a(e[d]);
                                t.push(l.pt)
                            }
                        }
                    } catch (e) {
                        i = !0, r = e
                    } finally {
                        try {
                            !n && s.return && s.return()
                        } finally {
                            if (i) throw r
                        }
                    }
                    return t
                }(i, s), i[r] = function (e, t) {
                    var n = e.split(" ").slice(0, 3);
                    return (n = n.concat(t)).join(" ")
                }(i[r], s);
                var w = !0, E = !1, j = void 0;
                try {
                    for (var C, O = o[Symbol.iterator](); !(w = (C = O.next()).done); w = !0) {
                        var I = C.value;
                        -1 === s.indexOf(I) && (i = h(i, I))
                    }
                } catch (e) {
                    E = !0, j = e
                } finally {
                    try {
                        !w && O.return && O.return()
                    } finally {
                        if (E) throw j
                    }
                }
                return e = i.join("\r\n")
            }, n.setMaxBitrate = function (e, t) {
                var n = !0, i = !1, r = void 0;
                try {
                    for (var a, s = t[Symbol.iterator](); !(n = (a = s.next()).done); n = !0) {
                        var c = a.value;
                        c.maxBitrate && (e = o(e, c.codec.name, "x-google-max-bitrate", c.maxBitrate.toString()))
                    }
                } catch (e) {
                    i = !0, r = e
                } finally {
                    try {
                        !n && s.return && s.return()
                    } finally {
                        if (i) throw r
                    }
                }
                return e
            };
            var i, r = e("./logger.js");
            (i = r) && i.__esModule;

            function o(e, t, n, i) {
                var r = e.split("\r\n");
                r.length <= 1 && (r = e.split("\n"));
                var o = c(r, t), d = {};
                if (null === o) {
                    var f = u(r, "a=rtpmap", t);
                    if (null === f) return e;
                    var p = l(r[f]);
                    d.pt = p.toString(), d.params = {}, d.params[n] = i, r.splice(f + 1, 0, s(d))
                } else (d = a(r[o])).params[n] = i, r[o] = s(d);
                return e = r.join("\r\n")
            }

            function a(e) {
                var t = {}, n = e.indexOf(" "), i = e.substring(n + 1).split(";"), r = new RegExp("a=fmtp:(\\d+)"),
                    o = e.match(r);
                if (!o || 2 !== o.length) return null;
                t.pt = o[1];
                for (var a = {}, s = 0; s < i.length; ++s) {
                    var c = i[s].split("=");
                    2 === c.length && (a[c[0]] = c[1])
                }
                return t.params = a, t
            }

            function s(e) {
                if (!e.hasOwnProperty("pt") || !e.hasOwnProperty("params")) return null;
                var t = e.pt, n = e.params, i = [], r = 0;
                for (var o in n) i[r] = o + "=" + n[o], ++r;
                return 0 === r ? null : "a=fmtp:" + t.toString() + " " + i.join(";")
            }

            function c(e, t) {
                var n = function (e, t) {
                    var n = u(e, "a=rtpmap", t);
                    return n ? l(e[n]) : null
                }(e, t);
                return n ? u(e, "a=fmtp:" + n.toString()) : null
            }

            function u(e, t, n) {
                return d(e, 0, -1, t, n)
            }

            function d(e, t, n, i, r) {
                for (var o = -1 !== n ? n : e.length, a = t; a < o; ++a) if (0 === e[a].indexOf(i) && (!r || -1 !== e[a].toLowerCase().indexOf(r.toLowerCase()))) return a;
                return null
            }

            function l(e) {
                var t = new RegExp("a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+"), n = e.match(t);
                return n && 2 === n.length ? n[1] : null
            }

            var f = ["CN", "telephone-event"], p = ["red", "ulpfec"];

            function h(e, t) {
                for (var n = new RegExp("a=(rtpmap|rtcp-fb|fmtp):" + t + "\\s"), i = e.length - 1; i > 0; i--) e[i].match(n) && e.splice(i, 1);
                return e
            }
        }, {"./logger.js": 5}],
        10: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.StreamEvent = n.RemoteStream = n.LocalStream = n.Stream = n.StreamSourceInfo = void 0;
            var i, r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }, o = e("./logger.js"), a = ((i = o) && i.__esModule, e("./event.js")), s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }(e("./utils.js"));

            function c(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function u(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function d(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function l(e, t) {
                return t.some(function (t) {
                    return t === e
                })
            }

            n.StreamSourceInfo = function e(t, n) {
                if (d(this, e), !l(t, [void 0, "mic", "screen-cast", "file", "mixed"])) throw new TypeError("Incorrect value for audioSourceInfo");
                if (!l(n, [void 0, "camera", "screen-cast", "file", "encoded-file", "raw-file", "mixed"])) throw new TypeError("Incorrect value for videoSourceInfo");
                this.audio = t, this.video = n
            };
            var f = n.Stream = function (e) {
                function t(e, n, i) {
                    d(this, t);
                    var o = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (e && !(e instanceof MediaStream) || "object" !== (void 0 === n ? "undefined" : r(n))) throw new TypeError("Invalid stream or sourceInfo.");
                    if (e && (e.getAudioTracks().length > 0 && !n.audio || e.getVideoTracks().length > 0 && !n.video)) throw new TypeError("Missing audio source info or video source info.");
                    return Object.defineProperty(o, "mediaStream", {
                        configurable: !1,
                        writable: !0,
                        value: e
                    }), Object.defineProperty(o, "source", {
                        configurable: !1,
                        writable: !1,
                        value: n
                    }), Object.defineProperty(o, "attributes", {configurable: !0, writable: !1, value: i}), o
                }

                return u(t, a.EventDispatcher), t
            }();
            n.LocalStream = function (e) {
                function t(e, n, i) {
                    if (d(this, t), !(e instanceof MediaStream)) throw new TypeError("Invalid stream.");
                    var r = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, i));
                    return Object.defineProperty(r, "id", {configurable: !1, writable: !1, value: s.createUuid()}), r
                }

                return u(t, f), t
            }(), n.RemoteStream = function (e) {
                function t(e, n, i, r, o) {
                    d(this, t);
                    var a = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, i, r, o));
                    return Object.defineProperty(a, "id", {
                        configurable: !1,
                        writable: !1,
                        value: e || s.createUuid()
                    }), Object.defineProperty(a, "origin", {
                        configurable: !1,
                        writable: !1,
                        value: n
                    }), a.settings = void 0, a.capabilities = void 0, a
                }

                return u(t, f), t
            }(), n.StreamEvent = function (e) {
                function t(e, n) {
                    d(this, t);
                    var i = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return i.stream = n.stream, i
                }

                return u(t, a.IcsEvent), t
            }()
        }, {"./event.js": 3, "./logger.js": 5, "./utils.js": 11}],
        11: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.isFirefox = function () {
                return null !== window.navigator.userAgent.match("Firefox")
            }, n.isChrome = function () {
                return null !== window.navigator.userAgent.match("Chrome")
            }, n.isSafari = r, n.isEdge = function () {
                return null !== window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)
            }, n.createUuid = function () {
                return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                    var t = 16 * Math.random() | 0, n = "x" === e ? t : 3 & t | 8;
                    return n.toString(16)
                })
            }, n.sysInfo = function () {
                var e = Object.create({});
                e.sdk = {version: i, type: "JavaScript"};
                var t = navigator.userAgent, n = /Chrome\/([0-9\.]+)/.exec(t);
                n ? e.runtime = {
                    name: "Chrome",
                    version: n[1]
                } : (n = /Firefox\/([0-9\.]+)/.exec(t)) ? e.runtime = {
                    name: "Firefox",
                    version: n[1]
                } : (n = /Edge\/([0-9\.]+)/.exec(t)) ? e.runtime = {
                    name: "Edge",
                    version: n[1]
                } : r() ? (n = /Version\/([0-9\.]+) Safari/.exec(t), e.runtime = {name: "Safari"}, e.runtime.version = n ? n[1] : "Unknown") : e.runtime = {
                    name: "Unknown",
                    version: "Unknown"
                };
                (n = /Windows NT ([0-9\.]+)/.exec(t)) ? e.os = {
                    name: "Windows NT",
                    version: n[1]
                } : (n = /Intel Mac OS X ([0-9_\.]+)/.exec(t)) ? e.os = {
                    name: "Mac OS X",
                    version: n[1].replace(/_/g, ".")
                } : (n = /iPhone OS ([0-9_\.]+)/.exec(t)) ? e.os = {
                    name: "iPhone OS",
                    version: n[1].replace(/_/g, ".")
                } : (n = /X11; Linux/.exec(t)) ? e.os = {
                    name: "Linux",
                    version: "Unknown"
                } : (n = /Android( ([0-9\.]+))?/.exec(t)) ? e.os = {
                    name: "Android",
                    version: n[1] || "Unknown"
                } : (n = /CrOS/.exec(t)) ? e.os = {name: "Chrome OS", version: "Unknown"} : e.os = {
                    name: "Unknown",
                    version: "Unknown"
                };
                return e.capabilities = {
                    continualIceGathering: !1,
                    unifiedPlan: !1,
                    streamRemovable: "Firefox" !== e.runtime.name
                }, e
            };
            var i = "4.1";

            function r() {
                return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
            }
        }, {}],
        12: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferencePeerConnectionChannel = void 0;
            var i, r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, o = function () {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var i = t[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                        }
                    }

                    return function (t, n, i) {
                        return n && e(t.prototype, n), i && e(t, i), t
                    }
                }(), a = e("../base/logger.js"), s = (i = a) && i.__esModule ? i : {default: i}, c = e("../base/event.js"),
                u = e("../base/mediaformat.js"), d = e("../base/publication.js"), l = e("./subscription.js"),
                f = e("./error.js"), p = (v(f), v(e("../base/utils.js"))),
                h = (v(e("../base/stream.js")), v(e("../base/sdputils.js")));

            function v(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            n.ConferencePeerConnectionChannel = function (e) {
                function t(e, n) {
                    !function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var i = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return i._config = e, i._options = null, i._signaling = n, i._pc = null, i._internalId = null, i._pendingCandidates = [], i._subscribePromise = null, i._publishPromise = null, i._subscribedStream = null, i._publishedStream = null, i._publication = null, i._subscription = null, i._disconnectTimer = null, i._ended = !1, i
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, c.EventDispatcher), o(t, [{
                    key: "onMessage", value: function (e, t) {
                        switch (e) {
                            case"progress":
                                "soac" === t.status ? this._sdpHandler(t.data) : "ready" === t.status ? this._readyHandler() : "error" === t.status && this._errorHandler(t.data);
                                break;
                            case"stream":
                                this._onStreamEvent(t);
                                break;
                            default:
                                s.default.warning("Unknown notification from MCU.")
                        }
                    }
                }, {
                    key: "publish", value: function (e, t) {
                        var n = this;
                        if (void 0 === t && (t = {
                            audio: !!e.mediaStream.getAudioTracks(),
                            video: !!e.mediaStream.getVideoTracks()
                        }), "object" !== (void 0 === t ? "undefined" : r(t))) return Promise.reject(new TypeError("Options should be an object."));
                        if (void 0 === t.audio && (t.audio = !!e.mediaStream.getAudioTracks()), void 0 === t.video && (t.video = !!e.mediaStream.getVideoTracks()), !!t.audio == !e.mediaStream.getAudioTracks().length || !!t.video == !e.mediaStream.getVideoTracks().length) return Promise.reject(new f.ConferenceError("options.audio/video is inconsistent with tracks presented in the MediaStream."));
                        if (!(!1 !== t.audio && null !== t.audio || !1 !== t.video && null !== t.video)) return Promise.reject(new f.ConferenceError("Cannot publish a stream without audio and video."));
                        if ("object" === r(t.audio)) {
                            if (!Array.isArray(t.audio)) return Promise.reject(new TypeError("options.audio should be a boolean or an array."));
                            var i = !0, o = !1, a = void 0;
                            try {
                                for (var u, d = t.audio[Symbol.iterator](); !(i = (u = d.next()).done); i = !0) {
                                    var l = u.value;
                                    if (!l.codec || "string" != typeof l.codec.name || void 0 !== l.maxBitrate && "number" != typeof l.maxBitrate) return Promise.reject(new TypeError("options.audio has incorrect parameters."))
                                }
                            } catch (e) {
                                o = !0, a = e
                            } finally {
                                try {
                                    !i && d.return && d.return()
                                } finally {
                                    if (o) throw a
                                }
                            }
                        }
                        if ("object" === r(t.video)) {
                            if (!Array.isArray(t.video)) return Promise.reject(new TypeError("options.video should be a boolean or an array."));
                            var p = !0, h = !1, v = void 0;
                            try {
                                for (var m, _ = t.video[Symbol.iterator](); !(p = (m = _.next()).done); p = !0) {
                                    var g = m.value;
                                    if (!g.codec || "string" != typeof g.codec.name || void 0 !== g.maxBitrate && "number" != typeof g.maxBitrate || void 0 !== g.codec.profile && "string" != typeof g.codec.profile) return Promise.reject(new TypeError("options.video has incorrect parameters."))
                                }
                            } catch (e) {
                                h = !0, v = e
                            } finally {
                                try {
                                    !p && _.return && _.return()
                                } finally {
                                    if (h) throw v
                                }
                            }
                        }
                        this._options = t;
                        var b = {};
                        if (this._createPeerConnection(), e.mediaStream.getAudioTracks().length > 0 && !1 !== t.audio && null !== t.audio) {
                            if (e.mediaStream.getAudioTracks().length > 1 && s.default.warning("Publishing a stream with multiple audio tracks is not fully supported."), "boolean" != typeof t.audio && "object" !== r(t.audio)) return Promise.reject(new f.ConferenceError("Type of audio options should be boolean or an object."));
                            b.audio = {}, b.audio.source = e.source.audio;
                            var y = !0, S = !1, P = void 0;
                            try {
                                for (var w, E = e.mediaStream.getAudioTracks()[Symbol.iterator](); !(y = (w = E.next()).done); y = !0) {
                                    var j = w.value;
                                    this._pc.addTrack(j, e.mediaStream)
                                }
                            } catch (e) {
                                S = !0, P = e
                            } finally {
                                try {
                                    !y && E.return && E.return()
                                } finally {
                                    if (S) throw P
                                }
                            }
                        } else b.audio = !1;
                        if (e.mediaStream.getVideoTracks().length > 0 && !1 !== t.video && null !== t.video) {
                            e.mediaStream.getVideoTracks().length > 1 && s.default.warning("Publishing a stream with multiple video tracks is not fully supported."), b.video = {}, b.video.source = e.source.video;
                            var C = e.mediaStream.getVideoTracks()[0].getSettings();
                            b.video.parameters = {
                                resolution: {width: C.width, height: C.height},
                                framerate: C.frameRate
                            };
                            var O = !0, I = !1, T = void 0;
                            try {
                                for (var k, M = e.mediaStream.getVideoTracks()[Symbol.iterator](); !(O = (k = M.next()).done); O = !0) {
                                    var N = k.value;
                                    this._pc.addTrack(N, e.mediaStream)
                                }
                            } catch (e) {
                                I = !0, T = e
                            } finally {
                                try {
                                    !O && M.return && M.return()
                                } finally {
                                    if (I) throw T
                                }
                            }
                        } else b.video = !1;
                        return this._publishedStream = e, this._signaling.sendSignalingMessage("publish", {
                            media: b,
                            attributes: e.attributes
                        }).then(function (i) {
                            var r = new c.MessageEvent("id", {message: i.id, origin: n._remoteId});
                            n.dispatchEvent(r), n._internalId = i.id;
                            if (n._isAddTransceiverSupported()) {
                                if (b.audio && e.mediaStream.getAudioTracks() > 0) n._pc.addTransceiver("audio", {direction: "sendonly"});
                                if (b.video && e.mediaStream.getVideoTracks() > 0) n._pc.addTransceiver("video", {direction: "sendonly"})
                            }
                            var o = void 0;
                            n._pc.createOffer({offerToReceiveAudio: !1, offerToReceiveVideo: !1}).then(function (e) {
                                return t && (e.sdp = n._setRtpReceiverOptions(e.sdp, t)), e
                            }).then(function (e) {
                                return o = e, n._pc.setLocalDescription(e)
                            }).then(function () {
                                n._signaling.sendSignalingMessage("soac", {id: n._internalId, signaling: o})
                            }).catch(function (e) {
                                s.default.error("Failed to create offer or set SDP. Message: " + e.message), n._unpublish(), n._rejectPromise(e), n._fireEndedEventOnPublicationOrSubscription()
                            })
                        }).catch(function (e) {
                            n._unpublish(), n._rejectPromise(e), n._fireEndedEventOnPublicationOrSubscription()
                        }), new Promise(function (e, t) {
                            n._publishPromise = {resolve: e, reject: t}
                        })
                    }
                }, {
                    key: "subscribe", value: function (e, t) {
                        var n = this;
                        if (void 0 === t && (t = {
                            audio: !!e.capabilities.audio,
                            video: !!e.capabilities.video
                        }), "object" !== (void 0 === t ? "undefined" : r(t))) return Promise.reject(new TypeError("Options should be an object."));
                        if (void 0 === t.audio && (t.audio = !!e.capabilities.audio), void 0 === t.video && (t.video = !!e.capabilities.video), void 0 !== t.audio && "object" !== r(t.audio) && "boolean" != typeof t.audio && null !== t.audio || void 0 !== t.video && "object" !== r(t.video) && "boolean" != typeof t.video && null !== t.video) return Promise.reject(new TypeError("Invalid options type."));
                        if (t.audio && !e.capabilities.audio || t.video && !e.capabilities.video) return Promise.reject(new f.ConferenceError("options.audio/video cannot be true or an object if there is no audio/video track in remote stream."));
                        if (!1 === t.audio && !1 === t.video) return Promise.reject(new f.ConferenceError("Cannot subscribe a stream without audio and video."));
                        this._options = t;
                        var i = {};
                        if (t.audio) {
                            if ("object" === r(t.audio) && Array.isArray(t.audio.codecs) && 0 === t.audio.codecs.length) return Promise.reject(new TypeError("Audio codec cannot be an empty array."));
                            i.audio = {}, i.audio.from = e.id
                        } else i.audio = !1;
                        if (t.video) {
                            if ("object" === r(t.video) && Array.isArray(t.video.codecs) && 0 === t.video.codecs.length) return Promise.reject(new TypeError("Video codec cannot be an empty array."));
                            i.video = {}, i.video.from = e.id, (t.video.resolution || t.video.frameRate || t.video.bitrateMultiplier && 1 !== t.video.bitrateMultiplier || t.video.keyFrameInterval) && (i.video.parameters = {
                                resolution: t.video.resolution,
                                framerate: t.video.frameRate,
                                bitrate: t.video.bitrateMultiplier ? "x" + t.video.bitrateMultiplier.toString() : void 0,
                                keyFrameInterval: t.video.keyFrameInterval
                            })
                        } else i.video = !1;
                        return this._subscribedStream = e, this._signaling.sendSignalingMessage("subscribe", {media: i}).then(function (e) {
                            var r = new c.MessageEvent("id", {message: e.id, origin: n._remoteId});
                            n.dispatchEvent(r), n._internalId = e.id, n._createPeerConnection();
                            var o = {offerToReceiveAudio: !!t.audio, offerToReceiveVideo: !!t.video};
                            if (n._isAddTransceiverSupported()) {
                                if (i.audio) n._pc.addTransceiver("audio", {direction: "recvonly"});
                                if (i.video) n._pc.addTransceiver("video", {direction: "recvonly"})
                            }
                            n._pc.createOffer(o).then(function (e) {
                                t && (e.sdp = n._setRtpReceiverOptions(e.sdp, t)), n._pc.setLocalDescription(e).then(function () {
                                    n._signaling.sendSignalingMessage("soac", {id: n._internalId, signaling: e})
                                }, function (e) {
                                    s.default.error("Set local description failed. Message: " + JSON.stringify(e))
                                })
                            }, function (e) {
                                s.default.error("Create offer failed. Error info: " + JSON.stringify(e))
                            }).catch(function (e) {
                                s.default.error("Failed to create offer or set SDP. Message: " + e.message), n._unsubscribe(), n._rejectPromise(e), n._fireEndedEventOnPublicationOrSubscription()
                            })
                        }).catch(function (e) {
                            n._unsubscribe(), n._rejectPromise(e), n._fireEndedEventOnPublicationOrSubscription()
                        }), new Promise(function (e, t) {
                            n._subscribePromise = {resolve: e, reject: t}
                        })
                    }
                }, {
                    key: "_unpublish", value: function () {
                        this._signaling.sendSignalingMessage("unpublish", {id: this._internalId}).catch(function (e) {
                            s.default.warning("MCU returns negative ack for unpublishing, " + e)
                        }), this._pc && "closed" !== this._pc.signalingState && this._pc.close()
                    }
                }, {
                    key: "_unsubscribe", value: function () {
                        this._signaling.sendSignalingMessage("unsubscribe", {id: this._internalId}).catch(function (e) {
                            s.default.warning("MCU returns negative ack for unsubscribing, " + e)
                        }), this._pc && "closed" !== this._pc.signalingState && this._pc.close()
                    }
                }, {
                    key: "_muteOrUnmute", value: function (e, t, n) {
                        var i = this, r = t ? "stream-control" : "subscription-control", o = e ? "pause" : "play";
                        return this._signaling.sendSignalingMessage(r, {
                            id: this._internalId,
                            operation: o,
                            data: n
                        }).then(function () {
                            if (!t) {
                                var r = e ? "mute" : "unmute";
                                i._subscription.dispatchEvent(new c.MuteEvent(r, {kind: n}))
                            }
                        })
                    }
                }, {
                    key: "_applyOptions", value: function (e) {
                        if ("object" !== (void 0 === e ? "undefined" : r(e)) || "object" !== r(e.video)) return Promise.reject(new f.ConferenceError("Options should be an object."));
                        var t = {};
                        return t.resolution = e.video.resolution, t.framerate = e.video.frameRate, t.bitrate = e.video.bitrateMultiplier ? "x" + e.video.bitrateMultiplier.toString() : void 0, t.keyFrameInterval = e.video.keyFrameInterval, this._signaling.sendSignalingMessage("subscription-control", {
                            id: this._internalId,
                            operation: "update",
                            data: {video: {parameters: t}}
                        }).then()
                    }
                }, {
                    key: "_onRemoteStreamAdded", value: function (e) {
                        s.default.debug("Remote stream added."), this._subscribedStream ? this._subscribedStream.mediaStream = e.stream : s.default.warning("Received remote stream without subscription.")
                    }
                }, {
                    key: "_onLocalIceCandidate", value: function (e) {
                        e.candidate ? "stable" !== this._pc.signalingState ? this._pendingCandidates.push(e.candidate) : this._sendCandidate(e.candidate) : s.default.debug("Empty candidate.")
                    }
                }, {
                    key: "_fireEndedEventOnPublicationOrSubscription", value: function () {
                        if (!this._ended) {
                            this._ended = !0;
                            var e = new c.IcsEvent("ended");
                            this._publication ? (this._publication.dispatchEvent(e), this._publication.stop()) : this._subscription && (this._subscription.dispatchEvent(e), this._subscription.stop())
                        }
                    }
                }, {
                    key: "_rejectPromise", value: function (e) {
                        if (!e) new f.ConferenceError("Connection failed or closed.");
                        this._publishPromise ? (this._publishPromise.reject(e), this._publishPromise = void 0) : this._subscribePromise && (this._subscribePromise.reject(e), this._subscribePromise = void 0)
                    }
                }, {
                    key: "_onIceConnectionStateChange", value: function (e) {
                        e && e.currentTarget && (s.default.debug("ICE connection state changed to " + e.currentTarget.iceConnectionState), "closed" !== e.currentTarget.iceConnectionState && "failed" !== e.currentTarget.iceConnectionState || (this._rejectPromise(new f.ConferenceError("ICE connection failed or closed.")), this._fireEndedEventOnPublicationOrSubscription()))
                    }
                }, {
                    key: "_sendCandidate", value: function (e) {
                        this._signaling.sendSignalingMessage("soac", {
                            id: this._internalId,
                            signaling: {
                                type: "candidate",
                                candidate: {
                                    candidate: "a=" + e.candidate,
                                    sdpMid: e.sdpMid,
                                    sdpMLineIndex: e.sdpMLineIndex
                                }
                            }
                        })
                    }
                }, {
                    key: "_createPeerConnection", value: function () {
                        var e = this, t = this._config.rtcConfiguration || {};
                        p.isChrome() && (t.sdpSemantics = "plan-b"), this._pc = new RTCPeerConnection(t), this._pc.onicecandidate = function (t) {
                            e._onLocalIceCandidate.apply(e, [t])
                        }, this._pc.onaddstream = function (t) {
                            e._onRemoteStreamAdded.apply(e, [t])
                        }, this._pc.oniceconnectionstatechange = function (t) {
                            e._onIceConnectionStateChange.apply(e, [t])
                        }
                    }
                }, {
                    key: "_getStats", value: function () {
                        return this._pc ? this._pc.getStats() : Promise.reject(new f.ConferenceError("PeerConnection is not available."))
                    }
                }, {
                    key: "_readyHandler", value: function () {
                        var e = this;
                        this._subscribePromise ? (this._subscription = new l.Subscription(this._internalId, function () {
                            e._unsubscribe()
                        }, function () {
                            return e._getStats()
                        }, function (t) {
                            return e._muteOrUnmute(!0, !1, t)
                        }, function (t) {
                            return e._muteOrUnmute(!1, !1, t)
                        }, function (t) {
                            return e._applyOptions(t)
                        }), this._subscribedStream.addEventListener("ended", function () {
                            e._subscription.dispatchEvent("ended", new c.IcsEvent("ended"))
                        }), this._subscribePromise.resolve(this._subscription)) : this._publishPromise && (this._publication = new d.Publication(this._internalId, function () {
                            return e._unpublish(), Promise.resolve()
                        }, function () {
                            return e._getStats()
                        }, function (t) {
                            return e._muteOrUnmute(!0, !0, t)
                        }, function (t) {
                            return e._muteOrUnmute(!1, !0, t)
                        }), this._publishPromise.resolve(this._publication)), this._publishPromise = null, this._subscribePromise = null
                    }
                }, {
                    key: "_sdpHandler", value: function (e) {
                        var t = this;
                        "answer" === e.type && ((this._publication || this._publishPromise) && this._options && (e.sdp = this._setRtpSenderOptions(e.sdp, this._options)), this._pc.setRemoteDescription(e).then(function () {
                            if (t._pendingCandidates.length > 0) {
                                var e = !0, n = !1, i = void 0;
                                try {
                                    for (var r, o = t._pendingCandidates[Symbol.iterator](); !(e = (r = o.next()).done); e = !0) {
                                        var a = r.value;
                                        t._sendCandidate(a)
                                    }
                                } catch (e) {
                                    n = !0, i = e
                                } finally {
                                    try {
                                        !e && o.return && o.return()
                                    } finally {
                                        if (n) throw i
                                    }
                                }
                            }
                        }, function (e) {
                            s.default.error("Set remote description failed: " + e), t._rejectPromise(e), t._fireEndedEventOnPublicationOrSubscription()
                        }))
                    }
                }, {
                    key: "_errorHandler", value: function (e) {
                        var t = this._publishPromise || this._subscribePromise;
                        if (t) t.reject(new f.ConferenceError(e)); else {
                            var n = this._publication || this._subscription;
                            if (n) {
                                var i = new f.ConferenceError(e), r = new c.ErrorEvent("error", {error: i});
                                n.dispatchEvent(r)
                            } else s.default.warning("Neither publication nor subscription is available.")
                        }
                    }
                }, {
                    key: "_setCodecOrder", value: function (e, t) {
                        if (this._publication || this._publishPromise) {
                            if (t.audio) {
                                var n = Array.from(t.audio, function (e) {
                                    return e.codec.name
                                });
                                e = h.reorderCodecs(e, "audio", n)
                            }
                            if (t.video) {
                                var i = Array.from(t.video, function (e) {
                                    return e.codec.name
                                });
                                e = h.reorderCodecs(e, "video", i)
                            }
                        } else {
                            if (t.audio && t.audio.codecs) {
                                var r = Array.from(t.audio.codecs, function (e) {
                                    return e.name
                                });
                                e = h.reorderCodecs(e, "audio", r)
                            }
                            if (t.video && t.video.codecs) {
                                var o = Array.from(t.video.codecs, function (e) {
                                    return e.name
                                });
                                e = h.reorderCodecs(e, "video", o)
                            }
                        }
                        return e
                    }
                }, {
                    key: "_setMaxBitrate", value: function (e, t) {
                        return "object" === r(t.audio) && (e = h.setMaxBitrate(e, t.audio)), "object" === r(t.video) && (e = h.setMaxBitrate(e, t.video)), e
                    }
                }, {
                    key: "_setRtpSenderOptions", value: function (e, t) {
                        return e = this._setMaxBitrate(e, t)
                    }
                }, {
                    key: "_setRtpReceiverOptions", value: function (e, t) {
                        return e = this._setCodecOrder(e, t)
                    }
                }, {
                    key: "_onStreamEvent", value: function (e) {
                        var t = void 0;
                        if (this._publication && e.id === this._publication.id ? t = this._publication : this._subscribedStream && e.id === this._subscribedStream.id && (t = this._subscription), t) {
                            var n = void 0;
                            "audio.status" === e.data.field ? n = u.TrackKind.AUDIO : "video.status" === e.data.field ? n = u.TrackKind.VIDEO : s.default.warning("Invalid data field for stream update info."), "active" === e.data.value ? t.dispatchEvent(new c.MuteEvent("unmute", {kind: n})) : "inactive" === e.data.value ? t.dispatchEvent(new c.MuteEvent("mute", {kind: n})) : s.default.warning("Invalid data value for stream update info.")
                        }
                    }
                }, {
                    key: "_isAddTransceiverSupported", value: function () {
                        var e = p.sysInfo();
                        return "function" == typeof this._pc.addTransceiver && ("Chrome" !== e.runtime.name || e.runtime.version <= 68)
                    }
                }]), t
            }()
        }, {
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/mediaformat.js": 6,
            "../base/publication.js": 8,
            "../base/sdputils.js": 9,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./error.js": 14,
            "./subscription.js": 21
        }],
        13: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferenceClient = void 0;
            var i, r = _(e("../base/event.js")), o = e("./signaling.js"), a = e("../base/logger.js"),
                s = (i = a) && i.__esModule ? i : {default: i}, c = e("../base/base64.js"), u = e("./error.js"),
                d = _(e("../base/utils.js")), l = _(e("../base/stream.js")), f = e("./participant.js"),
                p = e("./info.js"), h = e("./channel.js"), v = e("./mixedstream.js"), m = _(e("./streamutils.js"));

            function _(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            var g = 1, b = 2, y = 3, S = function (e, t) {
                var n = new r.IcsEvent(e, t);
                return n.participant = t.participant, n
            };
            n.ConferenceClient = function (e, t) {
                Object.setPrototypeOf(this, new r.EventDispatcher), e = e || {};
                var n = this, i = g, a = t || new o.SioSignaling, _ = void 0, P = void 0, w = new Map, E = new Map,
                    j = new Map, C = new Map;

                function O(e, t) {
                    if ("soac" === e || "progress" === e) {
                        if (!C.has(t.id)) return void s.default.warning("Cannot find a channel for incoming data.");
                        C.get(t.id).onMessage(e, t)
                    } else "stream" === e ? "add" === t.status ? function (e) {
                        var t = I(e);
                        w.set(t.id, t);
                        var i = new l.StreamEvent("streamadded", {stream: t});
                        n.dispatchEvent(i)
                    }(t.data) : "remove" === t.status ? function (e) {
                        if (!w.has(e.id)) return void s.default.warning("Cannot find specific remote stream.");
                        var t = w.get(e.id), n = new r.IcsEvent("ended");
                        w.delete(t.id), t.dispatchEvent(n)
                    }(t) : "update" === t.status && ("audio.status" === t.data.field || "video.status" === t.data.field ? C.forEach(function (n) {
                        n.onMessage(e, t)
                    }) : "activeInput" === t.data.field ? function (e) {
                        if (!w.has(e.id)) return void s.default.warning("Cannot find specific remote stream.");
                        var t = w.get(e.id),
                            n = new v.ActiveAudioInputChangeEvent("activeaudioinputchange", {activeAudioInputStreamId: e.data.value});
                        t.dispatchEvent(n)
                    }(t) : "video.layout" === t.data.field ? function (e) {
                        if (!w.has(e.id)) return void s.default.warning("Cannot find specific remote stream.");
                        var t = w.get(e.id), n = new v.LayoutChangeEvent("layoutchange", {layout: e.data.value});
                        t.dispatchEvent(n)
                    }(t) : "." === t.data.field ? function (e) {
                        if (!w.has(e.id)) return void s.default.warning("Cannot find specific remote stream.");
                        var t = w.get(e.id);
                        t.settings = m.convertToPublicationSettings(e.media), t.capabilities = m.convertToSubscriptionCapabilities(e.media);
                        var n = new r.IcsEvent("updated");
                        t.dispatchEvent(n)
                    }(t.data.value) : s.default.warning("Unknown stream event from MCU.")) : "text" === e ? function (e) {
                        var t = new r.MessageEvent("messagereceived", {message: e.message, origin: e.from, to: e.to});
                        n.dispatchEvent(t)
                    }(t) : "participant" === e && function (e) {
                        if ("join" === e.action) {
                            e = e.data;
                            var t = new f.Participant(e.id, e.role, e.user);
                            E.set(e.id, t);
                            var i = new S("participantjoined", {participant: t});
                            n.dispatchEvent(i)
                        } else if ("leave" === e.action) {
                            var o = e.data;
                            if (!E.has(o)) return void s.default.warning("Received leave message from MCU for an unknown participant.");
                            var a = E.get(o);
                            E.delete(o), a.dispatchEvent(new r.IcsEvent("left"))
                        }
                    }(t)
                }

                function I(e) {
                    if ("mixed" === e.type) return new v.RemoteMixedStream(e);
                    var t = void 0, n = void 0;
                    e.media.audio && (t = e.media.audio.source), e.media.video && (n = e.media.video.source);
                    var i = new l.RemoteStream(e.id, e.info.owner, void 0, new l.StreamSourceInfo(t, n), e.info.attributes);
                    return i.settings = m.convertToPublicationSettings(e.media), i.capabilities = m.convertToSubscriptionCapabilities(e.media), i
                }

                function T(e, t) {
                    return a.send(e, t)
                }

                function k() {
                    var t = Object.create(r.EventDispatcher);
                    t.sendSignalingMessage = T;
                    var n = new h.ConferencePeerConnectionChannel(e, t);
                    return n.addEventListener("id", function (e) {
                        C.set(e.message, n)
                    }), n
                }

                function M() {
                    E.clear(), w.clear()
                }

                a.addEventListener("data", function (e) {
                    O(e.message.notification, e.message.data)
                }), a.addEventListener("disconnect", function () {
                    M(), i = g, n.dispatchEvent(new r.IcsEvent("serverdisconnected"))
                }), Object.defineProperty(this, "info", {
                    configurable: !1, get: function () {
                        return P ? new p.ConferenceInfo(P.id, Array.from(E, function (e) {
                            return e[1]
                        }), Array.from(w, function (e) {
                            return e[1]
                        }), _) : null
                    }
                }), this.join = function (e) {
                    return new Promise(function (t, n) {
                        var r = JSON.parse(c.Base64.decodeBase64(e)), o = !0 === r.secure, s = r.host;
                        if ("string" == typeof s) if (-1 === s.indexOf("http") && (s = o ? "https://" + s : "http://" + s), i === g) {
                            i = b;
                            var l = {token: e, userAgent: d.sysInfo(), protocol: "1.0"};
                            a.connect(s, o, l).then(function (e) {
                                if (i = y, void 0 !== (P = e.room).streams) {
                                    var n = !0, r = !1, o = void 0;
                                    try {
                                        for (var a, s = P.streams[Symbol.iterator](); !(n = (a = s.next()).done); n = !0) {
                                            var c = a.value;
                                            "mixed" === c.type && (c.viewport = c.info.label), w.set(c.id, I(c))
                                        }
                                    } catch (e) {
                                        r = !0, o = e
                                    } finally {
                                        try {
                                            !n && s.return && s.return()
                                        } finally {
                                            if (r) throw o
                                        }
                                    }
                                }
                                if (e.room && void 0 !== e.room.participants) {
                                    var u = !0, d = !1, l = void 0;
                                    try {
                                        for (var h, v = e.room.participants[Symbol.iterator](); !(u = (h = v.next()).done); u = !0) {
                                            var m = h.value;
                                            E.set(m.id, new f.Participant(m.id, m.role, m.user)), m.id === e.id && (_ = E.get(m.id))
                                        }
                                    } catch (e) {
                                        d = !0, l = e
                                    } finally {
                                        try {
                                            !u && v.return && v.return()
                                        } finally {
                                            if (d) throw l
                                        }
                                    }
                                }
                                t(new p.ConferenceInfo(e.room.id, Array.from(E.values()), Array.from(w.values()), _))
                            }, function (e) {
                                i = g, n(new u.ConferenceError(e))
                            })
                        } else n(new u.ConferenceError("connection state invalid")); else n(new u.ConferenceError("Invalid host."))
                    })
                }, this.publish = function (e, t) {
                    return e instanceof l.LocalStream ? j.has(e.mediaStream.id) ? Promise.reject(new u.ConferenceError("Cannot publish a published stream.")) : k().publish(e, t) : Promise.reject(new u.ConferenceError("Invalid stream."))
                }, this.subscribe = function (e, t) {
                    return e instanceof l.RemoteStream ? k().subscribe(e, t) : Promise.reject(new u.ConferenceError("Invalid stream."))
                }, this.send = function (e, t) {
                    return void 0 === t && (t = "all"), T("text", {to: t, message: e})
                }, this.leave = function () {
                    return a.disconnect().then(function () {
                        M(), i = g
                    })
                }
            }
        }, {
            "../base/base64.js": 1,
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./channel.js": 12,
            "./error.js": 14,
            "./info.js": 16,
            "./mixedstream.js": 17,
            "./participant.js": 18,
            "./signaling.js": 19,
            "./streamutils.js": 20
        }],
        14: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            n.ConferenceError = function (e) {
                function t(e) {
                    return function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, Error), t
            }()
        }, {}],
        15: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var i = e("./client.js");
            Object.defineProperty(n, "ConferenceClient", {
                enumerable: !0, get: function () {
                    return i.ConferenceClient
                }
            });
            var r = e("./signaling.js");
            Object.defineProperty(n, "SioSignaling", {
                enumerable: !0, get: function () {
                    return r.SioSignaling
                }
            })
        }, {"./client.js": 13, "./signaling.js": 19}],
        16: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            n.ConferenceInfo = function e(t, n, i, r) {
                !function (e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.id = t, this.participants = n, this.remoteStreams = i, this.self = r
            }
        }, {}],
        17: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.LayoutChangeEvent = n.ActiveAudioInputChangeEvent = n.RemoteMixedStream = void 0;
            var i = a(e("../base/stream.js")), r = a(e("./streamutils.js")), o = e("../base/event.js");

            function a(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function s(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function c(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function u(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            n.RemoteMixedStream = function (e) {
                function t(e) {
                    if (s(this, t), "mixed" !== e.type) throw new TypeError("Not a mixed stream");
                    var n = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e.id, void 0, void 0, new i.StreamSourceInfo("mixed", "mixed")));
                    return n.settings = r.convertToPublicationSettings(e.media), n.capabilities = new r.convertToSubscriptionCapabilities(e.media), n
                }

                return u(t, i.RemoteStream), t
            }(), n.ActiveAudioInputChangeEvent = function (e) {
                function t(e, n) {
                    s(this, t);
                    var i = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return i.activeAudioInputStreamId = n.activeAudioInputStreamId, i
                }

                return u(t, o.IcsEvent), t
            }(), n.LayoutChangeEvent = function (e) {
                function t(e, n) {
                    s(this, t);
                    var i = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return i.layout = n.layout, i
                }

                return u(t, o.IcsEvent), t
            }()
        }, {"../base/event.js": 3, "../base/stream.js": 10, "./streamutils.js": 20}],
        18: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Participant = void 0;
            var i = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }(e("../base/event.js"));
            n.Participant = function (e) {
                function t(e, n, i) {
                    !function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var r = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return Object.defineProperty(r, "id", {
                        configurable: !1,
                        writable: !1,
                        value: e
                    }), Object.defineProperty(r, "role", {
                        configurable: !1,
                        writable: !1,
                        value: n
                    }), Object.defineProperty(r, "userId", {configurable: !1, writable: !1, value: i}), r
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, i.EventDispatcher), t
            }()
        }, {"../base/event.js": 3}],
        19: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.SioSignaling = void 0;
            var i, r = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }

                return function (t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(), o = e("../base/logger.js"), a = (i = o) && i.__esModule ? i : {default: i}, s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }(e("../base/event.js")), c = e("./error.js");

            function u(e, t, n, i) {
                "ok" === e || "success" === e ? n(t) : "error" === e ? i(t) : a.default.error("MCU returns unknown ack.")
            }

            n.SioSignaling = function (e) {
                function t() {
                    !function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var e = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return e._socket = null, e._loggedIn = !1, e._reconnectTimes = 0, e._reconnectionTicket = null, e
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, s.EventDispatcher), r(t, [{
                    key: "connect", value: function (e, t, n) {
                        var i = this;
                        return new Promise(function (t, r) {
                            var o = {reconnection: !0, reconnectionAttempts: 5, "force new connection": !0};
                            i._socket = io(e, o), ["participant", "text", "stream", "progress"].forEach(function (e) {
                                i._socket.on(e, function (t) {
                                    i.dispatchEvent(new s.MessageEvent("data", {message: {notification: e, data: t}}))
                                })
                            }), i._socket.on("reconnecting", function () {
                                i._reconnectTimes++
                            }), i._socket.on("reconnect_failed", function () {
                                i._reconnectTimes >= 5 && i.dispatchEvent(new s.IcsEvent("disconnect"))
                            }), i._socket.on("drop", function () {
                                i._reconnectTimes = 5
                            }), i._socket.on("disconnect", function () {
                                i._reconnectTimes >= 5 && (i._loggedIn = !1, i.dispatchEvent(new s.IcsEvent("disconnect")))
                            }), i._socket.emit("login", n, function (e, n) {
                                "ok" === e && (i._loggedIn = !0, i._reconnectionTicket = n.reconnectionTicket, i._socket.on("connect", function () {
                                    i._socket.emit("relogin", i._reconnectionTicket, function (e, t) {
                                        "ok" === e ? (i._reconnectTimes = 0, i._reconnectionTicket = t) : i.dispatchEvent(new s.IcsEvent("disconnect"))
                                    })
                                })), u(e, n, t, r)
                            })
                        })
                    }
                }, {
                    key: "disconnect", value: function () {
                        var e = this;
                        return !this._socket || this._socket.disconnected ? Promise.reject(new c.ConferenceError("Portal is not connected.")) : new Promise(function (t, n) {
                            e._socket.emit("logout", function (i, r) {
                                e._reconnectTimes = 5, e._socket.disconnect(), u(i, r, t, n)
                            })
                        })
                    }
                }, {
                    key: "send", value: function (e, t) {
                        var n = this;
                        return new Promise(function (i, r) {
                            n._socket.emit(e, t, function (e, t) {
                                u(e, t, i, r)
                            })
                        })
                    }
                }]), t
            }()
        }, {"../base/event.js": 3, "../base/logger.js": 5, "./error.js": 14}],
        20: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.convertToPublicationSettings = function (e) {
                var t = void 0, n = void 0, a = void 0, s = void 0, c = void 0, u = void 0, d = void 0, l = void 0;
                e.audio && (e.audio.format && (n = new o.AudioCodecParameters(e.audio.format.codec, e.audio.format.channelNum, e.audio.format.sampleRate)), t = new i.AudioPublicationSettings(n));
                e.video && (e.video.format && (s = new o.VideoCodecParameters(e.video.format.codec, e.video.format.profile)), e.video.parameters && (e.video.parameters.resolution && (c = new r.Resolution(e.video.parameters.resolution.width, e.video.parameters.resolution.height)), u = e.video.parameters.framerate, d = 1e3 * e.video.parameters.bitrate, l = e.video.parameters.keyFrameInterval), a = new i.VideoPublicationSettings(s, c, u, d, l));
                return new i.PublicationSettings(t, a)
            }, n.convertToSubscriptionCapabilities = function (e) {
                var t = void 0, n = void 0;
                if (e.audio) {
                    var i = [];
                    if (e.audio && e.audio.format && i.push(new o.AudioCodecParameters(e.audio.format.codec, e.audio.format.channelNum, e.audio.format.sampleRate)), e.audio && e.audio.optional && e.audio.optional.format) {
                        var s = !0, d = !1, l = void 0;
                        try {
                            for (var f, p = e.audio.optional.format[Symbol.iterator](); !(s = (f = p.next()).done); s = !0) {
                                var h = f.value, v = new o.AudioCodecParameters(h.codec, h.channelNum, h.sampleRate);
                                i.push(v)
                            }
                        } catch (e) {
                            d = !0, l = e
                        } finally {
                            try {
                                !s && p.return && p.return()
                            } finally {
                                if (d) throw l
                            }
                        }
                    }
                    i.sort(), t = new a.AudioSubscriptionCapabilities(i)
                }
                if (e.video) {
                    var m = [];
                    if (e.video && e.video.format && m.push(new o.VideoCodecParameters(e.video.format.codec, e.video.format.profile)), e.video && e.video.optional && e.video.optional.format) {
                        var _ = !0, g = !1, b = void 0;
                        try {
                            for (var y, S = e.video.optional.format[Symbol.iterator](); !(_ = (y = S.next()).done); _ = !0) {
                                var P = y.value, w = new o.VideoCodecParameters(P.codec, P.profile);
                                m.push(w)
                            }
                        } catch (e) {
                            g = !0, b = e
                        } finally {
                            try {
                                !_ && S.return && S.return()
                            } finally {
                                if (g) throw b
                            }
                        }
                    }
                    m.sort();
                    var E = Array.from(e.video.optional.parameters.resolution, function (e) {
                        return new r.Resolution(e.width, e.height)
                    });
                    e.video && e.video.parameters && e.video.parameters.resolution && E.push(new r.Resolution(e.video.parameters.resolution.width, e.video.parameters.resolution.height)), E.sort(u);
                    var j = Array.from(e.video.optional.parameters.bitrate, function (e) {
                        return function (e) {
                            if ("string" != typeof e || !e.startsWith("x")) return L.Logger.warning("Invalid bitrate multiplier input."), 0;
                            return Number.parseFloat(e.replace(/^x/, ""))
                        }(e)
                    });
                    j.push(1), j.sort(c);
                    var C = JSON.parse(JSON.stringify(e.video.optional.parameters.framerate));
                    e.video && e.video.parameters && e.video.parameters.framerate && C.push(e.video.parameters.framerate), C.sort(c);
                    var O = JSON.parse(JSON.stringify(e.video.optional.parameters.keyFrameInterval));
                    e.video && e.video.parameters && e.video.parameters.keyFrameInterval && O.push(e.video.parameters.keyFrameInterval), O.sort(c), n = new a.VideoSubscriptionCapabilities(m, E, C, j, O)
                }
                return new a.SubscriptionCapabilities(t, n)
            };
            var i = s(e("../base/publication.js")), r = s(e("../base/mediaformat.js")), o = s(e("../base/codec.js")),
                a = s(e("./subscription.js"));

            function s(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function c(e, t) {
                return e - t
            }

            function u(e, t) {
                return e.width !== t.width ? e.width - t.width : e.height - t.height
            }
        }, {"../base/codec.js": 2, "../base/mediaformat.js": 6, "../base/publication.js": 8, "./subscription.js": 21}],
        21: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Subscription = n.SubscriptionUpdateOptions = n.VideoSubscriptionUpdateOptions = n.SubscribeOptions = n.VideoSubscriptionConstraints = n.AudioSubscriptionConstraints = n.SubscriptionCapabilities = n.VideoSubscriptionCapabilities = n.AudioSubscriptionCapabilities = void 0;
            r(e("../base/mediaformat.js")), r(e("../base/codec.js"));
            var i = e("../base/event.js");

            function r(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function o(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            n.AudioSubscriptionCapabilities = function e(t) {
                o(this, e), this.codecs = t
            }, n.VideoSubscriptionCapabilities = function e(t, n, i, r, a) {
                o(this, e), this.codecs = t, this.resolutions = n, this.frameRates = i, this.bitrateMultipliers = r, this.keyFrameIntervals = a
            }, n.SubscriptionCapabilities = function e(t, n) {
                o(this, e), this.audio = t, this.video = n
            }, n.AudioSubscriptionConstraints = function e(t) {
                o(this, e), this.codecs = t
            }, n.VideoSubscriptionConstraints = function e(t, n, i, r, a) {
                o(this, e), this.codecs = t, this.resolution = n, this.frameRate = i, this.bitrateMultiplier = r, this.keyFrameInterval = a
            }, n.SubscribeOptions = function e(t, n) {
                o(this, e), this.audio = t, this.video = n
            }, n.VideoSubscriptionUpdateOptions = function e() {
                o(this, e), this.resolution = void 0, this.frameRate = void 0, this.bitrateMultipliers = void 0, this.keyFrameInterval = void 0
            }, n.SubscriptionUpdateOptions = function e() {
                o(this, e), this.video = void 0
            }, n.Subscription = function (e) {
                function t(e, n, i, r, a, s) {
                    o(this, t);
                    var c = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (!e) throw new TypeError("ID cannot be null or undefined.");
                    return Object.defineProperty(c, "id", {
                        configurable: !1,
                        writable: !1,
                        value: e
                    }), c.stop = n, c.getStats = i, c.mute = r, c.unmute = a, c.applyOptions = s, c
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, i.EventDispatcher), t
            }()
        }, {"../base/codec.js": 2, "../base/event.js": 3, "../base/mediaformat.js": 6}],
        22: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Conference = n.P2P = n.Base = void 0;
            var i = a(e("./base/export.js")), r = a(e("./p2p/export.js")), o = a(e("./conference/export.js"));

            function a(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            n.Base = i, n.P2P = r, n.Conference = o
        }, {"./base/export.js": 4, "./conference/export.js": 15, "./p2p/export.js": 24}],
        23: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.getErrorByCode = function (e) {
                return {
                    2100: i.P2P_CONN_SERVER_UNKNOWN,
                    2101: i.P2P_CONN_SERVER_UNAVAILABLE,
                    2102: i.P2P_CONN_SERVER_BUSY,
                    2103: i.P2P_CONN_SERVER_NOT_SUPPORTED,
                    2110: i.P2P_CONN_CLIENT_UNKNOWN,
                    2111: i.P2P_CONN_CLIENT_NOT_INITIALIZED,
                    2120: i.P2P_CONN_AUTH_UNKNOWN,
                    2121: i.P2P_CONN_AUTH_FAILED,
                    2201: i.P2P_MESSAGING_TARGET_UNREACHABLE,
                    2400: i.P2P_CLIENT_UNKNOWN,
                    2401: i.P2P_CLIENT_UNSUPPORTED_METHOD,
                    2402: i.P2P_CLIENT_ILLEGAL_ARGUMENT,
                    2403: i.P2P_CLIENT_INVALID_STATE,
                    2404: i.P2P_CLIENT_NOT_ALLOWED,
                    2500: i.P2P_WEBRTC_UNKNOWN,
                    2501: i.P2P_WEBRTC_SDP
                }[e]
            };
            var i = n.errors = {
                P2P_CONN_SERVER_UNKNOWN: {code: 2100, message: "Server unknown error."},
                P2P_CONN_SERVER_UNAVAILABLE: {code: 2101, message: "Server is unavaliable."},
                P2P_CONN_SERVER_BUSY: {code: 2102, message: "Server is too busy."},
                P2P_CONN_SERVER_NOT_SUPPORTED: {code: 2103, message: "Method has not been supported by server."},
                P2P_CONN_CLIENT_UNKNOWN: {code: 2110, message: "Client unknown error."},
                P2P_CONN_CLIENT_NOT_INITIALIZED: {code: 2111, message: "Connection is not initialized."},
                P2P_CONN_AUTH_UNKNOWN: {code: 2120, message: "Authentication unknown error."},
                P2P_CONN_AUTH_FAILED: {code: 2121, message: "Wrong username or token."},
                P2P_MESSAGING_TARGET_UNREACHABLE: {code: 2201, message: "Remote user cannot be reached."},
                P2P_CLIENT_DENIED: {code: 2202, message: "User is denied."},
                P2P_CLIENT_UNKNOWN: {code: 2400, message: "Unknown errors."},
                P2P_CLIENT_UNSUPPORTED_METHOD: {code: 2401, message: "This method is unsupported in current browser."},
                P2P_CLIENT_ILLEGAL_ARGUMENT: {code: 2402, message: "Illegal argument."},
                P2P_CLIENT_INVALID_STATE: {code: 2403, message: "Invalid peer state."},
                P2P_CLIENT_NOT_ALLOWED: {code: 2404, message: "Remote user is not allowed."},
                P2P_WEBRTC_UNKNOWN: {code: 2500, message: "WebRTC error."},
                P2P_WEBRTC_SDP: {code: 2502, message: "SDP error."}
            };
            n.P2PError = function (e) {
                function t(e, n) {
                    !function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var i = function (e, t) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !t || "object" != typeof t && "function" != typeof t ? e : t
                    }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, n));
                    return i.code = "number" == typeof e ? e : e.code, i
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(t, Error), t
            }()
        }, {}],
        24: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var i = e("./p2pclient.js");
            Object.defineProperty(n, "P2PClient", {
                enumerable: !0, get: function () {
                    return (e = i, e && e.__esModule ? e : {default: e}).default;
                    var e
                }
            });
            var r = e("./error.js");
            Object.defineProperty(n, "P2PError", {
                enumerable: !0, get: function () {
                    return r.P2PError
                }
            })
        }, {"./error.js": 23, "./p2pclient.js": 25}],
        25: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var i = u(e("../base/logger.js")), r = e("../base/event.js"), o = c(e("../base/utils.js")),
                a = c(e("./error.js")), s = u(e("./peerconnection-channel.js"));
            c(e("../base/stream.js"));

            function c(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function u(e) {
                return e && e.__esModule ? e : {default: e}
            }

            var d = 1, l = 2, f = 3;
            o.sysInfo(), navigator.mozGetUserMedia, navigator.mozGetUserMedia;
            n.default = function (e, t) {
                Object.setPrototypeOf(this, new r.EventDispatcher);
                var n = e, o = t, c = new Map, u = this, p = d, h = void 0;
                o.onMessage = function (e, t) {
                    i.default.debug("Received signaling message from " + e + ": " + t);
                    var n = JSON.parse(t);
                    "chat-closed" !== n.type ? u.allowedRemoteIds.indexOf(e) >= 0 ? m(e).onMessage(n) : v(e, "chat-closed", a.errors.P2P_CLIENT_DENIED) : c.has(e) && (m(e).onMessage(n), c.delete(e))
                }, o.onServerDisconnected = function () {
                    p = d, u.dispatchEvent(new r.IcsEvent("serverdisconnected"))
                }, this.allowedRemoteIds = [], this.connect = function (e) {
                    return p !== d ? (i.default.warning("Invalid connection state: " + p), Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_INVALID_STATE))) : (p = l, new Promise(function (t, n) {
                        o.connect(e).then(function (e) {
                            p = f, t(h = e)
                        }, function (e) {
                            n(new a.P2PError(a.getErrorByCode(e)))
                        })
                    }))
                }, this.disconnect = function () {
                    p != d && (c.forEach(function (e) {
                        e.stop()
                    }), c.clear(), o.disconnect())
                }, this.publish = function (e, t) {
                    return p !== f ? Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_INVALID_STATE, "P2P Client is not connected to signaling channel.")) : this.allowedRemoteIds.indexOf(e) < 0 ? Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_NOT_ALLOWED)) : Promise.resolve(m(e).publish(t))
                }, this.send = function (e, t) {
                    return p !== f ? Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_INVALID_STATE, "P2P Client is not connected to signaling channel.")) : this.allowedRemoteIds.indexOf(e) < 0 ? Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_NOT_ALLOWED)) : Promise.resolve(m(e).send(t))
                }, this.stop = function (e) {
                    c.has(e) ? (c.get(e).stop(), c.delete(e)) : i.default.warning("No PeerConnection between current endpoint and specific remote endpoint.")
                }, this.getStats = function (e) {
                    return c.has(e) ? c.get(e).getStats() : Promise.reject(new a.P2PError(a.errors.P2P_CLIENT_INVALID_STATE, "No PeerConnection between current endpoint and specific remote endpoint."))
                };
                var v = function (e, t, n) {
                    var i = {type: t};
                    return n && (i.data = n), o.send(e, JSON.stringify(i)).catch(function (e) {
                        if ("number" == typeof e) throw a.getErrorByCode(e)
                    })
                }, m = function (e) {
                    if (!c.has(e)) {
                        var t = Object.create(r.EventDispatcher);
                        t.sendSignalingMessage = v;
                        var i = new s.default(n, h, e, t);
                        i.addEventListener("streamadded", function (e) {
                            u.dispatchEvent(e)
                        }), i.addEventListener("messagereceived", function (e) {
                            u.dispatchEvent(e)
                        }), i.addEventListener("ended", function () {
                            c.delete(e)
                        }), c.set(e, i)
                    }
                    return c.get(e)
                }
            }
        }, {
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./error.js": 23,
            "./peerconnection-channel.js": 26
        }],
        26: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.P2PPeerConnectionChannelEvent = void 0;
            var i, r = function () {
                    return function (e, t) {
                        if (Array.isArray(e)) return e;
                        if (Symbol.iterator in Object(e)) return function (e, t) {
                            var n = [], i = !0, r = !1, o = void 0;
                            try {
                                for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done) && (n.push(a.value), !t || n.length !== t); i = !0) ;
                            } catch (e) {
                                r = !0, o = e
                            } finally {
                                try {
                                    !i && s.return && s.return()
                                } finally {
                                    if (r) throw o
                                }
                            }
                            return n
                        }(e, t);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }
                }(), o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, a = function () {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var i = t[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                        }
                    }

                    return function (t, n, i) {
                        return n && e(t.prototype, n), i && e(t, i), t
                    }
                }(), s = e("../base/logger.js"), c = (i = s) && i.__esModule ? i : {default: i}, u = e("../base/event.js"),
                d = e("../base/publication.js"), l = v(e("../base/utils.js")), f = v(e("./error.js")),
                p = v(e("../base/stream.js")), h = v(e("../base/sdputils.js"));

            function v(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            }

            function m(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function _(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function g(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            n.P2PPeerConnectionChannelEvent = function (e) {
                function t(e) {
                    m(this, t);
                    var n = _(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.stream = e.stream, n
                }

                return g(t, Event), t
            }();
            var b = "message", y = "chat-closed", S = "chat-negotiation-needed", P = "chat-track-sources",
                w = "chat-stream-info", E = "chat-signal", j = "chat-tracks-added", C = "chat-tracks-removed",
                O = "chat-data-received", I = "chat-ua", T = {offerToReceiveAudio: !0, offerToReceiveVideo: !0},
                k = l.sysInfo(), M = function (e) {
                    function t(e, n, i, r) {
                        m(this, t);
                        var o = _(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                        return o._config = e, o._localId = n, o._remoteId = i, o._signaling = r, o._pc = null, o._publishedStreams = new Map, o._pendingStreams = [], o._publishingStreams = [], o._pendingUnpublishStreams = [], o._remoteStreams = [], o._remoteTrackSourceInfo = new Map, o._remoteStreamSourceInfo = new Map, o._remoteStreamAttributes = new Map, o._remoteStreamOriginalTrackIds = new Map, o._publishPromises = new Map, o._unpublishPromises = new Map, o._publishingStreamTracks = new Map, o._publishedStreamTracks = new Map, o._remoteStreamTracks = new Map, o._isNegotiationNeeded = !1, o._negotiating = !1, o._remoteSideSupportsRemoveStream = !0, o._remoteSideSupportsPlanB = !0, o._remoteSideSupportsUnifiedPlan = !0, o._remoteIceCandidates = [], o._dataChannels = new Map, o._pendingMessages = [], o._dataSeq = 1, o._sendDataPromises = new Map, o._addedTrackIds = [], o._isCaller = !0, o._infoSent = !1, o._disposed = !1, o._createPeerConnection(), o
                    }

                    return g(t, u.EventDispatcher), a(t, [{
                        key: "publish", value: function (e) {
                            var t = this;
                            return e instanceof p.LocalStream ? this._publishedStreams.has(e) ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, "Duplicated stream.")) : this._areAllTracksEnded(e.mediaStream) ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE, "All tracks are ended.")) : Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(e)]).then(function () {
                                return new Promise(function (n, i) {
                                    t._pc.addStream(e.mediaStream), t._publishingStreams.push(e);
                                    var r = Array.from(e.mediaStream.getTracks(), function (e) {
                                        return e.id
                                    });
                                    t._publishingStreamTracks.set(e.mediaStream.id, r), t._publishPromises.set(e.mediaStream.id, {
                                        resolve: n,
                                        reject: i
                                    }), t._dataChannels.has(b) || t._createDataChannel(b)
                                })
                            }) : Promise.reject(new TypeError("Invalid stream."))
                        }
                    }, {
                        key: "send", value: function (e) {
                            var t = this;
                            if ("string" != typeof e) return Promise.reject(new TypeError("Invalid message."));
                            var n = {id: this._dataSeq++, data: e}, i = new Promise(function (e, i) {
                                t._sendDataPromises.set(n.id, {resolve: e, reject: i})
                            });
                            return this._dataChannels.has(b) || this._createDataChannel(b), this._sendClosedMsgIfNecessary().catch(function (e) {
                                c.default.debug("Failed to send closed message." + e.message)
                            }), this._sendSysInfoIfNecessary().catch(function (e) {
                                c.default.debug("Failed to send sysInfo." + e.message)
                            }), "open" === this._dataChannels.get(b).readyState ? this._dataChannels.get(b).send(JSON.stringify(n)) : this._pendingMessages.push(n), i
                        }
                    }, {
                        key: "stop", value: function () {
                            this._stop(void 0, !0)
                        }
                    }, {
                        key: "getStats", value: function (e) {
                            var t = this;
                            if (this._pc) {
                                if (void 0 === e) return this._pc.getStats();
                                var n = [];
                                return Promise.all([e.getTracks().forEach(function (e) {
                                    t._getStats(e, n)
                                })]).then(function () {
                                    return new Promise(function (e, t) {
                                        e(n)
                                    })
                                })
                            }
                            return Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE))
                        }
                    }, {
                        key: "_getStats", value: function (e, t) {
                            return this._pc.getStats(e).then(function (e) {
                                t.push(e)
                            })
                        }
                    }, {
                        key: "onMessage", value: function (e) {
                            this._SignalingMesssageHandler(e)
                        }
                    }, {
                        key: "_sendSdp", value: function (e) {
                            return this._signaling.sendSignalingMessage(this._remoteId, E, e)
                        }
                    }, {
                        key: "_sendSignalingMessage", value: function (e, t) {
                            return this._signaling.sendSignalingMessage(this._remoteId, e, t)
                        }
                    }, {
                        key: "_SignalingMesssageHandler", value: function (e) {
                            switch (c.default.debug("Channel received message: " + e), e.type) {
                                case I:
                                    this._handleRemoteCapability(e.data), this._sendSysInfoIfNecessary();
                                    break;
                                case P:
                                    this._trackSourcesHandler(e.data);
                                    break;
                                case w:
                                    this._streamInfoHandler(e.data);
                                    break;
                                case E:
                                    this._sdpHandler(e.data);
                                    break;
                                case j:
                                    this._tracksAddedHandler(e.data);
                                    break;
                                case C:
                                    this._tracksRemovedHandler(e.data);
                                    break;
                                case O:
                                    this._dataReceivedHandler(e.data);
                                    break;
                                case y:
                                    this._chatClosedHandler(e.data);
                                    break;
                                case S:
                                    this._doNegotiate();
                                    break;
                                default:
                                    c.default.error("Invalid signaling message received. Type: " + e.type)
                            }
                        }
                    }, {
                        key: "_tracksAddedHandler", value: function (e) {
                            var t = this, n = function (e) {
                                t._publishingStreamTracks.forEach(function (n, i) {
                                    for (var r = 0; r < n.length; r++) {
                                        if (n[r] === e && (t._publishedStreamTracks.has(i) || t._publishedStreamTracks.set(i, []), t._publishedStreamTracks.get(i).push(n[r]), n.splice(r, 1)), 0 == n.length) if ("continue" === function () {
                                            if (!t._publishPromises.has(i)) return c.default.warning("Cannot find the promise for publishing " + i), "continue";
                                            var n = t._publishingStreams.findIndex(function (e) {
                                                return e.mediaStream.id == i
                                            }), r = t._publishingStreams[n];
                                            t._publishingStreams.splice(n, 1);
                                            var o = new d.Publication(e, function () {
                                                t._unpublish(r).then(function () {
                                                    o.dispatchEvent(new u.IcsEvent("ended"))
                                                }, function (e) {
                                                    c.default.debug("Something wrong happened during stopping a publication. " + e.message)
                                                })
                                            }, function () {
                                                return r && r.mediaStream ? t.getStats(r.mediaStream) : Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE, "Publication is not available."))
                                            });
                                            t._publishedStreams.set(r, o), t._publishPromises.get(i).resolve(o), t._publishPromises.delete(i)
                                        }()) continue
                                    }
                                })
                            }, i = !0, r = !1, o = void 0;
                            try {
                                for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done); i = !0) {
                                    n(a.value)
                                }
                            } catch (e) {
                                r = !0, o = e
                            } finally {
                                try {
                                    !i && s.return && s.return()
                                } finally {
                                    if (r) throw o
                                }
                            }
                        }
                    }, {
                        key: "_tracksRemovedHandler", value: function (e) {
                            var t = this, n = function (e) {
                                t._publishedStreamTracks.forEach(function (t, n) {
                                    for (var i = 0; i < t.length; i++) t[i] === e && t.splice(i, 1)
                                })
                            }, i = !0, r = !1, o = void 0;
                            try {
                                for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done); i = !0) {
                                    n(a.value)
                                }
                            } catch (e) {
                                r = !0, o = e
                            } finally {
                                try {
                                    !i && s.return && s.return()
                                } finally {
                                    if (r) throw o
                                }
                            }
                        }
                    }, {
                        key: "_dataReceivedHandler", value: function (e) {
                            this._sendDataPromises.has(e) ? this._sendDataPromises.get(e).resolve() : c.default.warning("Received unknown data received message. ID: " + e)
                        }
                    }, {
                        key: "_sdpHandler", value: function (e) {
                            "offer" === e.type ? this._onOffer(e) : "answer" === e.type ? this._onAnswer(e) : "candidates" === e.type && this._onRemoteIceCandidate(e)
                        }
                    }, {
                        key: "_trackSourcesHandler", value: function (e) {
                            var t = !0, n = !1, i = void 0;
                            try {
                                for (var r, o = e[Symbol.iterator](); !(t = (r = o.next()).done); t = !0) {
                                    var a = r.value;
                                    this._remoteTrackSourceInfo.set(a.id, a.source)
                                }
                            } catch (e) {
                                n = !0, i = e
                            } finally {
                                try {
                                    !t && o.return && o.return()
                                } finally {
                                    if (n) throw i
                                }
                            }
                        }
                    }, {
                        key: "_streamInfoHandler", value: function (e) {
                            e ? (this._remoteStreamSourceInfo.set(e.id, e.source), this._remoteStreamAttributes.set(e.id, e.attributes), this._remoteStreamOriginalTrackIds.set(e.id, e.tracks)) : c.default.warning("Unexpected stream info.")
                        }
                    }, {
                        key: "_chatClosedHandler", value: function (e) {
                            this._disposed = !0, this._stop(e, !1)
                        }
                    }, {
                        key: "_onOffer", value: function (e) {
                            var t = this;
                            c.default.debug("About to set remote description. Signaling state: " + this._pc.signalingState), e.sdp = this._setRtpSenderOptions(e.sdp, this._config), l.isFirefox() && (e.sdp = this._setCodecOrder(e.sdp));
                            var n = new RTCSessionDescription(e);
                            this._pc.setRemoteDescription(n).then(function () {
                                t._createAndSendAnswer()
                            }, function (e) {
                                c.default.debug("Set remote description failed. Message: " + e.message), t._stop(e, !0)
                            })
                        }
                    }, {
                        key: "_onAnswer", value: function (e) {
                            var t = this;
                            c.default.debug("About to set remote description. Signaling state: " + this._pc.signalingState), e.sdp = this._setRtpSenderOptions(e.sdp, this._config);
                            var n = new RTCSessionDescription(e);
                            this._pc.setRemoteDescription(new RTCSessionDescription(n)).then(function () {
                                c.default.debug("Set remote descripiton successfully."), t._drainPendingMessages()
                            }, function (e) {
                                c.default.debug("Set remote description failed. Message: " + e.message), t._stop(e, !0)
                            })
                        }
                    }, {
                        key: "_onLocalIceCandidate", value: function (e) {
                            e.candidate ? this._sendSdp({
                                type: "candidates",
                                candidate: e.candidate.candidate,
                                sdpMid: e.candidate.sdpMid,
                                sdpMLineIndex: e.candidate.sdpMLineIndex
                            }).catch(function (e) {
                                c.default.warning("Failed to send candidate.")
                            }) : c.default.debug("Empty candidate.")
                        }
                    }, {
                        key: "_onRemoteTrackAdded", value: function (e) {
                            c.default.debug("Remote track added.")
                        }
                    }, {
                        key: "_onRemoteStreamAdded", value: function (e) {
                            var t = this;
                            c.default.debug("Remote stream added."), this._remoteStreamTracks.set(e.stream.id, []);
                            var n = [];
                            e.stream.getTracks().forEach(function (i) {
                                n.push(i.id), t._remoteStreamTracks.get(e.stream.id).push(i.id)
                            }), n = n.concat(this._remoteStreamOriginalTrackIds.get(e.stream.id)), "connected" === this._pc.iceConnectionState || "completed" === this._pc.iceConnectionState ? this._sendSignalingMessage(j, n) : this._addedTrackIds = this._addedTrackIds.concat(n);
                            var i = void 0, r = void 0;
                            l.isSafari() || l.isFirefox() ? (this._remoteStreamSourceInfo.has(e.stream.id) || c.default.warning("Cannot find source info for stream " + e.stream.id), i = this._remoteStreamSourceInfo.get(e.stream.id).audio, r = this._remoteStreamSourceInfo.get(e.stream.id).video, this._remoteStreamSourceInfo.delete(e.stream.id)) : (i = this._getAndDeleteTrackSourceInfo(e.stream.getAudioTracks()), r = this._getAndDeleteTrackSourceInfo(e.stream.getVideoTracks()));
                            var o = new p.StreamSourceInfo(i, r);
                            l.isSafari() && (o.audio || e.stream.getAudioTracks().forEach(function (t) {
                                e.stream.removeTrack(t)
                            }), o.video || e.stream.getVideoTracks().forEach(function (t) {
                                e.stream.removeTrack(t)
                            }));
                            var a = this._remoteStreamAttributes.get(e.stream.id),
                                s = new p.RemoteStream(void 0, this._remoteId, e.stream, o, a);
                            if (s) {
                                this._remoteStreams.push(s);
                                var u = new p.StreamEvent("streamadded", {stream: s});
                                this.dispatchEvent(u)
                            }
                        }
                    }, {
                        key: "_onRemoteStreamRemoved", value: function (e) {
                            if (c.default.debug("Remote stream removed."), this._remoteStreamTracks.has(e.stream.id)) {
                                var t = [];
                                this._remoteStreamTracks.get(e.stream.id).forEach(function (e) {
                                    t.push(e)
                                }), this._sendSignalingMessage(C, t), this._remoteStreamTracks.delete(e.stream.id);
                                var n = this._remoteStreams.findIndex(function (t) {
                                    return t.mediaStream.id === e.stream.id
                                });
                                if (-1 !== n) {
                                    var i = this._remoteStreams[n], r = new u.IcsEvent("ended");
                                    i.dispatchEvent(r), this._remoteStreams.splice(n, 1)
                                }
                            } else c.default.warning("Cannot find stream info when it is being removed.")
                        }
                    }, {
                        key: "_onNegotiationneeded", value: function () {
                            c.default.debug("On negotiation needed."), "stable" === this._pc.signalingState && !1 === this._negotiating ? (this._negotiating = !0, this._doNegotiate(), this._isNegotiationNeeded = !1) : this._isNegotiationNeeded = !0
                        }
                    }, {
                        key: "_onRemoteIceCandidate", value: function (e) {
                            var t = new RTCIceCandidate({
                                candidate: e.candidate,
                                sdpMid: e.sdpMid,
                                sdpMLineIndex: e.sdpMLineIndex
                            });
                            this._pc.remoteDescription && "" !== this._pc.remoteDescription.sdp ? (c.default.debug("Add remote ice candidates."), this._pc.addIceCandidate(t).catch(function (e) {
                                c.default.warning("Error processing ICE candidate: " + e)
                            })) : (c.default.debug("Cache remote ice candidates."), this._remoteIceCandidates.push(t))
                        }
                    }, {
                        key: "_onSignalingStateChange", value: function (e) {
                            c.default.debug("Signaling state changed: " + this._pc.signalingState), "closed" === this._pc.signalingState || ("stable" === this._pc.signalingState ? (this._negotiating = !1, this._isNegotiationNeeded ? this._onNegotiationneeded() : (this._drainPendingStreams(), this._drainPendingMessages())) : "have-remote-offer" === this._pc.signalingState && this._drainPendingRemoteIceCandidates())
                        }
                    }, {
                        key: "_onIceConnectionStateChange", value: function (e) {
                            if ("closed" === e.currentTarget.iceConnectionState || "failed" === e.currentTarget.iceConnectionState) {
                                var t = new f.P2PError(f.errors.P2P_WEBRTC_UNKNOWN, "ICE connection failed or closed.");
                                this._stop(t, !0)
                            } else "connected" !== e.currentTarget.iceConnectionState && "completed" !== e.currentTarget.iceConnectionState || (this._sendSignalingMessage(j, this._addedTrackIds), this._addedTrackIds = [])
                        }
                    }, {
                        key: "_onDataChannelMessage", value: function (e) {
                            var t = JSON.parse(e.data);
                            c.default.debug("Data channel message received: " + t.data), this._sendSignalingMessage(O, t.id);
                            var n = new u.MessageEvent("messagereceived", {message: t.data, origin: this._remoteId});
                            this.dispatchEvent(n)
                        }
                    }, {
                        key: "_onDataChannelOpen", value: function (e) {
                            c.default.debug("Data Channel is opened."), e.target.label === b && (c.default.debug("Data channel for messages is opened."), this._drainPendingMessages())
                        }
                    }, {
                        key: "_onDataChannelClose", value: function (e) {
                            c.default.debug("Data Channel is closed.")
                        }
                    }, {
                        key: "_createPeerConnection", value: function () {
                            var e = this, t = this._config.rtcConfiguration || {};
                            l.isChrome() && (t.sdpSemantics = "plan-b"), this._pc = new RTCPeerConnection(t), "function" == typeof this._pc.addTransceiver && l.isSafari() && (this._pc.addTransceiver("audio"), this._pc.addTransceiver("video")), this._pc.onaddstream = function (t) {
                                e._onRemoteStreamAdded.apply(e, [t])
                            }, this._pc.ontrack = function (t) {
                                e._onRemoteTrackAdded.apply(e, [t])
                            }, this._pc.onremovestream = function (t) {
                                e._onRemoteStreamRemoved.apply(e, [t])
                            }, this._pc.onnegotiationneeded = function (t) {
                                e._onNegotiationneeded.apply(e, [t])
                            }, this._pc.onicecandidate = function (t) {
                                e._onLocalIceCandidate.apply(e, [t])
                            }, this._pc.onsignalingstatechange = function (t) {
                                e._onSignalingStateChange.apply(e, [t])
                            }, this._pc.ondatachannel = function (t) {
                                c.default.debug("On data channel."), e._dataChannels.has(t.channel.label) || (e._dataChannels.set(t.channel.label, t.channel), c.default.debug("Save remote created data channel.")), e._bindEventsToDataChannel(t.channel)
                            }, this._pc.oniceconnectionstatechange = function (t) {
                                e._onIceConnectionStateChange.apply(e, [t])
                            }
                        }
                    }, {
                        key: "_drainPendingStreams", value: function () {
                            if (c.default.debug("Draining pending streams."), this._pc && "stable" === this._pc.signalingState) {
                                c.default.debug("Peer connection is ready for draining pending streams.");
                                for (var e = 0; e < this._pendingStreams.length; e++) {
                                    var t = this._pendingStreams[e];
                                    this._pendingStreams.shift(), t.mediaStream && (this._pc.addStream(t.mediaStream), c.default.debug("Added stream to peer connection."), this._publishingStreams.push(t))
                                }
                                this._pendingStreams.length = 0;
                                for (var n = 0; n < this._pendingUnpublishStreams.length; n++) this._pendingUnpublishStreams[n].mediaStream && (this._pc.removeStream(this._pendingUnpublishStreams[n].mediaStream), this._unpublishPromises.get(this._pendingUnpublishStreams[n].mediaStream.id).resolve(), this._publishedStreams.delete(this._pendingUnpublishStreams[n]), c.default.debug("Remove stream."));
                                this._pendingUnpublishStreams.length = 0
                            }
                        }
                    }, {
                        key: "_drainPendingRemoteIceCandidates", value: function () {
                            for (var e = 0; e < this._remoteIceCandidates.length; e++) c.default.debug("Add candidate"), this._pc.addIceCandidate(this._remoteIceCandidates[e]).catch(function (e) {
                                c.default.warning("Error processing ICE candidate: " + e)
                            });
                            this._remoteIceCandidates.length = 0
                        }
                    }, {
                        key: "_drainPendingMessages", value: function () {
                            if (c.default.debug("Draining pending messages."), 0 != this._pendingMessages.length) {
                                var e = this._dataChannels.get(b);
                                if (e && "open" === e.readyState) {
                                    for (var t = 0; t < this._pendingMessages.length; t++) c.default.debug("Sending message via data channel: " + this._pendingMessages[t]), e.send(JSON.stringify(this._pendingMessages[t]));
                                    this._pendingMessages.length = 0
                                } else this._pc && !e && this._createDataChannel(b)
                            }
                        }
                    }, {
                        key: "_sendStreamInfo", value: function (e) {
                            if (!e || !e.mediaStream) return new f.P2PError(f.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
                            var t = [];
                            return e.mediaStream.getTracks().map(function (n) {
                                t.push({id: n.id, source: e.source[n.kind]})
                            }), Promise.all([this._sendSignalingMessage(P, t), this._sendSignalingMessage(w, {
                                id: e.mediaStream.id,
                                attributes: e.attributes,
                                tracks: Array.from(t, function (e) {
                                    return e.id
                                }),
                                source: e.source
                            })])
                        }
                    }, {
                        key: "_sendSysInfoIfNecessary", value: function () {
                            return this._infoSent ? Promise.resolve() : (this._infoSent = !0, this._sendSignalingMessage(I, k))
                        }
                    }, {
                        key: "_sendClosedMsgIfNecessary", value: function () {
                            return null === this._pc.remoteDescription || "" === this._pc.remoteDescription.sdp ? this._sendSignalingMessage(y) : Promise.resolve()
                        }
                    }, {
                        key: "_handleRemoteCapability", value: function (e) {
                            e.sdk && e.sdk && "JavaScript" === e.sdk.type && e.runtime && "Firefox" === e.runtime.name ? (this._remoteSideSupportsRemoveStream = !1, this._remoteSideSupportsPlanB = !1, this._remoteSideSupportsUnifiedPlan = !0) : (this._remoteSideSupportsRemoveStream = !0, this._remoteSideSupportsPlanB = !0, this._remoteSideSupportsUnifiedPlan = !1)
                        }
                    }, {
                        key: "_doNegotiate", value: function () {
                            this._isCaller ? this._createAndSendOffer() : this._sendSignalingMessage(S)
                        }
                    }, {
                        key: "_setCodecOrder", value: function (e) {
                            if (this._config.audioEncodings) {
                                var t = Array.from(this._config.audioEncodings, function (e) {
                                    return e.codec.name
                                });
                                e = h.reorderCodecs(e, "audio", t)
                            }
                            if (this._config.videoEncodings) {
                                var n = Array.from(this._config.videoEncodings, function (e) {
                                    return e.codec.name
                                });
                                e = h.reorderCodecs(e, "video", n)
                            }
                            return e
                        }
                    }, {
                        key: "_setMaxBitrate", value: function (e, t) {
                            return "object" === o(t.audioEncodings) && (e = h.setMaxBitrate(e, t.audioEncodings)), "object" === o(t.videoEncodings) && (e = h.setMaxBitrate(e, t.videoEncodings)), e
                        }
                    }, {
                        key: "_setRtpSenderOptions", value: function (e, t) {
                            return e = this._setMaxBitrate(e, t)
                        }
                    }, {
                        key: "_setRtpReceiverOptions", value: function (e) {
                            return e = this._setCodecOrder(e)
                        }
                    }, {
                        key: "_createAndSendOffer", value: function () {
                            var e = this;
                            if (this._pc) {
                                this._isNegotiationNeeded = !1, this._isCaller = !0;
                                var t = void 0;
                                this._pc.createOffer(T).then(function (n) {
                                    return n.sdp = e._setRtpReceiverOptions(n.sdp), t = n, e._pc.setLocalDescription(n)
                                }).then(function () {
                                    return e._sendSdp(t)
                                }).catch(function (t) {
                                    c.default.error(t.message + " Please check your codec settings.");
                                    var n = new f.P2PError(f.errors.P2P_WEBRTC_SDP, t.message);
                                    e._stop(n, !0)
                                })
                            } else c.default.error("Peer connection have not been created.")
                        }
                    }, {
                        key: "_createAndSendAnswer", value: function () {
                            var e = this;
                            this._drainPendingStreams(), this._isNegotiationNeeded = !1, this._isCaller = !1;
                            var t = void 0;
                            this._pc.createAnswer().then(function (n) {
                                return n.sdp = e._setRtpReceiverOptions(n.sdp), t = n, e._pc.setLocalDescription(n)
                            }).then(function () {
                                return e._sendSdp(t)
                            }).catch(function (t) {
                                c.default.error(t.message + " Please check your codec settings.");
                                var n = new f.P2PError(f.errors.P2P_WEBRTC_SDP, t.message);
                                e._stop(n, !0)
                            })
                        }
                    }, {
                        key: "_getAndDeleteTrackSourceInfo", value: function (e) {
                            if (e.length > 0) {
                                var t = e[0].id;
                                if (this._remoteTrackSourceInfo.has(t)) {
                                    var n = this._remoteTrackSourceInfo.get(t);
                                    return this._remoteTrackSourceInfo.delete(t), n
                                }
                                c.default.warning("Cannot find source info for " + t)
                            }
                        }
                    }, {
                        key: "_unpublish", value: function (e) {
                            var t = this;
                            return navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream ? (c.default.error("Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint."), Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_UNSUPPORTED_METHOD))) : this._publishedStreams.has(e) ? (this._pendingUnpublishStreams.push(e), new Promise(function (n, i) {
                                t._unpublishPromises.set(e.mediaStream.id, {
                                    resolve: n,
                                    reject: i
                                }), t._drainPendingStreams()
                            })) : Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_ILLEGAL_ARGUMENT))
                        }
                    }, {
                        key: "_createDataChannel", value: function (e) {
                            if (this._dataChannels.has(e)) c.default.warning("Data channel labeled " + e + " already exists."); else if (this._pc) {
                                c.default.debug("Create data channel.");
                                var t = this._pc.createDataChannel(e);
                                this._bindEventsToDataChannel(t), this._dataChannels.set(b, t)
                            } else c.default.debug("PeerConnection is not available before creating DataChannel.")
                        }
                    }, {
                        key: "_bindEventsToDataChannel", value: function (e) {
                            var t = this;
                            e.onmessage = function (e) {
                                t._onDataChannelMessage.apply(t, [e])
                            }, e.onopen = function (e) {
                                t._onDataChannelOpen.apply(t, [e])
                            }, e.onclose = function (e) {
                                t._onDataChannelClose.apply(t, [e])
                            }, e.onerror = function (e) {
                                c.default.debug("Data Channel Error:", error)
                            }
                        }
                    }, {
                        key: "_areAllTracksEnded", value: function (e) {
                            var t = !0, n = !1, i = void 0;
                            try {
                                for (var r, o = e.getTracks()[Symbol.iterator](); !(t = (r = o.next()).done); t = !0) {
                                    if ("live" === r.value.readyState) return !1
                                }
                            } catch (e) {
                                n = !0, i = e
                            } finally {
                                try {
                                    !t && o.return && o.return()
                                } finally {
                                    if (n) throw i
                                }
                            }
                            return !0
                        }
                    }, {
                        key: "_stop", value: function (e, t) {
                            var n = e;
                            n || (n = new f.P2PError(f.errors.P2P_CLIENT_UNKNOWN));
                            var i = !0, o = !1, a = void 0;
                            try {
                                for (var s, d = this._dataChannels[Symbol.iterator](); !(i = (s = d.next()).done); i = !0) {
                                    var l = s.value, p = r(l, 2);
                                    p[0];
                                    p[1].close()
                                }
                            } catch (e) {
                                o = !0, a = e
                            } finally {
                                try {
                                    !i && d.return && d.return()
                                } finally {
                                    if (o) throw a
                                }
                            }
                            this._dataChannels.clear(), this._pc && "closed" !== this._pc.iceConnectionState && this._pc.close();
                            var h = !0, v = !1, m = void 0;
                            try {
                                for (var _, g = this._publishPromises[Symbol.iterator](); !(h = (_ = g.next()).done); h = !0) {
                                    var b = _.value, S = r(b, 2);
                                    S[0];
                                    S[1].reject(n)
                                }
                            } catch (e) {
                                v = !0, m = e
                            } finally {
                                try {
                                    !h && g.return && g.return()
                                } finally {
                                    if (v) throw m
                                }
                            }
                            this._publishPromises.clear();
                            var P = !0, w = !1, E = void 0;
                            try {
                                for (var j, C = this._unpublishPromises[Symbol.iterator](); !(P = (j = C.next()).done); P = !0) {
                                    var O = j.value, I = r(O, 2);
                                    I[0];
                                    I[1].reject(n)
                                }
                            } catch (e) {
                                w = !0, E = e
                            } finally {
                                try {
                                    !P && C.return && C.return()
                                } finally {
                                    if (w) throw E
                                }
                            }
                            this._unpublishPromises.clear();
                            var T = !0, k = !1, M = void 0;
                            try {
                                for (var N, A = this._sendDataPromises[Symbol.iterator](); !(T = (N = A.next()).done); T = !0) {
                                    var x = N.value, R = r(x, 2);
                                    R[0];
                                    R[1].reject(n)
                                }
                            } catch (e) {
                                k = !0, M = e
                            } finally {
                                try {
                                    !T && A.return && A.return()
                                } finally {
                                    if (k) throw M
                                }
                            }
                            if (this._sendDataPromises.clear(), this._publishedStreams.forEach(function (e) {
                                e.dispatchEvent(new u.IcsEvent("ended"))
                            }), this._publishedStreams.clear(), this._remoteStreams.forEach(function (e) {
                                e.dispatchEvent(new u.IcsEvent("ended"))
                            }), this._remoteStreams = [], !this._disposed) {
                                if (t) {
                                    var L = void 0;
                                    e && ((L = JSON.parse(JSON.stringify(e))).message = "Error happened at remote side."), this._sendSignalingMessage(y, L).catch(function (e) {
                                        c.default.debug("Failed to send close." + e.message)
                                    })
                                }
                                this.dispatchEvent(new Event("ended"))
                            }
                        }
                    }]), t
                }();
            n.default = M
        }, {
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/publication.js": 8,
            "../base/sdputils.js": 9,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./error.js": 23
        }]
    }, {}, [22])(22)
});