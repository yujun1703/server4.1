"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e
} : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}, url = require("url"), log = require("./logger").logger.getLogger("LegacyClient"), resolutionName2Value = {
    cif: {width: 352, height: 288},
    vga: {width: 640, height: 480},
    svga: {width: 800, height: 600},
    xga: {width: 1024, height: 768},
    r640x360: {width: 640, height: 360},
    hd720p: {width: 1280, height: 720},
    sif: {width: 320, height: 240},
    hvga: {width: 480, height: 320},
    r480x360: {width: 480, height: 360},
    qcif: {width: 176, height: 144},
    r192x144: {width: 192, height: 144},
    hd1080p: {width: 1920, height: 1080},
    uhd_4k: {width: 3840, height: 2160},
    r360x360: {width: 360, height: 360},
    r480x480: {width: 480, height: 480},
    r720x720: {width: 720, height: 720}
}, resolutionValue2Name = {
    r352x288: "cif",
    r640x480: "vga",
    r800x600: "svga",
    r1024x768: "xga",
    r640x360: "r640x360",
    r1280x720: "hd720p",
    r320x240: "sif",
    r480x320: "hvga",
    r480x360: "r480x360",
    r176x144: "qcif",
    r192x144: "r192x144",
    r1920x1080: "hd1080p",
    r3840x2160: "uhd_4k",
    r360x360: "r360x360",
    r480x480: "r480x480",
    r720x720: "r720x720"
};

function widthHeight2Resolution(e, r) {
    var o = "r" + e + "x" + r;
    return resolutionValue2Name[o] ? resolutionValue2Name[o] : o
}

function resolution2WidthHeight(e) {
    var r = e.indexOf("r"), o = e.indexOf("x"), a = 0 === r && 1 < o ? Number(e.substring(1, o)) : 640,
        t = 0 === r && 1 < o ? Number(e.substring(o, e.length)) : 480;
    return resolutionName2Value[e] ? resolutionName2Value[e] : {width: a, height: t}
}

var ql2brl = {bestquality: "x1.4", betterquality: "x1.2", standard: void 0, betterspeed: "x0.8", bestspeed: "x0.6"};

function qualityLevel2BitrateLevel(e) {
    return e = e.toLowerCase(), ql2brl[e] ? ql2brl[e] : void 0
}

var idPattern = /^[0-9a-zA-Z\-]+$/;

function isValidIdString(e) {
    return "string" == typeof e && idPattern.test(e)
}

var formatDate = function (e, r) {
    var o = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "h+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        "S+": e.getMilliseconds()
    };
    for (var a in/(y+)/i.test(r) && (r = r.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))), o) new RegExp("(" + a + ")").test(r) && (r = r.replace(RegExp.$1, 1 == RegExp.$1.length ? o[a] : ("00" + o[a]).substr(("" + o[a]).length)));
    return r
};

function safeCall() {
    var e = arguments[0];
    if ("function" == typeof e) {
        var r = Array.prototype.slice.call(arguments, 1);
        e.apply(null, r)
    }
}

