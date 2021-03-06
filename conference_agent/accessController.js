"use strict";
var path = require("path"), url = require("url"), log = require("./logger").logger.getLogger("AccessController");
module.exports.create = function (e, d, o, i, t) {
    var r = {}, c = e.clusterName, u = e.selfRpcId, p = e.inRoom, m = o, l = i, n = t, f = {}, v = function (e) {
        var o = f[e];
        "connecting" !== o.state && "connected" !== o.state || (d.terminate(o.locality.node, e, o.direction).then(function () {
            return log.debug("to recycleWorkerNode:", o.locality, "task:", e), d.recycleWorkerNode(o.locality.agent, o.locality.node, {
                room: p,
                task: e
            })
        }).catch(function (e) {
            log.debug("AccessNode not recycled", o.locality)
        }), o.state = "initialized"), delete f[e]
    };
    return r.getSessionState = function (e) {
        return f[e] && f[e].state
    }, r.onSessionStatus = function (e, o) {
        if (!f[e]) return log.error("Session does NOT exist"), Promise.reject("Session does NOT exist");
        if ("ready" === o.type) !function (e, o) {
            var i = o.audio, t = o.video, r = f[e];
            if ("webrtc" === r.options.type) {
                if (r.options.media.audio && !i) {
                    var n = r.owner, s = r.direction;
                    return v(e), l(n, e, s, "No proper audio codec"), log.error("No proper audio codec")
                }
                if (r.options.media.video && !t) return n = r.owner, s = r.direction, v(e), l(n, e, s, "No proper video codec"), log.error("No proper video codec")
            }
            r.state = "connected";
            var a = {}, d = {type: r.options.type, owner: r.owner};
            "in" === r.direction ? (r.options.media.audio && (a.audio = !!i && (i || {})), a.audio && r.options.media.audio && r.options.media.audio.source && (a.audio.source = r.options.media.audio.source), r.options.media.video && (a.video = !!t && (t || {})), a.video && r.options.media.video && r.options.media.video.source && (a.video.source = r.options.media.video.source), a.video && r.options.media.video && r.options.media.video.parameters && r.options.media.video.parameters.resolution && (a.video.resolution = r.options.media.video.parameters.resolution), a.video && r.options.media.video && r.options.media.video.parameters && r.options.media.video.parameters.framerate && (a.video.framerate = r.options.media.video.parameters.framerate), r.options.attributes && (d.attributes = r.options.attributes)) : (r.options.media.audio && (a.audio = {from: r.options.media.audio.from}, r.options.media.audio.format && (a.audio.format = r.options.media.audio.format), "webrtc" === r.options.type && (a.audio.format = i)), r.options.media.video && (a.video = {from: r.options.media.video.from}, r.options.media.video.format && (a.video.format = r.options.media.video.format), "webrtc" === r.options.type && (a.video.format = t), r.options.media.video.parameters && (a.video.parameters = r.options.media.video.parameters)), "recording" === r.options.type && (d.location = o.info), "streaming" === r.options.type && (d.url = o.info));
            var c = {locality: r.locality, media: a, info: d};
            m(r.owner, e, r.direction, c)
        }(e, o); else if ("failed" === o.type) !function (e, o) {
            log.info("onFailed, sessionId:", e, "reason:", o);
            var i = f[e].owner, t = f[e].direction;
            v(e), l(i, e, t, o)
        }(e, o.reason); else {
            if ("offer" !== o.type && "answer" !== o.type && "candidate" !== o.type) return log.error("Irrispective status:" + o.type), Promise.reject("Irrispective status");
            t = o, n(f[i = e].owner, i, t)
        }
        var i, t;
        return Promise.resolve("ok")
    }, r.onSessionSignaling = function (o, e) {
        return f[o] ? d.onSessionSignaling(f[o].locality.node, o, e).catch(function (e) {
            return v(o), Promise.reject(e.message ? e.message : e)
        }) : Promise.reject("Session " + o + " does NOT exist")
    }, r.participantLeave = function (e) {
        for (var o in log.debug("participantLeave, participantId:", e), f) if (f[o].owner === e) {
            var i = f[o].direction;
            v(o), l(e, o, i, "Participant leave")
        }
        return Promise.resolve("ok")
    }, r.initiate = function (i, t, r, e, n, s) {
        return log.debug("initiate, participantId:", i, "sessionId:", t, "direction:", r, "origin:", e, "sessionOptions:", n), f[t] ? Promise.reject("Session exists") : (f[t] = {
            owner: i,
            direction: r,
            options: n,
            state: "initialized"
        }, d.getWorkerNode(c, n.type, {room: p, task: t}, e).then(function (e) {
            if (a = e, log.debug("getWorkerNode ok, participantId:", i, "sessionId:", t, "locality:", a), void 0 === f[t]) return log.debug("Session has been aborted, sessionId:", t), d.recycleWorkerNode(a.agent, a.node, {
                room: p,
                task: t
            }).catch(function (e) {
                log.debug("AccessNode not recycled", a)
            }), Promise.reject("Session has been aborted");
            f[t].locality = a;
            var o = {controller: u};
            return n.connection && (o.connection = n.connection), n.media && (o.media = n.media), s && (o.formatPreference = s), d.initiate(a.node, t, n.type, r, o)
        }).then(function () {
            return log.debug("Initiate ok, participantId:", i, "sessionId:", t), void 0 === f[t] ? (log.debug("Session has been aborted, sessionId:", t), d.terminate(a.node, t, r).catch(function (e) {
                log.debug("Terminate fail:", e)
            }), d.recycleWorkerNode(a.agent, a.node, {room: p, task: t}).catch(function (e) {
                log.debug("AccessNode not recycled", a)
            }), Promise.reject("Session has been aborted")) : (f[t].state = "connecting", "ok")
        }, function (e) {
            return delete f[t], Promise.reject(e.message ? e.message : e)
        }));
        var a
    }, r.terminate = function (e, o, i) {
        log.debug("terminate, sessionId:", e, "direction:", o);
        var t = f[e];
        return void 0 === t || f[e].direction !== o ? Promise.reject("Session does NOT exist") : (v(e), l(t.owner, e, t.direction, i), Promise.resolve("ok"))
    }, r.setMute = function (e, o, i) {
        if (log.debug("setMute, sessionId:", e, "muted:", i), !f[e]) return Promise.reject("Session does NOT exist");
        var t = f[e], r = i ? "off" : "on";
        return "webrtc" !== t.options.type ? Promise.reject("Session does NOT support muting") : d.mediaOnOff(t.locality.node, e, o, t.direction, r)
    }, r.onFaultDetected = function (e, o) {
        for (var i in f) {
            var t = f[i].locality;
            if (t && (s = t, d = o, "worker" === (a = e) && s.agent === d || "node" === a && s.node === d)) {
                var r = f[i].owner, n = f[i].direction;
                log.info("Fault detected on node:", t), v(i), l(r, i, n, "Access node exited unexpectedly")
            }
        }
        var s, a, d;
        return Promise.resolve("ok")
    }, r.destroy = function () {
        for (var e in f) {
            var o = f[e].owner, i = f[e].direction;
            v(e), l(o, e, i, "Room destruction")
        }
    }, r
};