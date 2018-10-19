"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, Fraction = require("fraction.js"), logger = require("./logger").logger,
    AccessController = require("./accessController"), RoomController = require("./roomController"),
    dataAccess = require("./data_access"), Participant = require("./participant"), log = logger.getLogger("Conference"),
    isAudioFmtCompatible = function (e, i) {
        return e.codec === i.codec && e.sampleRate === i.sampleRate && e.channelNum === i.channelNum
    }, isVideoFmtCompatible = function (e, i) {
        return !(e.codec !== i.codec || e.profile && i.profile && e.profile !== i.profile)
    }, calcResolution = function (e, i) {
        var a = function (e) {
            var i = Math.floor(e);
            return i % 2 == 0 ? i : i - 1
        };
        switch (e) {
            case"x3/4":
                return {width: a(3 * i.width / 4), height: a(3 * i.height / 4)};
            case"x2/3":
                return {width: a(2 * i.width / 3), height: a(2 * i.height / 3)};
            case"x1/2":
                return {width: a(i.width / 2), height: a(i.height / 2)};
            case"x1/3":
                return {width: a(i.width / 3), height: a(i.height / 3)};
            case"x1/4":
                return {width: a(i.width / 4), height: a(i.height / 4)};
            case"xga":
                return {width: 1024, height: 768};
            case"svga":
                return {width: 800, height: 600};
            case"vga":
                return {width: 640, height: 480};
            case"hvga":
                return {width: 480, height: 320};
            case"cif":
                return {width: 352, height: 288};
            case"sif":
                return {width: 320, height: 240};
            case"qcif":
                return {width: 176, height: 144};
            case"hd720p":
                return {width: 1280, height: 720};
            case"hd1080p":
                return {width: 1920, height: 1080};
            default:
                return {width: 65536, height: 65536}
        }
    }, calcBitrate = function (e, i) {
        return Number(e.substring(1)) * i
    }, Conference = function (o, t) {
        var d, g, u, c, e = {}, n = !1, l = {}, b = {}, f = {}, i = require("./rpcChannel")(o),
            s = require("./rpcRequest")(i), m = function (e, a, i, r) {
                return log.debug("onSessionEstablished, participantId:", e, "sessionId:", a, "direction:", i, "sessionInfo:", JSON.stringify(r)), "in" === i ? j(a, r.locality, r.media, r.info).then(function () {
                    y(e, "progress", {id: a, status: "ready"})
                }).catch(function (e) {
                    var i = e.message ? e.message : e;
                    log.info("Exception:", i), u && u.terminate(a, "in", i).catch(function (e) {
                        log.info("Exception:", e.message ? e.message : e)
                    })
                }) : "out" === i ? O(a, r.locality, r.media, r.info).then(function () {
                    r.info.location ? y(e, "progress", {
                        id: a,
                        status: "ready",
                        data: r.info.location
                    }) : y(e, "progress", {id: a, status: "ready"})
                }).catch(function (e) {
                    var i = e.message ? e.message : e;
                    log.info("Exception:", i), u && u.terminate(a, "out", i).catch(function (e) {
                        log.info("Exception:", e.message ? e.message : e)
                    })
                }) : void log.info("Unknown session direction:", i)
            }, p = function (e, i, a, r) {
                log.debug("onSessionAborted, participantId:", e, "sessionId:", i, "direction:", a, "reason:", r), "Participant terminate" !== r && y(e, "progress", {
                    id: i,
                    status: "error",
                    data: r
                }), "in" === a ? C(i).catch(function (e) {
                    var i = e.message ? e.message : e;
                    log.info(i)
                }) : "out" === a ? N(i).catch(function (e) {
                    var i = e.message ? e.message : e;
                    log.info(i)
                }) : log.info("Unknown session direction:", a)
            }, v = function (e, i, a) {
                log.debug("onLocalSessionSignaling, participantId:", e, "sessionId:", i, "signaling:", a), l[e] && y(e, "progress", {
                    id: i,
                    status: "soac",
                    data: a
                })
            }, h = function (r) {
                return n ? new Promise(function (e, i) {
                    var a = setInterval(function () {
                        n || (clearInterval(a), d === r ? e("ok") : i("room initialization failed"))
                    }, 50)
                }) : void 0 !== d ? d !== r ? Promise.reject("room id clash") : Promise.resolve("ok") : (n = !0, dataAccess.room.config(r).then(function (e) {
                    return (c = e).internalConnProtocol = global.config.internal.protocol, 0 === c.participantLimit ? (log.error("Room", roomID, "disabled"), n = !1, Promise.reject("Room" + roomID + "disabled")) : new Promise(function (i, a) {
                        RoomController.create({
                            cluster: global.config.cluster.name || "woogeen-cluster",
                            rpcReq: s,
                            rpcClient: o,
                            room: r,
                            config: c,
                            selfRpcId: t
                        }, function (e) {
                            log.debug("room controller init ok"), g = e, d = r, n = !1, c.views.forEach(function (r) {
                                var e = d + "-" + r.label, a = g.getViewCapability(r.label);
                                if (a) {
                                    var o = r.audio.format, t = r.audio.format;
                                    if (r.audio) {
                                        if (r.audio.format && 0 <= a.audio.findIndex(function (e) {
                                            return isAudioFmtCompatible(r.audio.format, e)
                                        })) o = r.audio.format; else for (var i in c.mediaOut.audio) {
                                            var n = c.mediaOut.audio[i];
                                            if (0 <= a.audio.findIndex(function (e) {
                                                return isAudioFmtCompatible(n, e)
                                            })) {
                                                o = n;
                                                break
                                            }
                                        }
                                        if (!o) return void log.error("No capable audio format for view: " + r.label)
                                    }
                                    if (r.video) {
                                        if (r.video.format && 0 <= a.video.encode.findIndex(function (e) {
                                            return isVideoFmtCompatible(r.video.format, e)
                                        })) t = r.video.format; else for (var i in c.mediaOut.video.format) {
                                            n = c.mediaOut.video.format[i];
                                            if (0 <= a.video.encode.findIndex(function (e) {
                                                return isVideoFmtCompatible(n, e)
                                            })) {
                                                t = n;
                                                break
                                            }
                                        }
                                        if (!t) return void log.error("No capable video format for view: " + r.label)
                                    }
                                    var s = {
                                        id: e,
                                        type: "mixed",
                                        media: {
                                            audio: r.audio ? {
                                                format: o,
                                                optional: {
                                                    format: c.mediaOut.audio.filter(function (i) {
                                                        return 0 <= a.audio.findIndex(function (e) {
                                                            return isAudioFmtCompatible(e, i)
                                                        }) && !isAudioFmtCompatible(i, o)
                                                    })
                                                }
                                            } : void 0,
                                            video: r.video ? {
                                                format: t,
                                                optional: {
                                                    format: c.mediaOut.video.format.filter(function (i) {
                                                        return 0 <= a.video.encode.findIndex(function (e) {
                                                            return isVideoFmtCompatible(e, i)
                                                        }) && !isVideoFmtCompatible(i, t)
                                                    }),
                                                    parameters: {
                                                        resolution: c.mediaOut.video.parameters.resolution.map(function (e) {
                                                            return calcResolution(e, r.video.parameters.resolution)
                                                        }).filter(function (i, e, a) {
                                                            return i.width < r.video.parameters.resolution.width && i.height < r.video.parameters.resolution.height && a.findIndex(function (e) {
                                                                return e.width === i.width && e.height === i.height
                                                            }) === e
                                                        }),
                                                        framerate: c.mediaOut.video.parameters.framerate.filter(function (e) {
                                                            return e < r.video.parameters.framerate
                                                        }),
                                                        bitrate: c.mediaOut.video.parameters.bitrate,
                                                        keyFrameInterval: c.mediaOut.video.parameters.keyFrameInterval.filter(function (e) {
                                                            return e < r.video.parameters.keyFrameInterval
                                                        })
                                                    }
                                                },
                                                parameters: {
                                                    resolution: r.video.parameters.resolution,
                                                    framerate: r.video.parameters.framerate,
                                                    bitrate: r.video.parameters.bitrate,
                                                    keyFrameInterval: r.video.parameters.keyFrameInterval
                                                }
                                            } : void 0
                                        },
                                        info: {label: r.label, activeInput: "unknown", layout: []}
                                    };
                                    b[e] = s, log.debug("Mixed stream info:", s), c.notifying.streamChange && I("room", "all", "stream", {
                                        id: e,
                                        status: "add",
                                        data: s
                                    })
                                } else log.error("No audio/video capability for view: " + r.label)
                            }), l.admin = Participant({
                                id: "admin",
                                user: "admin",
                                role: "admin",
                                portal: void 0,
                                origin: {isp: "isp", region: "region"},
                                permission: {}
                            }, s), u = AccessController.create({
                                clusterName: global.config.cluster.name || "woogeen-cluster",
                                selfRpcId: t,
                                inRoom: d,
                                mediaIn: c.mediaIn,
                                mediaOut: c.mediaOut
                            }, s, m, p, v), i("ok")
                        }, function (e) {
                            log.error("roomController init failed.", e), n = !1, a("roomController init failed. reason: " + e)
                        })
                    })
                }).catch(function (e) {
                    return log.error("Init room failed, reason:", e), n = !1, setTimeout(function () {
                        process.exit()
                    }, 0), Promise.reject(e)
                }))
            }, k = function () {
                d && (u && u.destroy(), u = void 0, g && g.destroy(), f = {}, b = {}, l = {}, d = g = void 0), process.exit()
            }, y = function (e, i, a) {
                "admin" !== e && (l[e] ? l[e].notify(i, a).catch(function (e) {
                    log.debug("sendMsg fail:", e)
                }) : log.warn("Can not send message to:", e))
            }, I = function (e, i, a, r) {
                if (log.debug("sendMsg, from:", e, "to:", i, "msg:", a, "data:", r), "all" === i) for (var o in l) y(o, a, r); else if ("others" === i) for (var o in l) o !== e && y(o, a, r); else y(i, a, r)
            }, r = function (e) {
                if (l[e]) {
                    for (var i in f) f[i].info.owner === e && N(i);
                    for (var a in b) b[a].info.owner === e && C(a);
                    var r = l[e].getInfo();
                    delete l[e], c.notifying.participantActivities && I("room", "all", "participant", {
                        action: "leave",
                        data: r.id
                    })
                }
            }, P = function (e) {
                var i = {codec: e.codec};
                return e.sampleRate && (i.sampleRate = e.sampleRate), e.channelNum && (i.channelNum = e.channelNum), i
            }, w = function (e) {
                var i = {codec: e.codec};
                return e.profile && (i.profile = e.profile), i
            }, S = function (e, i) {
                return b[e] ? Promise.reject("Stream already exists") : (b[e] = {
                    id: e,
                    type: "forward",
                    info: i,
                    isInConnecting: !0
                }, Promise.resolve("ok"))
            }, j = function (t, e, n, s) {
                return !n.audio || c.mediaIn.audio.length && function (e, i) {
                    for (var a in i) if (isAudioFmtCompatible(e, i[a])) return !0;
                    return !1
                }(P(n.audio), c.mediaIn.audio) ? !n.video || c.mediaIn.video.length && function (e, i) {
                    for (var a in i) if (isVideoFmtCompatible(e, i[a])) return !0;
                    return !1
                }(w(n.video), c.mediaIn.video) ? new Promise(function (a, o) {
                    g && g.publish(s.owner, t, e, n, s.type, function () {
                        if (l[s.owner]) {
                            var e = {
                                id: t,
                                type: "forward",
                                media: (i = n, r = {}, i.audio && (r.audio = {
                                    status: "active",
                                    format: P(i.audio)
                                }, i.audio.source && (r.audio.source = i.audio.source), c.transcoding.audio && (r.audio.optional = {format: []}, c.mediaOut.audio.forEach(function (e) {
                                    e.codec === r.audio.format.codec && e.sampleRate === r.audio.format.sampleRate && e.channelNum === r.audio.format.channelNum || r.audio.optional.format.push(e)
                                }))), i.video && (r.video = {
                                    status: "active",
                                    format: w(i.video)
                                }, !i.video.resolution || i.video.resolution.height || i.video.resolution.width || delete i.video.resolution, i.video.source && (r.video.source = i.video.source), i.video.resolution && 0 !== i.video.resolution.width && 0 !== i.video.resolution.height && (r.video.parameters || (r.video.parameters = {})) && (r.video.parameters.resolution = i.video.resolution), i.video.framerate && 0 !== i.video.framerate && (r.video.parameters || (r.video.parameters = {})) && (r.video.parameters.framerate = Math.floor(i.video.framerate)), i.video.bitrate && (r.video.parameters || (r.video.parameters = {})) && (r.video.parameters.bitrate = i.video.bitrate), i.video.keyFrameInterval && (r.video.parameters || (r.video.parameters = {})) && (r.video.parameters.keyFrameInterval = i.video.keyFrameInterval), c.transcoding.video && c.transcoding.video.format && (r.video.optional = {format: []}, c.mediaOut.video.format.forEach(function (e) {
                                    e.codec === r.video.format.codec && e.profile === r.video.format.profile || r.video.optional.format.push(e)
                                })), c.transcoding.video && c.transcoding.video.parameters && (c.transcoding.video.parameters.resolution && (r.video.optional = r.video.optional || {}, r.video.optional.parameters = r.video.optional.parameters || {}, r.video.parameters && r.video.parameters.resolution ? r.video.optional.parameters.resolution = c.mediaOut.video.parameters.resolution.map(function (e) {
                                    return calcResolution(e, r.video.parameters.resolution)
                                }).filter(function (i, e, a) {
                                    return i.width < r.video.parameters.resolution.width && i.height < r.video.parameters.resolution.height && a.findIndex(function (e) {
                                        return e.width === i.width && e.height === i.height
                                    }) === e
                                }) : r.video.optional.parameters.resolution = c.mediaOut.video.parameters.resolution.filter(function (e) {
                                    return "x3/4" !== e && "x2/3" !== e && "x1/2" !== e && "x1/3" !== e && "x1/4" !== e
                                }).map(function (e) {
                                    return calcResolution(e)
                                })), c.transcoding.video.parameters.framerate && (r.video.optional = r.video.optional || {}, r.video.optional.parameters = r.video.optional.parameters || {}, r.video.parameters && r.video.parameters.framerate ? r.video.optional.parameters.framerate = c.mediaOut.video.parameters.framerate.filter(function (e) {
                                    return e < r.video.parameters.framerate
                                }) : r.video.optional.parameters.framerate = c.mediaOut.video.parameters.framerate), c.transcoding.video.parameters.bitrate && (r.video.optional = r.video.optional || {}, r.video.optional.parameters = r.video.optional.parameters || {}, r.video.optional.parameters.bitrate = c.mediaOut.video.parameters.bitrate.filter(function (e) {
                                    return Number(e.substring(1)) < 1
                                })), c.transcoding.video.parameters.keyFrameInterval && (r.video.optional = r.video.optional || {}, r.video.optional.parameters = r.video.optional.parameters || {}, r.video.optional.parameters.keyFrameInterval = c.mediaOut.video.parameters.keyFrameInterval))), r),
                                info: s
                            };
                            e.info.inViews = [], b[t] = e, setTimeout(function () {
                                c.notifying.streamChange && I("room", "all", "stream", {id: t, status: "add", data: e})
                            }, 10), a("ok")
                        } else g && g.unpublish(s.owner, t), o("Participant early left");
                        var i, r
                    }, function (e) {
                        o("roomController.publish failed, reason: " + (e.message ? e.message : e))
                    })
                }) : Promise.reject("Video format unacceptable") : Promise.reject("Audio format unacceptable")
            }, C = function (r) {
                return new Promise(function (e, i) {
                    if (b[r]) {
                        for (var a in f) (f[a].media.audio && f[a].media.audio.from === r || f[a].media.video && f[a].media.video.from === r) && u && u.terminate(a, "out", "Source stream loss");
                        b[r].isInConnecting || g && g.unpublish(b[r].info.owner, r), delete b[r], setTimeout(function () {
                            c.notifying.streamChange && I("room", "all", "stream", {id: r, status: "remove"})
                        }, 10)
                    }
                    e("ok")
                })
            }, x = function (e, i, a) {
                return f[e] ? Promise.reject("Subscription already exists") : (f[e] = {
                    id: e,
                    media: i.media,
                    info: a,
                    isInConnecting: !0
                }, Promise.resolve("ok"))
            }, O = function (r, o, t, n) {
                if (!l[n.owner]) return Promise.reject("Participant early left");
                var e = JSON.parse(JSON.stringify(t));
                if (e.video) {
                    if (void 0 === b[e.video.from]) return Promise.reject("Video source early released");
                    var i = b[e.video.from].media.video;
                    if (e.video.format = e.video.format || i.format, t.video.format = e.video.format, t.video.status = e.video.status || "active", "mixed" === b[e.video.from].type) if (e.video.parameters && 0 < Object.keys(e.video.parameters).length) {
                        if (e.video.parameters.bitrate) i.parameters.bitrate && "string" == typeof e.video.parameters.bitrate && (e.video.parameters.bitrate = i.parameters.bitrate * Number(e.video.parameters.bitrate.substring(1))); else if (e.video.parameters.resolution || e.video.parameters.framerate) if (i.parameters && i.parameters.bitrate) {
                            var a = e.video.parameters.resolution ? e.video.parameters.resolution.width * e.video.parameters.resolution.height / (i.parameters.resolution.width * i.parameters.resolution.height) : 1,
                                s = e.video.parameters.framerate ? e.video.parameters.framerate / i.parameters.framerate : 1;
                            e.video.parameters.bitrate = i.parameters.bitrate * a * s
                        } else e.video.parameters.bitrate = "unspecified"; else e.video.parameters.bitrate = i.parameters && i.parameters.bitrate || "unspecified";
                        e.video.parameters.bitrate = e.video.parameters.bitrate || "unspecified", e.video.parameters.resolution = e.video.parameters.resolution || i.parameters.resolution, e.video.parameters.framerate = e.video.parameters.framerate || i.parameters.framerate, e.video.parameters.keyFrameInterval = e.video.parameters.keyFrameInterval || i.parameters.keyFrameInterval
                    } else e.video.parameters = i.parameters; else e.video.parameters && 0 < Object.keys(e.video.parameters).length ? (e.video.parameters.resolution || e.video.parameters.framerate ? e.video.parameters.bitrate = e.video.parameters.bitrate || i.parameters && i.parameters.bitrate || "unspecified" : e.video.parameters.bitrate ? i.parameters && i.parameters.bitrate && (e.video.parameters.bitrate = i.parameters.bitrate * Number(e.video.parameters.bitrate.substring(1))) : e.video.parameters.bitrate = "unspecified", e.video.parameters.resolution = e.video.parameters.resolution || i.parameters && i.parameters.resolution || "unspecified", e.video.parameters.framerate = e.video.parameters.framerate || i.parameters && i.parameters.framerate || "unspecified", e.video.parameters.keyFrameInterval = e.video.parameters.keyFrameInterval || i.parameters && i.parameters.keyFrameInterval || "unspecified") : e.video.parameters = {
                        resolution: "unspecified",
                        framerate: "unspecified",
                        bitrate: "unspecified",
                        keyFrameInterval: "unspecified"
                    }
                }
                if (e.audio) {
                    if (void 0 === b[e.audio.from]) return Promise.reject("Audio source early released");
                    i = b[e.audio.from].media.audio;
                    e.audio.format = e.audio.format || i.format, t.audio.format = e.audio.format, t.audio.status = e.audio.status || "active"
                }
                var d = !!l[n.owner].isPublishPermitted("audio");
                return new Promise(function (i, a) {
                    g && g.subscribe(n.owner, r, o, e, n.type, d, function () {
                        if (l[n.owner]) {
                            var e = {id: r, locality: o, media: t, info: n};
                            f[r] = e, i("ok")
                        } else g && g.unsubscribe(n.owner, r), a("Participant early left")
                    }, function (e) {
                        log.info("roomController.subscribe failed, reason: " + (e.message ? e.message : e)), a("roomController.subscribe failed, reason: " + (e.message ? e.message : e))
                    })
                })
            }, N = function (a) {
                return new Promise(function (e, i) {
                    f[a] && (f[a].isInConnecting || g && g.unsubscribe(f[a].info.owner, a), delete f[a]), e("ok")
                })
            }, F = function (e) {
                return b[e] ? "sip" === b[e].info.type ? C(e) : u.terminate(e, "in", "Participant terminate") : Promise.reject("Stream does NOT exist")
            }, T = function (e) {
                return f[e] ? "sip" === f[e].info.type ? N(e) : u.terminate(e, "out", "Participant terminate") : Promise.reject("Subscription does NOT exist")
            }, A = function () {
                setTimeout(function () {
                    var e, i = !1, a = !1;
                    for (var r in l) if ("admin" !== r) {
                        i = !0;
                        break
                    }
                    if (!i) for (var o in b) if ("forward" === b[o].type) {
                        a = !0;
                        break
                    }
                    e = 0 < Object.keys(f).length, i || a || e || (log.info("Empty room ", d, ". Deleting it"), k())
                }, 6e3)
            }, R = function () {
                return Object.keys(b).filter(function (e) {
                    return "forward" === b[e].type
                }).length
            };
        e.join = function (i, r, o) {
            var t;
            return log.debug("participant:", r, "join room:", i), h(i).then(function () {
                if (log.debug("room_config.participantLimit:", c.participantLimit, "current participants count:", Object.keys(l).length), 0 < c.participantLimit && Object.keys(l).length >= c.participantLimit + 1) return log.warn("Room is full"), o("callback", "error", "Room is full"), Promise.reject("Room is full");
                var e, i, a = c.roles.filter(function (e) {
                    return e.role === r.role
                });
                return a.length < 1 ? (o("callback", "error", "Invalid role"), Promise.reject("Invalid role")) : (t = {
                    publish: a[0].publish,
                    subscribe: a[0].subscribe
                }, i = t, l[(e = r).id] = Participant({
                    id: e.id,
                    user: e.user,
                    role: e.role,
                    portal: e.portal,
                    origin: e.origin,
                    permission: i
                }, s), c.notifying.participantActivities && I(e.id, "others", "participant", {
                    action: "join",
                    data: {id: e.id, user: e.user, role: e.role}
                }), Promise.resolve("ok"))
            }).then(function () {
                var e = [], i = [];
                for (var a in l) "admin" !== a && e.push(l[a].getInfo());
                for (var r in b) b[r].isInConnecting || i.push(b[r]);
                o("callback", {
                    permission: t, room: {
                        id: d, views: c.views.map(function (e) {
                            return e.label
                        }), participants: e, streams: i
                    }
                })
            }, function (e) {
                log.warn("Participant " + r.id + " join room " + i + " failed, err:", e), o("callback", "error", "Joining room failed")
            })
        }, e.leave = function (i, a) {
            return log.debug("leave, participantId:", i), u && g ? void 0 === l[i] ? a("callback", "error", "Participant has not joined") : u.participantLeave(i).then(function (e) {
                return r(i)
            }).then(function (e) {
                a("callback", "ok"), A()
            }, function (e) {
                a("callback", "error", e.message ? e.message : e)
            }) : a("callback", "error", "Controllers are not ready")
        }, e.onSessionSignaling = function (e, i, a) {
            return u && g ? u.onSessionSignaling(e, i).then(function (e) {
                a("callback", "ok")
            }, function (e) {
                a("callback", "error", e.message ? e.message : e)
            }) : a("callback", "error", "Controllers are not ready")
        }, e.publish = function (e, i, a, r) {
            return log.debug("publish, participantId:", e, "streamId:", i, "pubInfo:", JSON.stringify(a)), u && g ? void 0 === l[e] ? (log.info("Participant " + e + "has not joined"), r("callback", "error", "Participant has not joined")) : a.media.audio && !l[e].isPublishPermitted("audio") || a.media.video && !l[e].isPublishPermitted("video") ? r("callback", "error", "unauthorized") : 0 <= c.inputLimit && c.inputLimit <= R() ? r("callback", "error", "Too many inputs") : b[i] ? r("callback", "error", "Stream exists") : a.media.audio && !c.mediaIn.audio.length ? r("callback", "error", "Audio is forbiden") : a.media.video && !c.mediaIn.video.length ? r("callback", "error", "Video is forbiden") : "sip" === a.type ? j(i, a.locality, a.media, {
                owner: e,
                type: "sip"
            }).then(function (e) {
                r("callback", e)
            }).catch(function (e) {
                r("callback", "error", e.message ? e.message : e)
            }) : ("webrtc" === a.type && (o = {}, a.media.audio && (o.audio = {optional: c.mediaIn.audio}), a.media.video && (o.video = {optional: c.mediaIn.video})), S(i, {
                owner: e,
                type: a.type
            }), u.initiate(e, i, "in", l[e].getOrigin(), a, o).then(function (e) {
                r("callback", e)
            }).catch(function (e) {
                C(i), r("callback", "error", e.message ? e.message : e)
            })) : r("callback", "error", "Controllers are not ready");
            var o
        }, e.unpublish = function (e, i, a) {
            return log.debug("unpublish, participantId:", e, "streamId:", i), u && g ? void 0 === l[e] ? a("callback", "error", "Participant has not joined") : F(i).then(function (e) {
                a("callback", e)
            }).catch(function (e) {
                a("callback", "error", e.message ? e.message : e)
            }) : a("callback", "error", "Controllers are not ready")
        };
        var V = function (e, i, a) {
            return b[i.from] && b[i.from].media.audio ? !(i.format && (r = b[i.from].media.audio, o = i.format, !(isAudioFmtCompatible(r.format, o) || r.optional && r.optional.format && 0 <= r.optional.format.findIndex(function (e) {
                return isAudioFmtCompatible(e, o)
            })))) || (a && (a.message = "Format is not acceptable"), !1) : (a && (a.message = "Requested audio stream"), !1);
            var r, o
        }, D = function (e, i) {
            return e.width === i.width && e.height === i.height
        }, L = function (e, i, a) {
            if (!b[i.from] || !b[i.from].media.video) return a && (a.message = "Requested video stream"), !1;
            if (i.format && (r = b[i.from].media.video, o = i.format, !(isVideoFmtCompatible(r.format, o) || r.optional && r.optional.format && 0 < r.optional.format.filter(function (e) {
                return isVideoFmtCompatible(e, o)
            }).length))) return a && (a.message = "Format is not acceptable"), !1;
            var r, o, t, n, s, d, m, u, c, l;
            if (i.parameters) {
                if (i.parameters.resolution && (c = b[i.from].media.video, l = i.parameters.resolution, !(c.parameters && c.parameters.resolution && D(c.parameters.resolution, l) || c.optional && c.optional.parameters && c.optional.parameters.resolution && 0 <= c.optional.parameters.resolution.findIndex(function (e) {
                    return D(e, l)
                })))) return a && (a.message = "Resolution is not acceptable"), !1;
                if (i.parameters.framerate && (m = b[i.from].media.video, u = i.parameters.framerate, !(m.parameters && m.parameters.framerate && m.parameters.framerate === u || m.optional && m.optional.parameters && m.optional.parameters.framerate && 0 <= m.optional.parameters.framerate.findIndex(function (e) {
                    return e === u
                })))) return a && (a.message = "Framerate is not acceptable"), !1;
                if ("x1.0" !== i.parameters.bitrate && "x1" !== i.parameters.bitrate || (i.parameters.bitrate = void 0), i.parameters.bitrate && (s = b[i.from].media.video, d = i.parameters.bitrate, !(s.optional && s.optional.parameters && s.optional.parameters.bitrate && 0 <= s.optional.parameters.bitrate.findIndex(function (e) {
                    return e === d
                })))) return a && (a.message = "Bitrate is not acceptable"), !1;
                if (i.parameters.keyFrameInterval && (t = b[i.from].media.video, n = i.parameters.keyFrameInterval, !(t.parameters && t.parameters.resolution && t.parameters.keyFrameInterval === n || t.optional && t.optional.parameters && t.optional.parameters.keyFrameInterval && 0 <= t.optional.parameters.keyFrameInterval.findIndex(function (e) {
                    return e === n
                })))) return a && (a.message = "KeyFrameInterval is not acceptable"), !1
            }
            return !0
        };
        e.subscribe = function (i, a, r, o) {
            if (log.debug("subscribe, participantId:", i, "subscriptionId:", a, "subDesc:", JSON.stringify(r)), !u || !g) return o("callback", "error", "Controllers are not ready");
            if (void 0 === l[i]) return log.info("Participant " + i + "has not joined"), o("callback", "error", "Participant has not joined");
            if (r.media.audio && !l[i].isSubscribePermitted("audio") || r.media.video && !l[i].isSubscribePermitted("video")) return o("callback", "error", "unauthorized");
            if (f[a]) return o("callback", "error", "Subscription exists");
            var e, t = {message: ""};
            if (r.media.audio && !V(r.type, r.media.audio, t)) return o("callback", "error", "Target audio stream does NOT satisfy:" + t.message);
            if (r.media.video && !L(r.type, r.media.video, t)) return o("callback", "error", "Target video stream does NOT satisfy:" + t.message);
            if ("sip" === r.type) return O(a, r.locality, r.media, {owner: i, type: "sip"}).then(function (e) {
                o("callback", e)
            }).catch(function (e) {
                o("callback", "error", e.message ? e.message : e)
            });
            if ("webrtc" === r.type) {
                if (e = {}, r.media.audio) {
                    var n = b[r.media.audio.from].media.audio;
                    "forward" === b[r.media.audio.from].type ? (e.audio = {preferred: n.format}, n.optional && n.optional.format && (e.audio.optional = n.optional.format)) : (e.audio = {optional: [n.format]}, n.optional && n.optional.format && (e.audio.optional = e.audio.optional.concat(n.optional.format)))
                }
                if (r.media.video) {
                    n = b[r.media.video.from].media.video;
                    "forward" === b[r.media.video.from].type ? (e.video = {preferred: n.format}, n.optional && n.optional.format && (e.video.optional = n.optional.format)) : (e.video = {optional: [n.format]}, n.optional && n.optional.format && (e.video.optional = e.video.optional.concat(n.optional.format)))
                }
            }
            if ("recording" === r.type) {
                var s, d = "none-aac";
                if (r.media.audio && "pcmu" !== (d = r.media.audio.format ? r.media.audio.format.codec : b[r.media.audio.from].media.audio.format.codec) && "pcma" !== d && "opus" !== d && "aac" !== d) return Promise.reject("Audio codec invalid");
                r.media.video && (s = r.media.video.format && r.media.video.format.codec || b[r.media.video.from].media.video.format.codec), r.connection.container && "auto" !== r.connection.container || (r.connection.container = "aac" !== d || s && "h264" !== s && "h265" !== s ? "mkv" : "mp4")
            }
            if ("streaming" === r.type) {
                if (r.media.audio && !r.media.audio.format) {
                    var m = c.mediaOut.audio.find(function (e) {
                        return "aac" === e.codec
                    });
                    if (!m) return Promise.reject("Audio codec aac not enabled");
                    r.media.audio.format = m
                }
                if (r.media.audio && "aac" !== r.media.audio.format.codec) return Promise.reject("Audio codec invalid");
                if (r.media.video && !r.media.video.format && (r.media.video.format = {codec: "h264"}), r.media.video && "h264" !== r.media.video.format.codec) return Promise.reject("Video codec invalid")
            }
            return x(a, r, {owner: i, type: r.type}), u.initiate(i, a, "out", l[i].getOrigin(), r, e).then(function (e) {
                if (r.media.audio && !b[r.media.audio.from] || r.media.video && !b[r.media.video.from]) return u.terminate(i, a, "Participant terminate"), Promise.reject("Target audio/video stream early released");
                o("callback", e)
            }).catch(function (e) {
                N(a), o("callback", "error", e.message ? e.message : e)
            })
        }, e.unsubscribe = function (e, i, a) {
            return log.debug("unsubscribe, participantId:", e, "subscriptionId:", i), u && g ? void 0 === l[e] ? a("callback", "error", "Participant has not joined") : T(i).then(function (e) {
                a("callback", e)
            }).catch(function (e) {
                a("callback", "error", e.message ? e.message : e)
            }) : a("callback", "error", "Controllers are not ready")
        };
        var M = function (a, r) {
            return -1 !== b[a].info.inViews.indexOf(r) ? Promise.resolve("ok") : new Promise(function (e, i) {
                g.mix(a, r, function () {
                    -1 === b[a].info.inViews.indexOf(r) && b[a].info.inViews.push(r), e("ok")
                }, function (e) {
                    log.info("roomController.mix failed, reason:", e), i(e)
                })
            })
        }, q = function (a, r) {
            return new Promise(function (e, i) {
                g.unmix(a, r, function () {
                    b[a].info.inViews.splice(b[a].info.inViews.indexOf(r), 1), e("ok")
                }, function (e) {
                    log.info("roomController.unmix failed, reason:", e), i(e)
                })
            })
        }, J = function (i, a, e) {
            if ("mixed" === b[i].type) return Promise.reject("Stream is Mixed");
            var r = "audio" === a || "av" === a, o = "video" === a || "av" === a, t = e ? "inactive" : "active";
            return r && !b[i].media.audio ? Promise.reject("Stream does NOT contain audio track") : o && !b[i].media.video ? Promise.reject("Stream does NOT contain video track") : u.setMute(i, a, e).then(function () {
                r && (b[i].media.audio.status = t), o && (b[i].media.video.status = t), g.updateStream(i, a, t);
                var e = "av" === a ? ["audio.status", "video.status"] : [a + ".status"];
                return c.notifying.streamChange && e.forEach(function (e) {
                    I("room", "all", "stream", {status: "update", id: i, data: {field: e, value: t}})
                }), "ok"
            }, function (e) {
                return log.warn("accessController set mute failed:", e), Promise.reject(e)
            })
        }, E = function (a, r, o) {
            return new Promise(function (e, i) {
                g.setRegion(a, r, o, function () {
                    e("ok")
                }, function (e) {
                    log.info("roomController.setRegion failed, reason:", e), i(e)
                })
            })
        };
        e.streamControl = function (e, i, a, r) {
            if (log.debug("streamControl, participantId:", e, "streamId:", i, "command:", JSON.stringify(a)), !u || !g) return r("callback", "error", "Controllers are not ready");
            if (void 0 === l[e]) return r("callback", "error", "Participant has not joined");
            if (void 0 === b[i]) return log.info("Stream " + i + " does not exist"), r("callback", "error", "Stream does NOT exist");
            if (b[i].info.owner !== e && "admin" !== l[e].getInfo().role) return r("callback", "error", "unauthorized");
            var o, t, n;
            switch (a.operation) {
                case"mix":
                    o = M(i, a.data);
                    break;
                case"unmix":
                    o = q(i, a.data);
                    break;
                case"set-region":
                    o = E(i, a.data.region, a.data.view);
                    break;
                case"get-region":
                    t = i, n = a.data, o = new Promise(function (i, a) {
                        g.getRegion(t, n, function (e) {
                            i({region: e})
                        }, function (e) {
                            log.info("roomController.getRegion failed, reason:", e), a(e)
                        })
                    });
                    break;
                case"pause":
                    o = J(i, a.data, !0);
                    break;
                case"play":
                    o = J(i, a.data, !1);
                    break;
                default:
                    o = Promise.reject("Invalid stream control operation")
            }
            return o.then(function (e) {
                r("callback", e)
            }, function (e) {
                log.info("streamControl failed", e), r("callback", "error", e.message ? e.message : e)
            })
        };
        var _ = function (i, e) {
            var a = f[i], r = JSON.parse(JSON.stringify(a)), o = !1;
            if (e.audio) {
                if (!a.media.audio) return Promise.reject("Target audio stream does NOT satisfy");
                r.media.audio = r.media.audio || {}, e.audio.from && e.audio.from !== r.media.audio.from && (r.media.audio.from = e.audio.from, o = !0)
            }
            if (e.video) {
                if (!a.media.video) return Promise.reject("Target video stream does NOT satisfy");
                r.media.video = r.media.video || {}, e.video.from && e.video.from !== r.media.video.from && (r.media.video.from = e.video.from, o = !0), e.video.parameters && 0 < Object.keys(e.video.parameters).length && (r.media.video.parameters = r.media.video.parameters || {}, a.media.video.parameters = a.media.video.parameters || {}, a.media.video.parameters.resolution = a.media.video.parameters.resolution || {}, !e.video.parameters.resolution || e.video.parameters.resolution.width === a.media.video.parameters.resolution.width && e.video.parameters.resolution.height === a.media.video.parameters.resolution.height || (r.media.video.parameters.resolution = e.video.parameters.resolution, o = !0), e.video.parameters.framerate && e.video.parameters.framerate !== a.media.video.parameters.framerate && (r.media.video.parameters.framerate = e.video.parameters.framerate, o = !0), e.video.parameters.bitrate && e.video.parameters.bitrate !== a.media.video.parameters.bitrate && (r.media.video.parameters.bitrate = e.video.parameters.bitrate, o = !0), e.video.parameters.keyFrameInterval && e.video.parameters.keyFrameInterval !== a.media.video.parameters.keyFrameInterval && (r.media.video.parameters.keyFrameInterval = e.video.parameters.keyFrameInterval, o = !0))
            }
            return o ? r.media.video && !L(r.info.type, r.media.video) ? Promise.reject("Target video stream does NOT satisfy") : r.media.audio && !V(r.info.type, r.media.audio) ? Promise.reject("Target audio stream does NOT satisfy") : N(i).then(function (e) {
                return O(i, r.locality, r.media, r.info)
            }).catch(function (e) {
                return log.info("Update subscription failed:", e.message ? e.message : e), log.info("And is recovering the previous subscription:", JSON.stringify(a)), O(i, a.locality, a.media, a.info).then(function () {
                    return Promise.reject("Update subscription failed")
                }, function () {
                    return Promise.reject("Update subscription failed")
                })
            }) : Promise.resolve("ok")
        }, U = function (e, i, a) {
            var r = "audio" === i || "av" === i, o = "video" === i || "av" === i, t = a ? "active" : "inactive";
            return r && !f[e].media.audio ? Promise.reject("Subscription does NOT contain audio track") : o && !f[e].media.video ? Promise.reject("Subscription does NOT contain video track") : u.setMute(e, i, a).then(function () {
                return r && (f[e].media.audio.status = t), o && (f[e].media.video.status = t), "ok"
            })
        };
        e.subscriptionControl = function (e, i, a, r) {
            if (log.debug("subscriptionControl, participantId:", e, "subscriptionId:", i, "command:", JSON.stringify(a)), void 0 === l[e]) return r("callback", "error", "Participant has not joined");
            if (!f[i]) return r("callback", "error", "Subscription does NOT exist");
            if (f[i].info.owner !== e && "admin" !== l[e].getInfo().role) return r("callback", "error", "unauthorized");
            var o;
            switch (a.operation) {
                case"update":
                    o = _(i, a.data);
                    break;
                case"pause":
                    o = U(i, a.data, !0);
                    break;
                case"play":
                    o = U(i, a.data, !1);
                    break;
                default:
                    o = Promise.reject("Invalid subscription control operation")
            }
            return o.then(function (e) {
                r("callback", e)
            }, function (e) {
                r("callback", "error", e.message ? e.message : e)
            })
        }, e.text = function (e, i, a, r) {
            return void 0 === l[e] ? r("callback", "error", "Participant has not joined") : "all" !== i && void 0 === l[i] ? r("callback", "error", "Target participant does NOT exist: " + i) : (I(e, i, "text", {
                from: e,
                to: "all" === i ? "all" : "me",
                message: a
            }), void r("callback", "ok"))
        }, e.onSessionProgress = function (e, i, a) {
            log.debug("onSessionProgress, sessionId:", e, "direction:", i, "sessionStatus:", a), u && u.onSessionStatus(e, a)
        }, e.onMediaUpdate = function (e, i, a) {
            var r, o;
            log.debug("onMediaUpdate, sessionId:", e, "direction:", i, "mediaUpdate:", a), "in" === i && b[e] && "forward" === b[e].type && (o = a, b[r = e] && "forward" === b[r].type && o && o.video && b[r].media.video && (o.video.parameters && o.video.parameters.resolution && (b[r].media.video.parameters = b[r].media.video.parameters || {}, b[r].media.video.parameters.resolution && b[r].media.video.parameters.resolution.width === o.video.parameters.resolution.width && b[r].media.video.parameters.resolution.height === o.video.parameters.resolution.height || (b[r].media.video.parameters.resolution = o.video.parameters.resolution, c.transcoding.video && c.transcoding.video.parameters && c.transcoding.video.parameters.resolution && (b[r].media.video.optional = b[r].media.video.optional || {}, b[r].media.video.optional.parameters = b[r].media.video.optional.parameters || {}, b[r].media.video.optional.parameters.resolution = c.mediaOut.video.parameters.resolution.map(function (e) {
                return calcResolution(e, b[r].media.video.parameters.resolution)
            }).filter(function (i, e, a) {
                return i.width < b[r].media.video.parameters.resolution.width && i.height < b[r].media.video.parameters.resolution.height && a.findIndex(function (e) {
                    return e.width === i.width && e.height === i.height
                }) === e
            })))), c.notifying.streamChange && I("room", "all", "stream", {
                id: r,
                status: "update",
                data: {field: ".", value: b[r]}
            })), g && g.updateStreamInfo(e, a))
        }, e.onVideoLayoutChange = function (e, i, a, r) {
            if (log.debug("onVideoLayoutChange, roomId:", e, "layout:", i, "view:", a), d === e && g) {
                var o = g.getMixedStream(a);
                b[o] ? (b[o].info.layout = i, c.notifying.streamChange && I("room", "all", "stream", {
                    status: "update",
                    id: o,
                    data: {field: "video.layout", value: i}
                }), r("callback", "ok")) : r("callback", "error", "no mixed stream.")
            } else r("callback", "error", "room is not in service")
        }, e.onAudioActiveness = function (e, i, a, r) {
            if (log.debug("onAudioActiveness, roomId:", e, "activeInputStream:", i, "view:", a), d === e && g) {
                c.views.forEach(function (e) {
                    e.label === a && e.video.keepActiveInputPrimary && g.setPrimary(i, a)
                });
                var o = void 0;
                for (var t in b) if ("forward" === b[t].type && t === i) {
                    o = t;
                    break
                }
                if (o) for (var t in b) if ("mixed" === b[t].type && b[t].info.label === a) {
                    b[t].info.activeInput !== o && (b[t].info.activeInput = o, c.notifying.streamChange && I("room", "all", "stream", {
                        id: t,
                        status: "update",
                        data: {field: "activeInput", value: o}
                    }));
                    break
                }
                r("callback", "ok")
            } else log.info("onAudioActiveness, room does not exist"), r("callback", "error", "room is not in service")
        }, e.getParticipants = function (e) {
            log.debug("getParticipants, room_id:", d);
            var i = [];
            for (var a in l) "admin" !== a && i.push(l[a].getDetail());
            e("callback", i)
        }, e.controlParticipant = function (i, e, a) {
            return log.debug("controlParticipant", i, "authorities:", e), void 0 === l[i] && a("callback", "error", "Participant does NOT exist"), Promise.all(e.map(function (e) {
                return l[i] ? l[i].update(e.op, e.path, e.value) : Promise.reject("Participant left")
            })).then(function () {
                a("callback", l[i].getDetail())
            }, function (e) {
                a("callback", "error", e.message ? e.message : e)
            })
        };
        var a = function (i) {
            if (log.debug("doDropParticipant", i), l[i] && "admin" !== i) {
                var a = l[i].getInfo();
                return l[i].drop().then(function (e) {
                    return r(i), a
                }).catch(function (e) {
                    return log.warn("doDropParticipant fail:", e), Promise.reject("Drop participant failed")
                })
            }
            return Promise.reject("Participant does NOT exist")
        };
        e.dropParticipant = function (e, i) {
            return log.debug("dropParticipant", e), a(e).then(function (e) {
                i("callback", e)
            }).catch(function (e) {
                i("callback", "error", e.message ? e.message : e)
            })
        }, e.getStreams = function (e) {
            log.debug("getStreams, room_id:", d);
            var i = [];
            for (var a in b) b[a].isInConnecting || i.push(b[a]);
            e("callback", i)
        }, e.getStreamInfo = function (e, i) {
            log.debug("getStreamInfo, room_id:", d, "streamId:", e), b[e] && !b[stream_id].isInConnecting ? i("callback", b[e]) : i("callback", "error", "Stream does NOT exist")
        }, e.addStreamingIn = function (e, i, a) {
            if (log.debug("addStreamingIn, roomId:", e, "pubInfo:", JSON.stringify(i)), "streaming" === i.type) {
                var o = Math.round(1e18 * Math.random()) + "";
                return h(e).then(function () {
                    return 0 <= c.inputLimit && c.inputLimit <= R() ? Promise.reject("Too many inputs") : i.media.audio && !c.mediaIn.audio.length ? Promise.reject("Audio is forbiden") : i.media.video && !c.mediaIn.video.length ? Promise.reject("Video is forbiden") : (S(o, {
                        owner: "admin",
                        type: i.type
                    }), u.initiate("admin", o, "in", l.admin.getOrigin(), i))
                }).then(function (e) {
                    return "ok"
                }).then(function () {
                    return new Promise(function (e, i) {
                        var a = 0, r = setInterval(function () {
                            1420 < a || !b[o] ? (clearInterval(r), u.terminate("admin", o, "Participant terminate"), C(o), i("Access timeout")) : b[o] && !b[o].isInConnecting ? (clearInterval(r), e("ok")) : a += 1
                        }, 60)
                    })
                }).then(function () {
                    a("callback", b[o])
                }).catch(function (e) {
                    a("callback", "error", e.message ? e.message : e), C(o), A()
                })
            }
            a("callback", "error", "Invalid publication type")
        };
        var z = function (e) {
            if ("0" === e) return {numerator: 0, denominator: 1};
            if ("1" === e) return {numerator: 1, denominator: 1};
            var i = e.split("/");
            return 2 === i.length && !isNaN(i[0]) && !isNaN(i[1]) && Number(i[0]) <= Number(i[1]) ? {
                numerator: Number(i[0]),
                denominator: Number(i[1])
            } : null
        }, B = function (e) {
            if ("string" != typeof e.id || "" === e.id || "rectangle" !== e.shape || "object" !== _typeof(e.area)) return null;
            var i = z(e.area.left), a = z(e.area.top), r = z(e.area.width), o = z(e.area.height);
            return i && a && r && o ? {id: e.id, shape: e.shape, area: {left: i, top: a, width: r, height: o}} : null
        };
        e.controlStream = function (p, e, i) {
            log.debug("controlStream", p, "commands:", e), void 0 === b[p] && i("callback", "error", "Stream does NOT exist");
            var v = [];
            return Promise.all(e.map(function (e) {
                if (void 0 === b[p]) return Promise.reject("Stream does NOT exist");
                var i, r, o;
                switch (e.op) {
                    case"add":
                        i = "/info/inViews" === e.path ? M(p, e.value) : Promise.reject("Invalid path");
                        break;
                    case"remove":
                        i = "/info/inViews" === e.path ? q(p, e.value) : Promise.reject("Invalid path");
                        break;
                    case"replace":
                        if ("/media/audio/status" !== e.path || "inactive" !== e.value && "active" !== e.value) if ("/media/video/status" !== e.path || "inactive" !== e.value && "active" !== e.value) if ("/info/layout" === e.path) if ("mixed" === b[p].type) if (e.value instanceof Array) {
                            var a = 65535, t = !1, n = !1, s = !0, d = !0;
                            for (var m in e.value) {
                                if (65535 !== a || e.value[m].stream || (a = m), e.value[m].stream && a < m) {
                                    t = !0;
                                    break
                                }
                                for (var u = 0; u < m; u++) e.value[u].stream && e.value[u].stream === e.value[m].stream && (n = !0);
                                if (e.value[m].stream && (!b[e.value[m].stream] || "forward" !== b[e.value[m].stream].type)) {
                                    s = !1;
                                    break
                                }
                                var c = B(e.value[m].region);
                                if (!c) {
                                    d = !1;
                                    break
                                }
                                for (u = 0; u < m; u++) if (e.value[u].region.id === c.id) {
                                    d = !1;
                                    break
                                }
                                if (!d) break;
                                e.value[m].region = c
                            }
                            t ? i = Promise.reject("Stream ID hole is not allowed") : n ? i = Promise.reject("Stream ID duplicates") : s ? d ? (r = p, o = e.value, i = new Promise(function (i, a) {
                                g.setLayout(b[r].info.label, o, function (e) {
                                    b[r] ? (b[r].info.layout = e, i("ok")) : a("stream early terminated")
                                }, function (e) {
                                    log.info("roomController.setLayout failed, reason:", e), a(e)
                                })
                            })) : i = Promise.reject("Invalid region") : i = Promise.reject("Invalid input stream id")
                        } else i = Promise.reject("Invalid value"); else i = Promise.reject("Not mixed stream"); else if (e.path.startsWith("/info/layout/") && b[e.value] && "mixed" !== b[e.value].type) {
                            var l = e.path.split("/"), f = b[p].info.layout;
                            i = f && f[Number(l[3])] ? E(e.value, f[Number(l[3])].region.id, b[p].info.label) : Promise.reject("Not mixed stream or invalid region")
                        } else i = Promise.reject("Invalid path or value"); else b[p].media.video ? (b[p].media.video.status !== e.value && v.push({
                            track: "video",
                            mute: "inactive" === e.value
                        }), i = Promise.resolve("ok")) : i = Promise.reject("Track does NOT exist"); else b[p].media.audio ? (b[p].media.audio.status !== e.value && v.push({
                            track: "audio",
                            mute: "inactive" === e.value
                        }), i = Promise.resolve("ok")) : i = Promise.reject("Track does NOT exist");
                        break;
                    default:
                        i = Promise.reject("Invalid stream control operation")
                }
                return i
            })).then(function () {
                return Promise.all(v.map(function (e) {
                    return J(p, e.track, e.mute)
                }))
            }).then(function () {
                i("callback", b[p])
            }, function (e) {
                log.warn("failed in controlStream, reason:", e.message ? e.message : e), i("callback", "error", e.message ? e.message : e)
            })
        }, e.deleteStream = function (e, i) {
            return log.debug("deleteStream, streamId:", e), u && g ? b[e] ? F(e).then(function (e) {
                i("callback", e), A()
            }).catch(function (e) {
                i("callback", "error", e.message ? e.message : e)
            }) : i("callback", "error", "Stream does NOT exist") : i("callback", "error", "Controllers are not ready")
        };
        var K = function (e) {
            var i = {id: e, media: f[e].media};
            return "streaming" === f[e].info.type ? i.url = f[e].info.url : "recording" === f[e].info.type && (i.storage = f[e].info.location), i
        };
        return e.getSubscriptions = function (e, i) {
            log.debug("getSubscriptions, room_id:", d, "type:", e);
            var a = [];
            for (var r in f) f[r].info.type !== e || f[r].isInConnecting || a.push(K(r));
            i("callback", a)
        }, e.getSubscriptionInfo = function (e, i) {
            log.debug("getSubscriptionInfo, room_id:", d, "subId:", e), f[e] && !f[sub_id].isInConnecting ? i("callback", K(e)) : i("callback", "error", "Stream does NOT exist")
        }, e.addServerSideSubscription = function (e, o, i) {
            if (log.debug("addServerSideSubscription, roomId:", e, "subDesc:", JSON.stringify(o)), "streaming" === o.type || "recording" === o.type) {
                var t = Math.round(1e18 * Math.random()) + "";
                return h(e).then(function () {
                    if (o.media.audio && !c.mediaOut.audio.length) return Promise.reject("Audio is forbiden");
                    if (o.media.video && !c.mediaOut.video.format.length) return Promise.reject("Video is forbiden");
                    var e = {message: ""};
                    if (o.media.audio && !V(o.type, o.media.audio, e)) return Promise.reject("Target audio stream does NOT satisfy:" + e.message);
                    if (o.media.video && !L(o.type, o.media.video, e)) return Promise.reject("Target video stream does NOT satisfy:" + e.message);
                    if ("recording" === o.type) {
                        var i, a = "none-aac";
                        if (o.media.audio && "pcmu" !== (a = o.media.audio.format ? o.media.audio.format.codec : b[o.media.audio.from].media.audio.format.codec) && "pcma" !== a && "opus" !== a && "aac" !== a) return Promise.reject("Audio codec invalid");
                        o.media.video && (i = o.media.video.format && o.media.video.format.codec || b[o.media.video.from].media.video.format.codec), o.connection.container && "auto" !== o.connection.container || (o.connection.container = "aac" !== a || i && "h264" !== i && "h265" !== i ? "mkv" : "mp4")
                    }
                    if ("streaming" === o.type) {
                        if (o.media.audio && !o.media.audio.format) {
                            var r = c.mediaOut.audio.find(function (e) {
                                return "aac" === e.codec
                            });
                            if (!r) return Promise.reject("Audio codec aac not enabled");
                            o.media.audio.format = r
                        }
                        if (o.media.audio && "aac" !== o.media.audio.format.codec) return Promise.reject("Audio codec invalid");
                        if (o.media.video && !o.media.video.format && (o.media.video.format = {
                            codec: "h264",
                            profile: "CB"
                        }), o.media.video && "h264" !== o.media.video.format.codec) return Promise.reject("Video codec invalid")
                    }
                    return x(t, o, {owner: "admin", type: o.type}), u.initiate("admin", t, "out", l.admin.getOrigin(), o)
                }).then(function () {
                    return o.media.audio && !b[o.media.audio.from] || o.media.video && !b[o.media.video.from] ? (u.terminate(participantId, subscriptionId, "Participant terminate"), Promise.reject("Target audio/video stream early released")) : new Promise(function (e, i) {
                        var a = 0, r = setInterval(function () {
                            300 < a || !f[t] ? (clearInterval(r), u.terminate("admin", t, "Participant terminate"), N(t), i("Access timeout")) : f[t] && !f[t].isInConnecting ? (clearInterval(r), e("ok")) : a += 1
                        }, 60)
                    })
                }).then(function () {
                    i("callback", K(t))
                }).catch(function (e) {
                    i("callback", "error", e.message ? e.message : e), N(t), A()
                })
            }
            i("callback", "error", "Invalid subscription type")
        }, e.controlSubscription = function (a, e, i) {
            var r;
            log.debug("controlSubscription", a, "commands:", e), void 0 === f[a] && i("callback", "error", "Subscription does NOT exist");
            var o = [];
            return Promise.all(e.map(function (e) {
                var i;
                switch (e.op) {
                    case"replace":
                        "/media/audio/status" !== e.path || !f[a].media.audio || "inactive" !== e.value && "active" !== e.value ? "/media/video/status" !== e.path || !f[a].media.video || "inactive" !== e.value && "active" !== e.value ? "/media/audio/from" === e.path && b[e.value] ? ((r = r || {}).audio = r.audio || {}, r.audio.from = e.value, i = Promise.resolve("ok")) : "/media/video/from" === e.path && b[e.value] ? ((r = r || {}).video = r.video || {}, r.video.from = e.value, i = Promise.resolve("ok")) : "/media/video/parameters/resolution" === e.path ? ((r = r || {}).video = r.video || {}, r.video.parameters = r.video.parameters || {}, r.video.parameters.resolution = e.value, i = Promise.resolve("ok")) : "/media/video/parameters/framerate" === e.path ? ((r = r || {}).video = r.video || {}, r.video.parameters = r.video.parameters || {}, r.video.parameters.framerate = Number(e.value), i = Promise.resolve("ok")) : "/media/video/parameters/bitrate" === e.path ? ((r = r || {}).video = r.video || {}, r.video.parameters = r.video.parameters || {}, r.video.parameters.bitrate = e.value, i = Promise.resolve("ok")) : "/media/video/parameters/keyFrameInterval" === e.path ? ((r = r || {}).video = r.video || {}, r.video.parameters = r.video.parameters || {}, r.video.parameters.keyFrameInterval = e.value, i = Promise.resolve("ok")) : i = Promise.reject("Invalid path or value") : (f[a].media.video.status !== e.value && o.push({
                            track: "video",
                            mute: "inactive" === e.value
                        }), i = Promise.resolve("ok")) : (f[a].media.audio.status !== e.value && o.push({
                            track: "audio",
                            mute: "inactive" === e.value
                        }), i = Promise.resolve("ok"));
                        break;
                    default:
                        i = Promise.reject("Invalid subscription control operation")
                }
                return i
            })).then(function () {
                return Promise.all(o.map(function (e) {
                    return U(a, e.track, e.mute)
                }))
            }).then(function () {
                return r ? _(a, r) : "ok"
            }).then(function () {
                f[a] ? i("callback", K(a)) : i("callback", "error", "Subscription does NOT exist")
            }, function (e) {
                i("callback", "error", e.message ? e.message : e)
            })
        }, e.deleteSubscription = function (e, i) {
            return log.debug("deleteSubscription, subId:", e), u && g ? T(e).then(function (e) {
                i("callback", e), A()
            }).catch(function (e) {
                i("callback", "error", e.message ? e.message : e)
            }) : i("callback", "error", "Controllers are not ready")
        }, e.destroy = function (e) {
            log.info("Destroy room:", d), k(), e("callback", "Success")
        }, e.onFaultDetected = function (e) {
            "portal" === e.purpose || "sip" === e.purpose ? function (e) {
                for (var i in l) l[i].getPortal() === e && a(i)
            }(e.id) : "webrtc" === e.purpose || "recording" === e.purpose || "streaming" === e.purpose ? u && u.onFaultDetected(e.type, e.id) : "audio" !== e.purpose && "video" !== e.purpose || g && g.onFaultDetected(e.purpose, e.type, e.id)
        }, e
    };