var getErrorMessage = function (e) {
    return "string" == typeof e ? e : e && e.message ? e.message : (log.debug("Unknown error:", e), "Unknown")
}, LegacyClient = function (l, e, d) {
    var u = {id: l, connection: e}, i = {}, c = {}, f = {}, t = function (e) {
        var r = e.indexOf("-");
        return 0 <= r && r < e.length - 1 ? e.substring(r + 1) : e
    }, n = function (e, r) {
        u.connection.sendMessage(e, r)
    }, r = function (e) {
        e.on("publish", function (r, e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            var a = Math.round(1e18 * Math.random()) + "", t = {};
            if ("erizo" === r.state) t.type = "webrtc", t.media = {
                audio: !1 !== r.audio && {source: "mic"},
                video: !1 !== r.video && {
                    source: r.video && "screen" === r.video.device ? "screen-cast" : "camera",
                    parameters: {framerate: 0}
                }
            }, t.media.video && t.media.video.parameters && (t.media.video.parameters.resolution = {
                width: 0,
                height: 0
            }); else {
                if ("url" !== r.state) return safeCall(o, "error", "stream type(options.state) error.");
                t.type = "streaming", t.connection = {
                    url: e,
                    transportProtocol: r.transport || "tcp",
                    bufferSize: r.bufferSize || 2048
                }, t.media = {
                    audio: void 0 === r.audio ? "auto" : !!r.audio,
                    video: void 0 === r.video ? "auto" : !!r.video
                }
            }
            return r.attributes && (t.attributes = r.attributes), d.publish(l, a, t).then(function (e) {
                "erizo" === r.state ? (safeCall(o, "initializing", a), i[a] = {
                    type: "webrtc",
                    mix: !(r.unmix || r.video && "screen" === r.video.device)
                }) : (safeCall(o, "success", a), i[a] = {type: "streamingIn", mix: !r.unmix})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.publish failed:", r), safeCall(o, "error", r)
            })
        }), e.on("unpublish", function (e, o) {
            return u.inRoom ? d.unpublish(l, e).then(function () {
                safeCall(o, "success"), i[e] && delete i[e]
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unpublish failed:", r), safeCall(o, "error", r)
            }) : safeCall(o, "error", "Illegal request")
        }), e.on("mix", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            var a = e.streamId;
            return Promise.all(e.mixStreams.map(function (e) {
                var r = t(e) || "common";
                return d.streamControl(l, a, {operation: "mix", data: r})
            })).then(function (e) {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.mix failed:", r), safeCall(o, "error", r)
            })
        }), e.on("unmix", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            var a = e.streamId;
            return Promise.all(e.mixStreams.map(function (e) {
                var r = t(e) || "common";
                return d.streamControl(l, a, {operation: "unmix", data: r})
            })).then(function (e) {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unmix failed:", r), safeCall(o, "error", r)
            })
        }), e.on("setVideoBitrate", function (e, r) {
            safeCall(r, "error", "No longer supported signaling")
        }), e.on("subscribe", function (e, r, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (!isValidIdString(e.streamId)) return safeCall(o, "error", "Invalid stream id");
            var a = e.streamId;
            if (c[a]) return safeCall(o, "error", "Subscription is ongoing");
            var t = Math.round(1e18 * Math.random()) + "";
            c[a] = t, f[t] = a;
            var i = {type: "webrtc", media: {}};
            return (e.audio || void 0 === e.audio) && (i.media.audio = {from: e.streamId}), (e.video || void 0 === e.video) && (i.media.video = {from: e.streamId}), e.video && e.video.resolution && "number" == typeof e.video.resolution.width && "number" == typeof e.video.resolution.height && (i.media.video.parameters || (i.media.video.parameters = {})) && (i.media.video.parameters.resolution = e.video.resolution), e.video && "string" == typeof e.video.resolution && (i.media.video.parameters || (i.media.video.parameters = {})) && (i.media.video.parameters.resolution = resolution2WidthHeight(e.video.resolution)), e.video && e.video.quality_level && (i.media.video.parameters || (i.media.video.parameters = {})) && (i.media.video.parameters.bitrate = qualityLevel2BitrateLevel(e.video.quality_level)), i.media.audio || i.media.video ? d.subscribe(l, t, i).then(function (e) {
                safeCall(o, "initializing", a), log.debug("portal.subscribe succeeded")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.subscribe failed:", r), safeCall(o, "error", r)
            }) : safeCall(o, "error", "bad options")
        }), e.on("unsubscribe", function (e, o) {
            if (log.debug("on:unsubscribe, streamId:", e), !u.inRoom) return safeCall(o, "error", "Illegal request");
            var r = e;
            if (!c[r]) return safeCall(o, "error", "Subscription does NOT exist");
            var a = c[r];
            return delete c[r], delete f[a], d.unsubscribe(l, a).then(function () {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unsubscribe failed:", r), safeCall(o, "error", r)
            })
        }), e.on("signaling_message", function (e, r, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            var a = c[e.streamId] ? c[e.streamId] : e.streamId;
            a && d.onSessionSignaling(l, a, e.msg), safeCall(o, "ok")
        }), e.on("addExternalOutput", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (log.debug("Add serverUrl:", e.url, "options:", e), "string" != typeof e.url || "" === e.url) return safeCall(o, "error", "Invalid RTSP/RTMP server url");
            var r = url.parse(e.url);
            if ("rtsp:" !== r.protocol && "rtmp:" !== r.protocol && "http:" !== r.protocol || !r.slashes || !r.host) return safeCall(o, "error", "Invalid RTSP/RTMP server url");
            if (void 0 !== e.streamId && !isValidIdString(e.streamId)) return safeCall(o, "error", "Invalid stream id");
            var a = r.format();
            if (c[a]) return safeCall(o, "error", "Streaming-out is ongoing");
            var t = Math.round(1e18 * Math.random()) + "";
            c[a] = t, f[t] = a;
            var i = e.streamId || u.commonViewStream, n = {
                type: "streaming",
                media: {
                    audio: !1 !== e.audio && {
                        from: i,
                        format: {codec: e.audio && e.audio.codecs ? e.audio.codecs[0] : "aac"}
                    },
                    video: !1 !== e.video && {
                        from: i,
                        format: {codec: e.video && e.video.codecs ? e.video.codecs[0] : "h264"}
                    }
                },
                connection: {url: r.format()}
            };
            return n.media.audio && n.media.audio.format && ("aac" === n.media.audio.format.codec || "opus" === n.media.audio.format.codec) && (n.media.audio.format.sampleRate = 48e3, n.media.audio.format.channelNum = 2), n.media.video && e.resolution && "number" == typeof e.resolution.width && "number" == typeof e.resolution.height && (n.media.video.parameters || (n.media.video.parameters = {})) && (n.media.video.parameters.resolution = e.resolution), n.media.video && "string" == typeof e.resolution && (n.media.video.parameters || (n.media.video.parameters = {})) && (n.media.video.parameters.resolution = resolution2WidthHeight(e.resolution)), d.subscribe(l, t, n).then(function (e) {
                log.debug("portal.subscribe succeeded"), safeCall(o, "success", {url: n.connection.url})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.subscribe failed:", r), safeCall(o, "error", r)
            })
        }), e.on("updateExternalOutput", function (r, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (log.debug("Update serverUrl:", r.url, "options:", r), "string" != typeof r.url || "" === r.url) return safeCall(o, "error", "Invalid RTSP/RTMP server url");
            var e = url.parse(r.url);
            if ("rtsp:" !== e.protocol && "rtmp:" !== e.protocol && "http:" !== e.protocol || !e.slashes || !e.host) return safeCall(o, "error", "Invalid RTSP/RTMP server url");
            if (void 0 !== r.streamId && !isValidIdString(r.streamId)) return safeCall(o, "error", "Invalid stream id");
            var a = r.url, t = c[a];
            if (!t) return safeCall(o, "error", "Streaming-out does NOT exist");
            var i = {};
            return r.streamId ? (i.audio = {from: r.streamId}, i.video = {from: r.streamId}) : (i.audio = {from: u.commonViewStream}, i.video = {from: u.commonViewStream}), r.resolution && (i.video = i.video || {}, i.video.parameters = {}, "number" == typeof r.resolution.width && "number" == typeof r.resolution.height && (i.video.parameters.resolution = r.resolution), "string" == typeof r.resolution && (i.video.parameters.resolution = resolution2WidthHeight(r.resolution))), d.subscriptionControl(l, t, {
                operation: "update",
                data: i
            }).then(function (e) {
                safeCall(o, "success", {url: r.url})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.subscriptionControl failed:", r), safeCall(o, "error", r)
            })
        }), e.on("removeExternalOutput", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (log.debug("Remove serverUrl:", e.url, "options:", e), "string" != typeof e.url || "" === e.url) return safeCall(o, "error", "Invalid RTSP/RTMP server url");
            var r = e.url;
            if (!c[r]) return safeCall(o, "error", "Streaming-out does NOT exist");
            var a = c[r];
            return delete c[r], delete f[a], d.unsubscribe(l, a).then(function () {
                safeCall(o, "success", {url: e.url})
            }, function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unsubscribe failed:", r), safeCall(o, "error", "Invalid RTSP/RTMP server url")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unsubscribe failed:", r), safeCall(o, "error", r)
            })
        }), e.on("startRecorder", function (o, a) {
            if (!u.inRoom) return safeCall(a, "error", "Illegal request");
            if (void 0 !== o.recorderId && !isValidIdString(o.recorderId)) return safeCall(a, "error", "Invalid recorder id");
            if (void 0 !== o.audioStreamId && !isValidIdString(o.audioStreamId)) return safeCall(a, "error", "Invalid audio stream id");
            if (void 0 !== o.videoStreamId && !isValidIdString(o.videoStreamId)) return safeCall(a, "error", "Invalid video stream id");
            var e = void 0 === o.audioStreamId && void 0 === o.videoStreamId;
            if ((o.audioStreamId || e) && void 0 !== o.audioCodec && ["pcmu", "opus", "aac"].indexOf(o.audioCodec) < 0) return safeCall(a, "error", "Invalid audio codec");
            if ((o.videoStreamId || e) && void 0 !== o.videoCodec && ["vp8", "h264"].indexOf(o.videoCodec) < 0) return safeCall(a, "error", "Invalid video codec");
            if (o.recorderId) {
                if (void 0 === o.audioStreamId && void 0 === o.videoStreamId && (o.audioStreamId = u.commonViewStream, o.videoStreamId = u.commonViewStream), !c[o.recorderId]) return safeCall(a, "error", "Recording does NOT exist");
                var t = o.recorderId, r = {operation: "update", data: {}};
                return o.audioStreamId && (r.data.audio = {from: o.audioStreamId}), o.videoStreamId && (r.data.video = {from: o.videoStreamId}), d.subscriptionControl(l, t, r).then(function (e) {
                    safeCall(a, "success", {recorderId: o.recorderId, path: ""})
                }).catch(function (e) {
                    var r = getErrorMessage(e);
                    log.info("portal.subscribe failed:", r), safeCall(a, "error", r)
                })
            }
            var i = Math.round(1e18 * Math.random()) + "";
            t = i;
            c[i] = t, f[t] = i;
            var n, s = {type: "recording", media: {audio: !1, video: !1}, connection: {container: "auto"}};
            return (o.audioStreamId || e) && (s.media.audio = {from: o.audioStreamId || u.commonViewStream}), s.media.audio && (s.media.audio.format = (n = o.audioCodec) ? "opus" === n || "aac" === n ? {
                codec: n,
                sampleRate: 48e3,
                channelNum: 2
            } : {codec: n} : {
                codec: "opus",
                sampleRate: 48e3,
                channelNum: 2
            }), (o.videoStreamId || e) && (s.media.video = {from: o.videoStreamId || u.commonViewStream}), s.media.video && (s.media.video.format = {codec: o.videoCodec || "vp8"}), d.subscribe(l, t, s).then(function (e) {
                log.debug("portal.subscribe succeeded, result:", e);
                var r = "aac" !== o.audioCodec || o.videoCodec && "h264" !== o.videoCodec ? "mkv" : "mp4";
                safeCall(a, "success", {recorderId: i, path: t + "." + r, host: "unknown"})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.subscribe failed:", r), safeCall(a, "error", r)
            })
        }), e.on("stopRecorder", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (void 0 === e.recorderId || !isValidIdString(e.recorderId)) return safeCall(o, "error", "Invalid recorder id");
            var r = e.recorderId;
            if (!c[r]) return safeCall(o, "error", "Recording does NOT exist");
            var a = c[r];
            return delete c[r], delete f[a], d.unsubscribe(l, a).then(function () {
                safeCall(o, "success", {recorderId: e.recorderId, host: "unknown"})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.unsubscribe failed:", r), safeCall(o, "error", r)
            })
        }), e.on("getRegion", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (!isValidIdString(e.id)) return safeCall(o, "error", "Invalid stream id");
            var r = e.mixStreamId ? t(e.mixStreamId) : "common";
            return d.streamControl(l, e.id, {operation: "get-region", data: r}).then(function (e) {
                safeCall(o, "success", {region: e.region})
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.streamControl failed:", r), safeCall(o, "error", r)
            })
        }), e.on("setRegion", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            if (!isValidIdString(e.id)) return safeCall(o, "error", "Invalid stream id");
            if (!isValidIdString(e.region)) return safeCall(o, "error", "Invalid region id");
            var r = e.mixStreamId ? t(e.mixStreamId) : "common";
            return d.streamControl(l, e.id, {
                operation: "set-region",
                data: {view: r, region: e.region}
            }).then(function () {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.streamControl failed:", r), safeCall(o, "error", r)
            })
        }), e.on("mute", function (e, o) {
            return u.inRoom ? e.streamId ? ["video", "audio", "av"].indexOf(e.track) < 0 ? safeCall(o, "error", "invalid track " + e.track) : d.streamControl(l, e.streamId, {
                operation: "pause",
                data: e.track
            }).then(function () {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.streamControl failed:", r), safeCall(o, "error", r)
            }) : safeCall(o, "error", "no stream ID") : safeCall(o, "error", "Illegal request")
        }), e.on("unmute", function (e, o) {
            return u.inRoom ? e.streamId ? ["video", "audio", "av"].indexOf(e.track) < 0 ? safeCall(o, "error", "invalid track " + e.track) : d.streamControl(l, e.streamId, {
                operation: "play",
                data: e.track
            }).then(function () {
                safeCall(o, "success")
            }).catch(function (e) {
                var r = getErrorMessage(e);
                log.info("portal.streamControl failed:", r), safeCall(o, "error", r)
            }) : safeCall(o, "error", "no stream ID") : safeCall(o, "error", "Illegal request")
        }), e.on("setPermission", function (e, r) {
            return u.inRoom ? e.targetId ? e.action ? void safeCall(r, "error", "Please use REST interface to set permissions") : safeCall(r, "error", "no action specified") : safeCall(r, "error", "no targetId specified") : safeCall(r, "error", "Illegal request")
        }), e.on("customMessage", function (e, o) {
            if (!u.inRoom) return safeCall(o, "error", "Illegal request");
            switch (e.type) {
                case"data":
                    return "string" != typeof e.receiver || "" === e.receiver ? safeCall(o, "error", "Invalid receiver") : d.text(l, e.receiver, e.data).then(function () {
                        safeCall(o, "success")
                    }).catch(function (e) {
                        var r = getErrorMessage(e);
                        log.info("portal.text failed:", r), safeCall(o, "error", r)
                    });
                case"control":
                    if ("object" !== _typeof(e.payload)) return safeCall(o, "error", "Invalid payload");
                    if (!isValidIdString(e.payload.streamId)) return safeCall(o, "error", "Invalid connection id");
                    if ("string" != typeof e.payload.action || !/^((audio)|(video))-((in)|(out))-((on)|(off))$/.test(e.payload.action)) return safeCall(o, "error", "Invalid action");
                    var r = e.payload.action.split("-"), a = r[0], t = (r[1], "on" === r[2] ? "play" : "pause");
                    if ("out" === r[1]) return d.streamControl(l, e.payload.streamId, {
                        operation: t,
                        data: a
                    }).then(function () {
                        safeCall(o, "success")
                    }).catch(function (e) {
                        var r = getErrorMessage(e);
                        log.info("portal.streamControl failed:", r), safeCall(o, "error", r)
                    });
                    var i = e.payload.streamId, n = c[i];
                    return void 0 === n ? safeCall(o, "error", "Subscription does NOT exist") : d.subscriptionControl(l, n, {
                        operation: t,
                        data: a
                    }).then(function () {
                        safeCall(o, "success")
                    }).catch(function (e) {
                        var r = getErrorMessage(e);
                        log.info("portal.subscriptionControl failed:", r), safeCall(o, "error", r)
                    });
                default:
                    return safeCall(o, "error", "Invalid message type")
            }
        })
    }, a = function (e) {
        var r = function (e) {
            return e.numerator / e.denominator
        };
        return {
            streamID: e.stream,
            id: e.region.id,
            left: r(e.region.area.left),
            top: r(e.region.area.top),
            relativeSize: r(e.region.area.width)
        }
    }, s = function (e) {
        var r = {id: e.id, audio: !!e.media.audio, video: !!e.media.video && {}, socket: ""};
        return e.info.attributes && (r.attributes = e.info.attributes), "mixed" === e.type ? (r.view = e.info.label, r.video.layout = e.info.layout.map(a), "common" === e.info.label && (u.commonViewStream = e.id), r.from = "") : r.from = e.info.owner, e.media.video && ("mixed" === e.type ? (r.video.device = "mcu", r.video.resolutions = [e.media.video.parameters.resolution], e.media.video.optional && e.media.video.optional.parameters && e.media.video.optional.parameters.resolution && e.media.video.optional.parameters.resolution.forEach(function (e) {
            r.video.resolutions.push(e)
        })) : "screen-cast" === e.media.video.source ? r.video.device = "screen" : "camera" === e.media.video.source && (r.video.device = "camera")), r
    };
    return u.notify = function (e, r) {
        var o;
        log.debug("notify, event:", e, "data:", r), "participant" === e ? "join" === (o = r).action ? n("user_join", {
            user: {
                id: o.data.id,
                name: o.data.user,
                role: o.data.role
            }
        }) : "leave" === o.action ? n("user_leave", {user: {id: o.data}}) : log.info("Unknown participant activity message:", o) : "stream" === e ? function (e) {
            if (log.debug("notifyStreamInfo, streamInfo:", e), "add" === e.status) n("add_stream", s(e.data)); else if ("update" === e.status) {
                var r = {id: e.id};
                "audio.status" === e.data.field || "video.status" === e.data.field ? (r.event = "StateChange", r.state = e.data.value) : "video.layout" === e.data.field ? (r.event = "VideoLayoutChanged", r.data = e.data.value.map(a)) : r = void 0, r && n("update_stream", r)
            } else "remove" === e.status ? n("remove_stream", {id: e.id}) : log.info("Unknown stream info:", e)
        }(r) : "progress" === e ? function (e) {
            log.debug("notifySessionProgress, sessionProgress:", e);
            var r = e.id;
            if ("soac" === e.status) i[r] ? n("signaling_message_erizo", {
                streamId: r,
                mess: e.data
            }) : (o = f[r]) && n("signaling_message_erizo", {peerId: o, mess: e.data}); else if ("ready" === e.status) {
                var o;
                i[r] ? ("webrtc" === i[r].type && n("signaling_message_erizo", {
                    streamId: r,
                    mess: {type: "ready"}
                }), i[r].mix && d.streamControl(l, r, {operation: "mix", data: "common"}).catch(function (e) {
                    log.info("Mix stream failed, reason:", getErrorMessage(e))
                })) : (o = f[r]) && n("signaling_message_erizo", {peerId: o, mess: {type: "ready"}})
            } else if ("error" === e.status) {
                var a = f[r];
                if (a) {
                    if (a === r) {
                        var t = r;
                        log.debug("recorder error, recorder_id:", a), d.unsubscribe(l, r), n("remove_recorder", {id: t})
                    } else -1 !== a.indexOf("rtsp") || -1 !== a.indexOf("rtmp") || -1 !== a.indexOf("http") ? n("connection_failed", {url: a}) : n("connection_failed", {streamId: a});
                    delete c[a], delete f[r]
                } else n("connection_failed", {streamId: r})
            } else log.info("Unknown session progress message:", e)
        }(r) : "text" === e ? n("custom_message", {from: r.from, to: r.to, data: r.message}) : n(e, r)
    }, u.join = function (e) {
        return d.join(l, e).then(function (e) {
            return u.inRoom = e.data.room.id, u.tokenCode = e.tokenCode, r = e.data, {
                clientId: u.id,
                id: r.room.id,
                streams: r.room.streams.map(s),
                users: r.room.participants.map(function (e) {
                    return {id: e.id, name: e.user, role: e.role}
                })
            };
            var r
        })
    }, u.leave = function () {
        if (u.inRoom) return d.leave(u.id).catch(function () {
            u.inRoom = void 0, u.tokenCode = void 0
        })
    }, u.resetConnection = function (e) {
        return u.connection.close(!1), u.connection = e, r(u.connection.socket), Promise.resolve("ok")
    }, u.drop = function () {
        u.connection.sendMessage("drop"), u.leave(), u.connection.close(!0)
    }, r(u.connection.socket), u
};
module.exports = LegacyClient;