"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, assert = require("assert"), logger = require("./logger").logger, makeRPC = require("./makeRPC").makeRPC,
    log = logger.getLogger("RoomController");

function isResolutionEqual(e, i) {
    return e.width && i.width && e.height && i.height && e.width === i.width && e.height === i.height
}

module.exports.create = function (e, i, o) {
    var r, t = {}, u = e.cluster, d = e.rpcReq, k = e.rpcClient, s = e.config, P = e.room, g = e.selfRpcId,
        R = s.transcoding && !!s.transcoding.audio, _ = s.transcoding && !!s.transcoding.video,
        p = s.internalConnProtocol, C = {}, I = {}, S = {}, c = ((r = {}).video = {
            encode: s.mediaOut.video.format.map(H),
            decode: s.mediaIn.video.map(H)
        }, s.mediaOut.video.format, s.views.forEach(function (e) {
            e.video.format && r.video.encode.push(H(e.video.format))
        }), r), l = function () {
            return Math.random().toPrecision(20).toString().substr(2, 20)
        }, f = function (e, i) {
            return e + "-pub-" + i
        }, O = function (e, i) {
            return e + "-sub-" + i
        }, b = function (e) {
            return C[e] ? P + "-" + e : null
        }, N = function (e) {
            var i = P + "-";
            if (0 != e.indexOf(i)) return null;
            var o = e.substr(i.length);
            return C[o] ? o : null
        }, m = function (i) {
            var e = s.views.filter(function (e) {
                return e.label === i
            });
            return 0 < e.length ? e[0] : {}
        }, v = function (e) {
            if (log.debug("enableAVCoordination"), C[e]) {
                var i = C[e].audio.mixer, o = C[e].video.mixer, r = m(e);
                i && o && r && r.audio && r.audio.vad && makeRPC(k, I[i].locality.node, "enableVAD", [1e3])
            }
        }, a = function (e) {
            if (log.debug("resetVAD", e), C[e]) {
                var i = C[e].audio.mixer, o = C[e].video.mixer, r = m(e);
                i && o && r && r.audio && r.audio.vad && makeRPC(k, I[i].locality.node, "resetVAD", [])
            }
        }, E = function (i, o, r, e, n, t) {
            if (log.debug("newTerminal:", i, "terminal_type:", o, "owner:", r), void 0 === I[i]) {
                var a = "vmixer" === o || "vxcoder" === o ? "video" : "amixer" === o || "axcoder" === o ? "audio" : "unknown";
                return (e ? Promise.resolve(e) : d.getWorkerNode(u, a, {room: P, task: i}, c)).then(function (e) {
                    I[i] = {owner: r, type: o, locality: e, published: [], subscribed: {}}, n()
                }, function (e) {
                    t(e.message ? e.message : e)
                })
            }
            n()
        }, A = function (i) {
            log.debug("deleteTerminal:", i), I[i] && ("amixer" !== I[i].type && "axcoder" !== I[i].type && "vmixer" !== I[i].type && "vxcoder" !== I[i].type || d.recycleWorkerNode(I[i].locality.agent, I[i].locality.node, {
                room: P,
                task: i
            }).catch(function (e) {
                log.warn("MediaNode not recycled for:", i)
            }), delete I[i])
        }, n = function (e) {
            return !(!I[e] || 0 !== I[e].published.length || 0 !== Object.keys(I[e].subscribed).length)
        }, y = function (e) {
            return I[e] && ("webrtc" === I[e].type || "streaming" === I[e].type || "recording" === I[e].type || "sip" === I[e].type)
        }, V = function (a, u, e, i, d) {
            if (log.debug("spreadStream, stream_id:", a, "target_node:", u, "target_node_type:", e), !S[a] || !I[S[a].owner]) return d("Cannot spread a non-existing stream");
            var r = S[a].owner, s = I[r].locality.node, n = !(!S[a].audio || "vmixer" === e || "vxcoder" === e),
                t = !(!S[a].video || "amixer" === e || "axcoder" === e), c = a + "@" + u;
            if (!n && !t) return d("Cannot spread stream without audio/video.");
            if (s === u) return log.debug("no need to spread"), i();
            var o = S[a].spread.findIndex(function (e) {
                return e.target === u
            });
            if (0 <= o) {
                if ("connected" === S[a].spread[o].status) return log.debug("spread already exists:", c), i();
                if ("connecting" === S[a].spread[o].status) return log.debug("spread is connecting:", c), void S[a].spread[o].waiting.push({
                    onOK: i,
                    onError: d
                });
                log.error("spread status is ambiguous:", c), d("spread status is ambiguous")
            }
            S[a].spread.push({target: u, status: "connecting", waiting: []});
            var l, f, b, m, v = {protocol: p};
            new Promise(function (e, i) {
                makeRPC(k, u, "createInternalConnection", [a, "in", v], e, i)
            }).then(function (e) {
                return f = e, new Promise(function (e, i) {
                    makeRPC(k, s, "createInternalConnection", [c, "out", v], e, i)
                })
            }).then(function (e) {
                return l = e, log.debug("spreadStream:", a, "from:", l, "to:", f), new Promise(function (e, i) {
                    if (I[r]) {
                        var o = I[r] ? I[r].owner : "common";
                        makeRPC(k, u, "publish", [a, "internal", {
                            controller: g,
                            publisher: o,
                            audio: !!n && {codec: S[a].audio.format},
                            video: !!t && {codec: S[a].video.format},
                            ip: l.ip,
                            port: l.port
                        }], e, i)
                    } else i("Terminal:", r, "not exist")
                })
            }).then(function () {
                return b = !0, new Promise(function (e, i) {
                    makeRPC(k, s, "subscribe", [c, "internal", {controller: g, ip: f.ip, port: f.port}], e, i)
                })
            }).then(function () {
                return m = !0, log.debug("internally publish/subscribe ok"), new Promise(function (e, i) {
                    makeRPC(k, s, "linkup", [c, n ? a : void 0, t ? a : void 0], e, i)
                })
            }).then(function () {
                if (S[a]) {
                    log.debug("internally linkup ok");
                    var e = S[a].spread.findIndex(function (e) {
                        return e.target === u
                    });
                    return 0 <= e ? (S[a].spread[e].status = "connected", process.nextTick(function () {
                        S[a].spread[e].waiting.forEach(function (e) {
                            e.onOK()
                        }), S[a].spread[e].waiting = []
                    }), i(), Promise.resolve("ok")) : Promise.reject("spread record missing")
                }
                return log.error("Stream early released"), Promise.reject("Stream early released")
            }).catch(function (e) {
                !function (i, e, o, r, n) {
                    log.error("spreadStream failed, stream_id:", a, "reason:", i);
                    var t = S[a] ? S[a].spread.findIndex(function (e) {
                        return e.target === u
                    }) : -1;
                    -1 < t && (S[a].spread[t].waiting.forEach(function (e) {
                        e.onError(i)
                    }), S[a].spread.splice(t, 1)), e && makeRPC(k, s, "unsubscribe", [c]), o && makeRPC(k, u, "unpublish", [a]), r && makeRPC(k, s, "destroyInternalConnection", [c, "out"]), n && makeRPC(k, u, "destroyInternalConnection", [a, "in"]), d(i)
                }(e.message ? e.message : e, m, b, !!l, !!f)
            })
        }, T = function (e, i) {
            if (log.debug("shrinkStream, stream_id:", e, "target_node:", i), S[e] && I[S[e].owner]) {
                var o = S[e].owner, r = I[o].locality.node, n = e + "@" + i;
                if (r !== i && !h(e, i)) {
                    var t = S[e].spread.findIndex(function (e) {
                        return e.target === i
                    });
                    -1 !== t && S[e].spread.splice(t, 1), makeRPC(k, r, "unsubscribe", [n]), makeRPC(k, i, "unpublish", [e])
                }
            }
        }, h = function (e, i) {
            var o = S[e] && S[e].audio && S[e].audio.subscribers || [],
                r = S[e] && S[e].video && S[e].video.subscribers || [], n = o.concat(r.filter(function (e) {
                    return o.indexOf(e) < 0
                }));
            for (var t in n) if (I[n[t]] && I[n[t]].locality.node === i) return !0;
            return !1
        }, x = function (e, i) {
            return C[e] && C[e][i] ? C[e][i].mixer : null
        }, w = function (e, i, o, r) {
            log.debug("to mix audio of stream:", e, "mixed view:", i);
            var n = x(i, "audio");
            if (S[e] && n && I[n]) {
                var t = I[n].locality.node, a = e + "@" + t;
                V(e, t, "amixer", function () {
                    I[n] && S[e] ? (I[n].subscribed[a] = {audio: e}, S[e].audio.subscribers.indexOf(n) < 0 && S[e].audio.subscribers.push(n), o(), "inactive" === S[e].audio.status && makeRPC(k, t, "setInputActive", [e, !1])) : (T(e, t), r("Audio mixer is early released."))
                }, r)
            } else log.error("Audio mixer is NOT ready."), r("Audio mixer is NOT ready.")
        }, F = function (e, i) {
            log.debug("to unmix audio of view:", i);
            var o = x(i, "audio");
            if (S[e] && S[e].audio && o && I[o]) {
                var r = I[o].locality.node, n = e + "@" + r, t = S[e].audio.subscribers.indexOf(o);
                delete I[o].subscribed[n], -1 < t && (S[e].audio.subscribers.splice(t, 1), T(e, r))
            }
        }, q = function (e, i, o, r) {
            log.debug("to mix video of stream:", e);
            var n = x(i, "video");
            if (S[e] && n && I[n]) {
                var t = I[n].locality.node, a = e + "@" + t;
                V(e, t, "vmixer", function () {
                    I[n] && S[e] ? (I[n].subscribed[a] = {video: e}, S[e].video.subscribers.indexOf(n) < 0 && S[e].video.subscribers.push(n), o(), "inactive" === S[e].video.status && makeRPC(k, t, "setInputActive", [e, !1])) : (T(e, t), r("Video mixer or input stream is early released."))
                }, r)
            } else log.error("Video mixer is NOT ready."), r("Video mixer is NOT ready.")
        }, J = function (e, i) {
            log.debug("to unmix video of stream:", e);
            var o = x(i, "video");
            if (S[e] && S[e].video && o && I[o]) {
                var r = I[o].locality.node, n = e + "@" + r, t = S[e].video.subscribers.indexOf(o);
                delete I[o].subscribed[n], -1 < t && (S[e].video.subscribers.splice(t, 1), T(e, r))
            }
        }, G = function (e, i) {
            log.debug("to unmix stream:", e), S[e] && S[e].audio && F(e, i), S[e] && S[e].video && J(e, i)
        }, M = function (e, i, o, r, n) {
            !function (e, i, o, r, n) {
                var t = x(e, "audio");
                if (t && I[t]) {
                    var a = I[t].locality.node, u = I[o] ? I[o].owner : "common";
                    log.debug("spawnMixedAudio, for subscriber:", o, "audio_format:", i), makeRPC(k, a, "generate", [u, i], function (e) {
                        log.debug("spawnMixedAudio ok, amixer_node:", a, "stream_id:", e), I[t] ? (void 0 === S[e] && (S[e] = {
                            owner: t,
                            audio: {format: i, subscribers: []},
                            video: void 0,
                            spread: []
                        }, I[t].published.push(e)), r(e)) : n("Amixer early released")
                    }, n)
                } else n("Audio mixer is not ready.")
            }(e, i, o, r, n)
        }, j = function (e, i, o, r, n, t, a, u) {
            var d = x(e, "video"), s = Object.keys(S).filter(function (e) {
                return S[e].owner === d && S[e].video && S[e].video.format === i && isResolutionEqual(S[e].video.resolution, o) && S[e].video.framerate === r && S[e].video.bitrate === n && S[e].video.kfi === t
            });
            0 < s.length ? a(s[0]) : function (e, i, o, r, n, t, a, u) {
                var d = x(e, "video");
                if (d && I[d]) {
                    var s = I[d].locality.node;
                    log.debug("spawnMixedVideo, view:", e, "format:", i, "resolution:", o, "framerate:", r, "bitrate:", n, "keyFrameInterval:", t), makeRPC(k, s, "generate", [i, o, r, n, t], function (e) {
                        log.debug("spawnMixedVideo ok, vmixer_node:", s, "stream:", e), I[d] ? (void 0 === S[e.id] && (S[e.id] = {
                            owner: d,
                            audio: void 0,
                            video: {
                                format: i,
                                resolution: e.resolution,
                                framerate: e.framerate,
                                bitrate: e.bitrate,
                                kfi: e.keyFrameInterval,
                                subscribers: []
                            },
                            spread: []
                        }, I[d].published.push(e.id)), a(e.id)) : u("Vmixer early released")
                    }, u)
                } else u("Video mixer is not ready.")
            }(e, i, o, r, n, t, a, u)
        }, D = function (t, a, i) {
            !function (e, i, o) {
                var r = S[e].audio.subscribers;
                for (var n in r) if (I[r[n]] && "axcoder" === I[r[n]].type) return i(r[n]);
                o()
            }(t, a, function () {
                var n = l();
                E(n, "axcoder", S[t].owner, !1, function () {
                    var r = function (e) {
                        makeRPC(k, I[n].locality.node, "deinit", [n]), A(n), i(e)
                    };
                    makeRPC(k, I[n].locality.node, "init", ["transcoding", {}, t, g, "transcoder"], function (e) {
                        var i = I[n].locality.node, o = t + "@" + i;
                        V(t, i, "axcoder", function () {
                            I[n] ? (I[n].subscribed[o] = {audio: t}, S[t].audio.subscribers.push(n), a(n)) : (T(t, i), r("Audio transcoder is early released."))
                        }, r)
                    }, i)
                }, i)
            })
        }, L = function (a, e, u, d) {
            D(e, function (e) {
                !function (e, i, o, r) {
                    var n = I[e].published;
                    for (var t in n) if (S[n[t]] && S[n[t]].audio && S[n[t]].audio.format === i) return o(n[t]);
                    r()
                }(e, a, u, function () {
                    var i, o, r, n, t;
                    o = a, r = u, n = d, t = I[i = e].locality.node, log.debug("spawnTranscodedAudio, audio_format:", o), makeRPC(k, t, "generate", [o, o], function (e) {
                        log.debug("spawnTranscodedAudio ok, stream_id:", e), I[i] ? (void 0 === S[e] && (log.debug("add transcoded stream to streams:", e), S[e] = {
                            owner: i,
                            audio: {format: o, subscribers: []},
                            video: void 0,
                            spread: []
                        }, I[i].published.push(e)), r(e)) : (makeRPC(k, t, "degenerate", [e]), n("Axcoder early released"))
                    }, n)
                })
            }, d)
        }, z = function (t, a, i) {
            !function (e, i, o) {
                var r = S[e].video.subscribers;
                for (var n in r) if (I[r[n]] && "vxcoder" === I[r[n]].type) return i(r[n]);
                o()
            }(t, a, function () {
                var n = l();
                E(n, "vxcoder", S[t].owner, !1, function () {
                    var r = function (e) {
                        makeRPC(k, I[n].locality.node, "deinit", [n]), A(n), i(e)
                    };
                    makeRPC(k, I[n].locality.node, "init", ["transcoding", {motionFactor: 1}, t, g, "transcoder"], function (e) {
                        var i = I[n].locality.node, o = t + "@" + i;
                        V(t, i, "vxcoder", function () {
                            I[n] ? (I[n].subscribed[o] = {video: t}, S[t].video.subscribers.push(n), a(n)) : (T(t, i), r("Video transcoder is early released."))
                        }, r)
                    }, i)
                }, i)
            })
        }, W = function (c, l, f, b, m, e, v, g) {
            z(e, function (s) {
                !function (e, i, o, r, n, t, a, u) {
                    var d = I[e].published;
                    for (var s in d) if (S[d[s]] && S[d[s]].video && S[d[s]].video.format === i && isResolutionEqual(S[d[s]].video.resolution, o) && S[d[s]].video.framerate === r && S[d[s]].video.bitrate === n && S[d[s]].video.kfi === t) return a(d[s]);
                    u()
                }(s, c, l, f, b, m, v, function () {
                    var i, o, e, r, n, t, a, u, d;
                    o = c, e = l, r = f, n = b, t = m, a = v, u = g, d = I[i = s].locality.node, log.debug("spawnTranscodedVideo, format:", o, "resolution:", e, "framerate:", r, "bitrate:", n, "keyFrameInterval:", t), makeRPC(k, d, "generate", [o, e, r, n, t], function (e) {
                        log.debug("spawnTranscodedVideo ok, stream_id:", e.id), I[i] ? (void 0 === S[e.id] && (log.debug("add to streams."), S[e.id] = {
                            owner: i,
                            audio: void 0,
                            video: {
                                format: o,
                                resolution: e.resolution,
                                framerate: e.framerate,
                                bitrate: e.bitrate,
                                kfi: e.keyFrameInterval,
                                subscribers: []
                            },
                            spread: []
                        }, I[i].published.push(e.id)), a(e.id)) : (makeRPC(k, d, "degenerate", [e.id]), u("Vxcoder early released"))
                    }, u)
                })
            }, g)
        }, K = function (e) {
            log.debug("terminateTemporaryStream:", e);
            var i = S[e].owner, o = I[i].locality.node;
            makeRPC(k, o, "degenerate", [e]), delete S[e];
            var r = I[i].published.indexOf(e);
            if (-1 < r && I[i].published.splice(r, 1), 0 === I[i].published.length && ("axcoder" === I[i].type || "vxcoder" === I[i].type)) {
                for (var n in I[i].subscribed) $(i, n);
                A(i)
            }
        }, U = function (e) {
            log.debug("trying recycleTemporaryAudio:", e), S[e] && S[e].audio && 0 === S[e].audio.subscribers.length && (!I[S[e].owner] || "amixer" !== I[S[e].owner].type && "axcoder" !== I[S[e].owner].type || K(e))
        }, B = function (e) {
            log.debug("trying recycleTemporaryVideo:", e), S[e] && S[e].video && 0 === S[e].video.subscribers.length && (!I[S[e].owner] || "vmixer" !== I[S[e].owner].type && "vxcoder" !== I[S[e].owner].type || K(e))
        };

    function H(e) {
        var i = e.codec || "";
        return e.sampleRate && (i = i + "_" + e.sampleRate), e.channelNum && (i = i + "_" + e.channelNum), e.profile && (i = i + "_" + e.profile), i
    }

    var Q = function (e, i) {
        var o = "unavailable";
        if (e.format) {
            var r = H(e.format);
            -1 !== i.indexOf(r) && (o = r)
        } else o = i[0];
        return o
    }, X = function (e, i, o) {
        var r = "unavailable";
        if (e.format) {
            var n = H(e.format);
            (n === i || o) && (r = n)
        } else r = i;
        return r
    }, Y = function (e, i, o, r, n, t, a, u) {
        log.debug("getVideoStream, stream:", e, "format:", i, "resolution:", o, "framerate:", r, "bitrate:", n, "keyFrameInterval", t);
        var d = N(e);
        d ? j(d, i, o, r, n, t, function (e) {
            log.debug("Got mixed video:", e), a(e)
        }, u) : S[e] ? S[e].video ? S[e].video.format === i && ("unspecified" === o || S[e].video.resolution && o.width === S[e].video.resolution.width && o.height === S[e].video.resolution.height) && ("unspecified" === r || S[e].video.framerate && S[e].video.framerate === r) && ("unspecified" === n || S[e].video.bitrate && S[e].video.bitrate === n) && ("unspecified" === t || S[e].video.kfi && S[e].video.kfi === t) ? a(e) : W(i, o, r, n, t, e, function (e) {
            a(e)
        }, u) : u("Stream:" + e + " has no video track.") : u("No such a video stream:" + e)
    }, Z = function (e) {
        if (S[e]) {
            log.debug("unpublishStream:", e, "stream.owner:", S[e].owner);
            var i = S[e].owner, o = (I[i].locality.node, I[i].published.indexOf(e));
            if (-1 !== o) {
                if (0 < s.views.length) for (var r in C) G(e, r);
                ee(e), I[i] && I[i].published.splice(o, 1)
            }
            delete S[e]
        } else log.info("try to unpublish an unexisting stream:", e)
    }, $ = function (e, i) {
        if (I[e]) {
            log.debug("unsubscribeStream, subscriber:", e, "subscription_id:", i);
            var o = I[e].locality.node, r = I[e].subscribed[i], n = r && r.audio, t = r && r.video;
            if (y(e) && makeRPC(k, o, "cutoff", [i]), n && S[n]) {
                if (S[n].audio) -1 < (a = S[n].audio.subscribers.indexOf(e)) && S[n].audio.subscribers.splice(a, 1);
                I[S[n].owner] && I[S[n].owner].locality.node !== o && T(n, o), I[S[n].owner] && !y(S[n].owner) && U(n)
            }
            if (t && S[t]) {
                var a;
                if (S[t].video) -1 < (a = S[t].video.subscribers.indexOf(e)) && S[t].video.subscribers.splice(a, 1);
                I[S[t].owner] && I[S[t].owner].locality.node !== o && T(t, o), I[S[t].owner] && !y(S[t].owner) && B(t)
            }
            delete I[e].subscribed[i]
        } else log.info("try to unsubscribe to an unexisting terminal:", e)
    }, ee = function (e) {
        S[e] && (S[e].audio && (S[e].audio.subscribers.forEach(function (e) {
            if (I[e]) {
                for (var i in I[e].subscribed) if ($(e, i), "axcoder" === I[e].type) for (var o in I[e].published) Z(I[e].published[o]);
                n(e) && A(e)
            }
        }), S[e] && (S[e].audio.subscribers = [])), S[e] && S[e].video && (S[e].video.subscribers.forEach(function (e) {
            if (I[e]) {
                for (var i in I[e].subscribed) if ($(e, i), "vxcoder" === I[e].type) for (var o in I[e].published) Z(I[e].published[o]);
                n(e) && A(e)
            }
        }), S[e] && (S[e].video.subscribers = [])))
    };
    t.destroy = function () {
        !function () {
            for (var e in log.debug("deinitialize"), I) y(e) ? I[e].published.map(function (e) {
                Z(e)
            }) : "amixer" !== I[e].type && "vmixer" !== I[e].type && "axcoder" !== I[e].type && "vxcoder" !== I[e].type || makeRPC(k, I[e].locality.node, "deinit", [e]), A(e);
            C = {}, I = {}, S = {}
        }()
    }, t.publish = function (e, i, o, r, n, t, a) {
        if (log.debug("publish, participantId: ", e, "streamId:", i, "accessNode:", o.node, "streamInfo:", JSON.stringify(r)), void 0 === S[i]) {
            var u = f(e, i), d = "webrtc" === n || "sip" === n ? e : P + "-" + l();
            E(u, n, d, o, function () {
                S[i] = {
                    owner: u,
                    audio: r.audio ? {format: H(r.audio), subscribers: [], status: "active"} : void 0,
                    video: r.video ? {
                        format: H(r.video),
                        resolution: r.video.resolution,
                        framerate: r.video.framerate,
                        subscribers: [],
                        status: "active"
                    } : void 0,
                    spread: []
                }, I[u].published.push(i), t()
            }, function (e) {
                a(e)
            })
        } else a("Stream[" + i + "] already set for " + e)
    }, t.unpublish = function (e, i) {
        log.debug("unpublish, stream_id:", i);
        var o = f(e, i);
        void 0 !== S[i] && S[i].owner === o && void 0 !== I[o] && -1 !== I[o].published.indexOf(i) || log.info("unpublish a rogue stream:", i), S[i] && Z(i), A(o)
    }, t.subscribe = function (e, n, i, t, o, r, a, u) {
        if (log.debug("subscribe, participantId:", e, "subscriptionId:", n, "accessNode:", i.node, "subInfo:", JSON.stringify(t), "subType:", o), (!t.audio || S[t.audio.from] && S[t.audio.from].audio || N(t.audio.from)) && (!t.video || S[t.video.from] && S[t.video.from].video || N(t.video.from))) {
            var d = void 0;
            if (t.audio) {
                var s = t.audio.from, c = N(s);
                if ("unavailable" === (d = !!c ? Q(t.audio, C[c].audio.supported_formats) : X(t.audio, S[s].audio.format, R))) return log.error("No available audio format"), log.debug("subInfo.audio:", t.audio, "targetStream.audio:", S[s] ? S[s].audio : "mixed_stream", "enable_audio_transcoding:", R), u("No available audio format")
            }
            var l = void 0, f = "unspecified", b = "unspecified", m = "unspecified", v = "unspecified";
            if (t.video) {
                var g = t.video.from;
                c = N(g);
                if ("unavailable" === (l = !!c ? Q(t.video, C[c].video.supported_formats.encode) : X(t.video, S[g].video.format, _)))
                    return log.error("No available video format"), log.debug("subInfo.video:", t.video, "targetStream.video:", S[g] ? S[g].video : "mixed_stream", "enable_video_transcoding:", _), u("No available video format");
                t.video && t.video.parameters && t.video.parameters.resolution && (f = t.video.parameters.resolution), t.video && t.video.parameters && t.video.parameters.framerate && (b = t.video.parameters.framerate), t.video && t.video.parameters && t.video.parameters.bitrate && (m = t.video.parameters.bitrate), t.video && t.video.parameters && t.video.parameters.keyFrameInterval && (v = t.video.parameters.keyFrameInterval)
            }
            if (t.audio && !d || t.video && !l) return log.error("No proper audio/video format"), u("No proper audio/video format");
            var p = O(e, n), y = function (e) {
                log.error("subscribe failed, reason:", e), A(p), u(e)
            }, h = function (i, o) {
                var e, r;
                log.debug("linkup, subscriber:", p, "audioStream:", i, "videoStream:", o), !I[p] || i && !S[i] || o && !S[o] ? (i && U(i), o && B(o), y("participant or streams early left")) : makeRPC(k, I[p].locality.node, "linkup", [n, i, o], (e = i, r = o, function () {
                    !I[p] || e && !S[e] || r && !S[r] ? (e && U(e), r && B(r), y("The subscribed stream has been broken. Canceling it.")) : (log.debug("subscribe ok, audioStream:", e, "videoStream", r), I[p].subscribed[n] = {}, e && (S[e].audio.subscribers = S[e].audio.subscribers || [], S[e].audio.subscribers.push(p), I[p].subscribed[n].audio = e), r && (S[r].video.subscribers = S[r].video.subscribers || [], S[r].video.subscribers.push(p), I[p].subscribed[n].video = r), a("ok"), t.video && t.video.from !== r && re(r))
                }), function (e) {
                    i && U(i), o && B(o), y(e)
                })
            }, x = function (e, i, o, r) {
                if (log.debug("spread2LocalNode, subscriber:", p, "audioStream:", e, "videoStream:", i), !I[p] || void 0 === e && void 0 === i) r("terminal or stream does not exist."); else {
                    var n = I[p].locality.node, t = I[p].type;
                    if (e === i || void 0 === e || void 0 === i) {
                        var a = e || i;
                        V(a, n, t, function () {
                            S[a] && I[p] ? o() : (T(a, n), r("terminal or stream early left."))
                        }, u)
                    } else log.debug("spread audio and video stream independently."), V(e, n, t, function () {
                        S[e] && S[i] && I[p] ? (log.debug("spread audioStream:", e, " ok."), V(i, n, t, function () {
                            S[e] && S[i] && I[p] ? (log.debug("spread videoStream:", i, " ok."), o()) : (S[i] && T(i, n), S[e] && T(e, n), r("Uncomplished subscription."))
                        }, r)) : (S[e] && T(e, n), r("Uncomplished subscription."))
                    }, r)
                }
            }, w = function () {
                var i, o;
                t.audio ? (log.debug("require audio track of stream:", t.audio.from), function (e, i, o, r, n) {
                    log.debug("getAudioStream, stream:", e, "audio_format:", i, "subscriber:", o);
                    var t = N(e);
                    t ? M(t, i, o, function (e) {
                        log.debug("Got mixed audio:", e), r(e)
                    }, n) : S[e] ? S[e].audio ? S[e].audio.format === i ? r(e) : L(i, e, function (e) {
                        r(e)
                    }, n) : n("Stream:" + e + " has no audio track.") : n("No such an audio stream:" + e)
                }(t.audio.from, d, p, function (e) {
                    i = e, log.debug("Got audio stream:", i), t.video ? (log.debug("require video track of stream:", t.video.from), Y(t.video.from, l, f, b, m, v, function (e) {
                        o = e, log.debug("Got video stream:", o), x(i, o, function () {
                            h(i, o)
                        }, function (e) {
                            B(o), U(i), y(e)
                        })
                    }, function (e) {
                        U(i), y(e)
                    })) : x(i, void 0, function () {
                        h(i, void 0)
                    }, function (e) {
                        U(i), y(e)
                    })
                }, y)) : t.video ? (log.debug("require video track of stream:", t.video.from), Y(t.video.from, l, f, b, m, v, function (e) {
                    x(void 0, o = e, function () {
                        h(void 0, o)
                    }, function (e) {
                        B(o), y(e)
                    })
                }, y)) : (log.debug("No audio or video is required."), y("No audio or video is required."))
            };
            E(p, o, "webrtc" !== o && "sip" !== o || !r ? P : e, i, function () {
                w()
            }, u)
        } else log.error("streams do not exist or are insufficient. subInfo:", t), u("streams do not exist or are insufficient")
    }, t.unsubscribe = function (e, i) {
        log.debug("unsubscribe from participant:", e, "for subscription:", i);
        var o = O(e, i);
        I[o] && I[o].subscribed[i] && ($(o, i), A(o))
    }, t.updateStream = function (e, i, o) {
        if (log.debug("updateStream, stream_id:", e, "track", i, "status:", o), 0 < s.views.length && ("active" === o || "inactive" === o)) if (("video" === i || "av" === i) && S[e] && S[e].video) for (var r in S[e].video.status = o, C) {
            var n = C[r].video.mixer;
            if (n && I[n] && 0 <= S[e].video.subscribers.indexOf(n)) {
                var t = I[n].locality.node;
                makeRPC(k, t, "setInputActive", [e, "active" === o])
            }
        } else if (("audio" === i || "av" === i) && S[e] && S[e].audio) for (var r in S[e].audio.status = o, C) {
            var a = C[r].audio.mixer;
            if (a && I[a] && 0 <= S[e].audio.subscribers.indexOf(a)) {
                t = I[a].locality.node;
                makeRPC(k, t, "setInputActive", [e, "active" === o])
            }
        }
    }, t.mix = function (e, i, o, r) {
        return log.debug("mix, stream_id:", e, "to view:", i), C[i] ? S[e] ? (n = e, t = i, a = o, u = r, log.debug("to mix stream:", n, "view:", t), void(S[n].audio ? w(n, t, function () {
            S[n].video && x(t, "video") ? q(n, t, a, function (e) {
                F(n, t), u(e)
            }) : a()
        }, u) : S[n].video ? q(n, t, a, u) : u("No audio or video to mix"))) : r("Invalid stream") : r("Invalid view");
        var n, t, a, u
    }, t.unmix = function (e, i, o, r) {
        return log.debug("unmix, stream_id:", e, "from view:", i), C[i] ? S[e] ? (G(e, i), void o()) : r("Invalid stream") : r("Invalid view")
    }, t.getRegion = function (e, i, o, r) {
        log.debug("getRegion, stream_id:", e, "fromView", i);
        var n = x(i, "video");
        n ? makeRPC(k, I[n].locality.node, "getRegion", [e], o, r) : r("Invalid mix view")
    }, t.setRegion = function (e, i, o, r, n) {
        log.debug("setRegion, stream_id:", e, "toView:", o, "region:", i);
        var t = x(o, "video");
        t ? makeRPC(k, I[t].locality.node, "setRegion", [e, i], function (e) {
            r(e), a(o)
        }, n) : n("Invalid mix view")
    }, t.setLayout = function (i, e, o, r) {
        log.debug("setLayout, toView:", i, "layout:", JSON.stringify(e));
        var n = x(i, "video");
        n ? makeRPC(k, I[n].locality.node, "setLayout", [e], function (e) {
            o(e), a(i)
        }, r) : r("Invalid mix view")
    }, t.setPrimary = function (e, i) {
        log.debug("setPrimary:", e, i);
        var o = x(i, "video");
        S[e] && S[e].video && -1 !== S[e].video.subscribers.indexOf(o) && makeRPC(k, I[o].locality.node, "setPrimary", [e])
    }, t.getMixedStreams = function () {
        return C ? Object.keys(C).map(function (e) {
            return log.debug("mix stream id:", b(e)), {streamId: b(e), view: e}
        }) : []
    }, t.getMixedStream = function (e) {
        return b(e)
    };
    var ie = function (e, i, o) {
        return "worker" === i && e.agent === o || "node" === i && e.node === o
    }, oe = function (e, r) {
        return new Promise(function (i, o) {
            makeRPC(k, I[e].locality.node, "init", r, function (e) {
                i(e)
            }, function (e) {
                o(e)
            })
        })
    }, re = function (e) {
        if (S[e]) {
            var i = S[e].owner;
            I[i] && makeRPC(k, I[i].locality.node, "forceKeyFrame", [e])
        }
    }, ne = function (n) {
        I[n].locality;
        var e = [], i = [], t = null;
        for (var o in C) if (C[o].video.mixer === n) {
            t = o;
            break
        }
        for (var r in log.debug("rebuildVideoMixer, vmixerId:", n, "view:", t), I[n].subscribed) {
            var a = I[n].subscribed[r].video;
            e.push(a), log.debug("Abort stream mixing:", a), J(a, t)
        }
        return I[n].subscribed = {}, I[n].published.forEach(function (o) {
            if (S[o]) {
                var e = JSON.parse(JSON.stringify(S[o]));
                e.old_stream_id = o, i.push(e), S[o].video.subscribers.forEach(function (e) {
                    log.debug("Aborting subscription to stream :", o, "by subscriber:", e);
                    var i = S[o].video.subscribers.indexOf(e);
                    -1 < i && S[o].video.subscribers.splice(i, 1), I[e] && T(o, I[e].locality.node)
                }), delete S[o]
            }
        }), I[n].published = [], d.getWorkerNode(u, "video", {room: P, task: n}, c).then(function (e) {
            return log.debug("Got new video mixer node:", e), I[n].locality = e, i = n, r = m(o = t).video, oe(i, ["mixing", r, P, g, o]).then(function (e) {
                return log.debug("Init video mixer ok. room_id:", P, "vmixer_id:", i, "view:", o), C[o] && (C[o].video = {
                    mixer: i,
                    supported_formats: e.codecs
                }), v(o), e.resolutions
            }, function (e) {
                log.error("Init video_mixer failed. room_id:", P, "reason:", e), Promise.reject(e)
            });
            var i, o, r
        }).then(function () {
            return Promise.all(e.map(function (o) {
                return log.debug("Resuming video mixer input:", o), new Promise(function (e, i) {
                    q(o, t, e, i)
                })
            }))
        }).then(function () {
            return Promise.all(i.map(function (o) {
                return log.debug("Resuming video mixer output:", o), new Promise(function (e, i) {
                    j(t, o.video.format, o.video.resolution, o.video.framerate, o.video.bitrate, o.video.kfi, function (r) {
                        return log.debug("Got new stream:", r), Promise.all(o.spread.map(function (o) {
                            return new Promise(function (e, i) {
                                V(r, o.target, "participant", function () {
                                    e("ok")
                                }, function (e) {
                                    log.warn("Failed in spreading video stream. reason:", e), i(e)
                                })
                            })
                        })).then(function () {
                            o.video.subscribers.forEach(function (e) {
                                if (I[e]) for (var i in I[e].subscribed) I[e].subscribed[i].video === o.old_stream_id && makeRPC(k, I[e].locality.node, "linkup", [i, void 0, r], function () {
                                    S[r].video.subscribers = S[r].video.subscribers || [], S[r].video.subscribers.push(e), I[e].subscribed[i].video = r
                                }, function (e) {
                                    log.warn("Failed in resuming video subscription. reason:", e)
                                })
                            })
                        }).then(function () {
                            log.debug("Resumed video mixer output ok."), re(r), e("ok")
                        }).catch(function (e) {
                            log.info("Resumed video mixer output failed. err:", e), i(e)
                        })
                    }, i)
                })
            }))
        }).catch(function (e) {
            log.error("Rebuid video mixer failed, reason:", "string" == typeof e ? e : e.message), setTimeout(function () {
                throw Error("Rebuild video mixer failed.")
            })
        })
    }, te = function (e) {
        var r, i = I[e].locality, n = [];
        for (var o in log.debug("rebuildVideoTranscoder, vxcoderId:", e), I[e].subscribed) {
            var t = I[e].subscribed[o].video, a = S[r = t].video.subscribers.indexOf(e);
            -1 < a && S[t].video.subscribers.splice(a, 1), T(t, i.node)
        }
        return I[e].subscribed = {}, I[e].published.forEach(function (o) {
            if (S[o]) {
                var e = JSON.parse(JSON.stringify(S[o]));
                e.old_stream_id = o, n.push(e), S[o].video.subscribers.forEach(function (e) {
                    log.debug("Aborting subscription to stream :", o, "by subscriber:", e);
                    var i = S[o].video.subscribers.indexOf(e);
                    -1 < i && S[o].video.subscribers.splice(i, 1), I[e] && T(o, I[e].locality.node)
                }), delete S[o]
            }
        }), I[e].published = [], Promise.resolve("ok").then(function () {
            return Promise.all(n.map(function (o) {
                return log.debug("Resuming video xcoder output:", o), new Promise(function (e, i) {
                    W(o.video.format, o.video.resolution, o.video.framerate, o.video.bitrate, o.video.kfi, r, function (r) {
                        return log.debug("Got new stream:", r), Promise.all(o.spread.map(function (o) {
                            return new Promise(function (e, i) {
                                V(r, o.target, "participant", function () {
                                    e("ok")
                                }, function (e) {
                                    log.warn("Failed in spreading video stream. reason:", e), i(e)
                                })
                            })
                        })).then(function () {
                            o.video.subscribers.forEach(function (e) {
                                if (I[e]) for (var i in I[e].subscribed) I[e].subscribed[i].video === o.old_stream_id && makeRPC(k, I[e].locality.node, "linkup", [i, void 0, r], function () {
                                    S[r].video.subscribers = S[r].video.subscribers || [], S[r].video.subscribers.push(e), I[e].subscribed[i].video = r
                                }, function (e) {
                                    log.warn("Failed in resuming video subscription. reason:", e)
                                })
                            })
                        }).then(function () {
                            log.debug("Resumed video xcoder output ok."), re(r), e("ok")
                        }).catch(function (e) {
                            log.info("Resumed video xcoder output failed. err:", e), i(e)
                        })
                    }, i)
                })
            }))
        }).catch(function (e) {
            log.error("Rebuid video transcoder failed, reason:", "string" == typeof e ? e : e.message), setTimeout(function () {
                throw Error("Rebuild video transcoder failed.")
            })
        })
    }, ae = function (n) {
        I[n].locality;
        var e = [], i = [], t = null;
        for (var o in C) if (C[o].audio.mixer === n) {
            t = o;
            break
        }
        for (var r in I[n].subscribed) {
            var a = I[n].subscribed[r].audio;
            e.push(a), log.debug("Aborting stream mixing:", a), F(a, t)
        }
        return I[n].subscribed = {}, I[n].published.forEach(function (o) {
            if (S[o]) {
                var r = JSON.parse(JSON.stringify(S[o]));
                r.old_stream_id = o, S[o].audio.subscribers.forEach(function (e) {
                    r.for_whom = e, log.debug("Aborting subscription to stream:", o, "by subscriber:", e);
                    var i = S[o].audio.subscribers.indexOf(e);
                    -1 < i && S[o].audio.subscribers.splice(i, 1), I[e] && T(o, I[e].locality.node)
                }), i.push(r), delete S[o]
            }
        }), I[n].published = [], d.getWorkerNode(u, "audio", {room: P, task: n}, c).then(function (e) {
            return log.debug("Got new audio mixer node:", e), I[n].locality = e, i = n, r = m(o = t).audio, oe(i, ["mixing", r, P, g, o]).then(function (e) {
                return log.debug("Init audio mixer ok. room_id:", P, "amixer_id:", i, "view:", o), C[o] && (C[o].audio = {
                    mixer: i,
                    supported_formats: e.codecs
                }), v(o), "ok"
            }, function (e) {
                log.error("Init audio_mixer failed. room_id:", P, "reason:", e), Promise.reject(e)
            });
            var i, o, r
        }).then(function () {
            return Promise.all(e.map(function (o) {
                return log.debug("Resuming audio mixer input:", o), new Promise(function (e, i) {
                    w(o, t, e, i)
                })
            }))
        }).then(function () {
            return Promise.all(i.map(function (o) {
                return log.debug("Resuming audio mixer output:", o, "view:", t), new Promise(function (e, i) {
                    M(t, o.audio.format, o.for_whom, function (r) {
                        return log.debug("Got new stream:", r), Promise.all(o.spread.map(function (o) {
                            return new Promise(function (e, i) {
                                V(r, o.target, "participant", function () {
                                    e("ok")
                                }, function (e) {
                                    log.warn("Failed in spreading audio stream. reason:", e), i(e)
                                })
                            })
                        })).then(function () {
                            o.audio.subscribers.forEach(function (e) {
                                if (I[e]) for (var i in I[e].subscribed) I[e].subscribed[i].audio === o.old_stream_id && makeRPC(k, I[e].locality.node, "linkup", [i, r, void 0], function () {
                                    S[r].audio.subscribers = S[r].audio.subscribers || [], S[r].audio.subscribers.push(e), I[e].subscribed[i].audio = r
                                }, function (e) {
                                    log.warn("Failed in resuming video subscription. reason:", e)
                                })
                            })
                        }).then(function () {
                            log.debug("Resumed audio mixer output ok."), e("ok")
                        }).catch(function (e) {
                            log.info("Resumed audio mixer output failed. err:", e), i(e)
                        })
                    }, i)
                })
            }))
        }).catch(function (e) {
            log.error("Rebuid audio mixer failed, reason:", "string" == typeof e ? e : e.message), setTimeout(function () {
                throw Error("Rebuild audio mixer failed.")
            })
        })
    }, ue = function (e) {
        var r, i = I[e].locality, n = [];
        for (var o in I[e].subscribed) {
            var t = I[e].subscribed[o].audio, a = S[r = t].audio.subscribers.indexOf(e);
            -1 < a && S[t].audio.subscribers.splice(a, 1), T(t, i.node)
        }
        return I[e].subscribed = {}, I[e].published.forEach(function (o) {
            if (S[o]) {
                var e = JSON.parse(JSON.stringify(S[o]));
                e.old_stream_id = o, n.push(e), S[o].audio.subscribers.forEach(function (e) {
                    log.debug("Aborting subscription to stream :", o, "by subscriber:", e);
                    var i = S[o].audio.subscribers.indexOf(e);
                    -1 < i && S[o].audio.subscribers.splice(i, 1), I[e] && T(o, I[e].locality.node)
                }), delete S[o]
            }
        }), I[e].published = [], Promise.resolve("ok").then(function () {
            return Promise.all(n.map(function (o) {
                return log.debug("Resuming audio xcoder output:", o), new Promise(function (e, i) {
                    L(o.audio.format, r, function (r) {
                        return log.debug("Got new stream:", r), Promise.all(o.spread.map(function (o) {
                            return new Promise(function (e, i) {
                                V(r, o.target, "participant", function () {
                                    e("ok")
                                }, function (e) {
                                    log.warn("Failed in spreading audio stream. reason:", e), i(e)
                                })
                            })
                        })).then(function () {
                            o.audio.subscribers.forEach(function (e) {
                                if (I[e]) for (var i in I[e].subscribed) I[e].subscribed[i].audio === o.old_stream_id && makeRPC(k, I[e].locality.node, "linkup", [i, r, void 0], function () {
                                    S[r].audio.subscribers = S[r].audio.subscribers || [], S[r].audio.subscribers.push(e), I[e].subscribed[i].audio = r
                                }, function (e) {
                                    log.warn("Failed in resuming audio subscription. reason:", e)
                                })
                            })
                        }).then(function () {
                            log.debug("Resumed audio xcoder output ok."), e("ok")
                        }).catch(function (e) {
                            log.info("Resumed audio xcoder output failed. err:", e), i(e)
                        })
                    }, i)
                })
            }))
        }).catch(function (e) {
            log.error("Rebuid audio transcoder failed, reason:", "string" == typeof e ? e : e.message), setTimeout(function () {
                throw Error("Rebuild audio transcoder failed.")
            })
        })
    };
    return t.onFaultDetected = function (e, i, o) {
        log.debug("onFaultDetected, purpose:", e, "type:", i, "id:", o), "video" === e ? function (e, i) {
            for (var o in I) ie(I[o].locality, e, i) && (log.debug("Impacted terminal:", o, "and its locality:", I[o].locality), "vmixer" === I[o].type ? ne(o) : "vxcoder" === I[o].type && te(o))
        }(i, o) : "audio" === e && function (e, i) {
            for (var o in I) ie(I[o].locality, e, i) && (log.debug("Impacted terminal:", o, "and its locality:", I[o].locality), "amixer" === I[o].type ? ae(o) : "axcoder" === I[o].type && ue(o))
        }(i, o)
    }, t.getViewCapability = function (e) {
        var i = function (e) {
            var i = e.split("_"), o = {codec: i[0]};
            return i[1] && (o.profile = i[1]), o
        };
        return C[e] ? {
            audio: C[e].audio.supported_formats.map(function (e) {
                var i = e.split("_"), o = {codec: i[0]};
                return i[1] && (o.sampleRate = Number(i[1])), i[2] && (o.channelNum = Number(i[2])), o
            }),
            video: {
                encode: C[e].video.supported_formats.encode.map(i),
                decode: C[e].video.supported_formats.decode.map(i)
            }
        } : null
    }, t.updateStreamInfo = function (e, i) {
        S[e] && i && i.video && i.video.parameters && i.video.parameters.resolution && (S[e].video.resolution = i.video.parameters.resolution)
    }, assert.equal(void 0 === i ? "undefined" : _typeof(i), "function"), assert.equal(void 0 === o ? "undefined" : _typeof(o), "function"), function (o, r) {
        if (log.debug("initialize room", P), 0 < s.views.length) {
            var n, e = [];
            s.views.forEach(function (o) {
                var r = o.label;
                C[r] = {}, e.push(new Promise(function (i, e) {
                    !function (t, o, r, n) {
                        if (C[t]) {
                            var a = b(t), u = function (r, e, n) {
                                return new Promise(function (i, o) {
                                    E(r, e, a, !1, function () {
                                        log.debug("new terminal ok. terminal_id", r, "type:", e, "view:", t, "mixConfig:", n), oe(r, ["mixing", n, P, g, t]).then(function (e) {
                                            i(e)
                                        }).catch(function (e) {
                                            log.error("Init media processor failed.:", e), A(r), o(e)
                                        })
                                    }, function (e) {
                                        log.error("new mix terminal failed. room_id:", P, "reason:", e), o(e)
                                    })
                                })
                            }, d = l();
                            u(d, "amixer", o.audio).then(function (e) {
                                if (C[t].audio = {mixer: d, supported_formats: e.codecs}, o.video) {
                                    var i = l();
                                    u(i, "vmixer", o.video).then(function (e) {
                                        C[t].video = {mixer: i, supported_formats: e.codecs}, v(t), r()
                                    }, function (e) {
                                        A(d), n(e)
                                    })
                                } else C[t].video = {mixer: null, supported_formats: {encode: [], decode: []}}, r()
                            }, function (e) {
                                n(e)
                            })
                        } else n("Mix view does not exist")
                    }(r, o, function () {
                        log.debug("init ok for view:", r), i(r)
                    }, function (e) {
                        log.error("init fail. view:", r, "reason:", e), n = e, delete C[r], i(null)
                    })
                }))
            }), Promise.all(e).then(function (e) {
                var i = e.filter(function (e) {
                    return null !== e
                }).length;
                i < e.length ? (log.debug("Views incomplete initialization", i), r(n)) : o(t)
            }).catch(function (e) {
                log.error("Error initialize views:", e), r(e)
            })
        } else log.debug("Room disable mixing init ok"), o(t)
    }(i, o)
};