module.exports = function (e, i) {
    var a = {}, r = Conference(e, i);
    return a.rpcAPI = {
        join: r.join,
        leave: r.leave,
        text: r.text,
        publish: r.publish,
        unpublish: r.unpublish,
        streamControl: r.streamControl,
        subscribe: r.subscribe,
        unsubscribe: r.unsubscribe,
        subscriptionControl: r.subscriptionControl,
        onSessionSignaling: r.onSessionSignaling,
        onSessionProgress: r.onSessionProgress,
        onMediaUpdate: r.onMediaUpdate,
        onSessionAudit: r.onSessionAudit,
        onAudioActiveness: r.onAudioActiveness,
        onVideoLayoutChange: r.onVideoLayoutChange,
        getParticipants: r.getParticipants,
        controlParticipant: r.controlParticipant,
        dropParticipant: r.dropParticipant,
        getStreams: r.getStreams,
        getStreamInfo: r.getStreamInfo,
        addStreamingIn: r.addStreamingIn,
        controlStream: r.controlStream,
        deleteStream: r.deleteStream,
        getSubscriptions: r.getSubscriptions,
        getSubscriptionInfo: r.getSubscriptionInfo,
        addServerSideSubscription: r.addServerSideSubscription,
        controlSubscription: r.controlSubscription,
        deleteSubscription: r.deleteSubscription,
        destroy: r.destroy
    }, a.onFaultDetected = r.onFaultDetected, a
};