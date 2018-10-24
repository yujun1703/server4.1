"use strict";
var path = require("path"), url = require("url"), crypto = require("crypto"),
    log = require("./logger").logger.getLogger("Portal"), dataAccess = require("./data_access"),
    Portal = function (e, g) {
        var r = {}, p = e.tokenKey, b = e.clusterName, m = e.selfRpcId, h = {};
        return r.updateTokenKey = function (e) {
            p = e
        }, r.join = function (r, e) {
            if (log.debug("participant[", r, "] join with token:", JSON.stringify(e)), h[r]) return Promise.reject("Participant already in room");
            var o, t, n, i, s, a, c, u, l, d;
            return (c = e, l = (u = c).tokenId + "," + u.host, d = crypto.createHmac("sha256", p).update(l).digest("hex"), new Buffer(d).toString("base64") !== c.signature ? Promise.reject("Invalid token signature") : Promise.resolve(c)).then(function (e) {
                return log.debug("token validation ok."), dataAccess.token.delete(e.tokenId)
            }).then(function (e) {
                return log.debug("login ok.", e), o = e.code, t = e.user, n = e.role, i = e.origin, s = e.room, g.getController(b, s)
            }).then(function (e) {
                return log.debug("got controller:", e), a = e, g.join(e, s, {
                    id: r,
                    user: t,
                    role: n,
                    portal: m,
                    origin: i
                })
            }).then(function (e) {
                return log.debug("join ok, result:", e), h[r] = {in_room: s, controller: a}, {
                    tokenCode: o,
                    data: {user: t, role: n, permission: e.permission, room: e.room}
                }
            })
        }, r.leave = function (e) {
            return log.debug("participant leave:", e), h[e] ? (g.leave(h[e].controller, e).catch(function (e) {
                log.info("Failed in leaving, ", e.message ? e.message : e)
            }), delete h[e], Promise.resolve("ok")) : Promise.reject("Participant has NOT joined")
        }, r.publish = function (e, r, o) {
            return log.debug("publish, participantId:", e, "streamId:", r, "pubInfo:", o), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.publish(h[e].controller, e, r, o)
        }, r.unpublish = function (e, r) {
            return log.debug("unpublish, participantId:", e, "streamId:", r), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.unpublish(h[e].controller, e, r)
        }, r.streamControl = function (e, r, o) {
            return log.debug("streamControl, participantId:", e, "streamId:", r, "command:", o), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.streamControl(h[e].controller, e, r, o)
        }, r.subscribe = function (e, r, o) {
            return log.debug("subscribe, participantId:", e, "subscriptionId:", r, "subDesc:", o), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.subscribe(h[e].controller, e, r, o)
        }, r.unsubscribe = function (e, r) {
            return log.debug("unsubscribe, participantId:", e, "subscriptionId:", r), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.unsubscribe(h[e].controller, e, r)
        }, r.subscriptionControl = function (e, r, o) {
            return log.debug("subscriptionControl, participantId:", e, "subscriptionId:", r, "command:", o), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.subscriptionControl(h[e].controller, e, r, o)
        }, r.onSessionSignaling = function (e, r, o) {
            log.debug("onSessionSignaling, participantId:", e, "sessionId:", r, "signaling:", o);
            h[e];
            return void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.onSessionSignaling(h[e].controller, r, o)
        }, r.text = function (e, r, o) {
            return log.debug("text, participantId:", e, "to:", r, "msg:", o), void 0 === h[e] ? Promise.reject("Participant has NOT joined") : g.text(h[e].controller, e, r, o)
        }, r.getParticipantsByController = function (e, r) {
            var o = [];
            for (var t in h) ("node" === e && h[t].controller === r || "worker" === e && h[t].controller.startsWith(r)) && o.push(t);
            return Promise.resolve(o)
        }, r
    };
module.exports = Portal;