"use strict";
var log = require("./logger").logger.getLogger("V10Client"), requestData = require("./requestDataValidator"),
    idPattern = /^[0-9a-zA-Z\-]+$/;

function isValidIdString(e) {
    return "string" == typeof e && idPattern.test(e)
}

function safeCall() {
    var e = arguments[0];
    if ("function" == typeof e) {
        var n = Array.prototype.slice.call(arguments, 1);
        e.apply(null, n)
    }
}

var getErrorMessage = function (e) {
    return "string" == typeof e ? e : e && e.message ? e.message : (log.debug("Unknown error:", e), "Unknown")
}, V10Client = function (r, e, i) {
    var a = {id: r, connection: e}, s = function (t, o) {
        return function (e) {
            var n = getErrorMessage(e);
            log.error(t + " failed:", n), safeCall(o, "error", n)
        }
    }, t = /^[0-9a-zA-Z\-]+$/, o = function (e, n) {
        return "string" == typeof n && t.test(n) ? Promise.resolve(n) : Promise.reject("Invalid " + e)
    }, n = function (e) {
        e.on("text", function (e, n) {
            return a.inRoom ? (t = e, "" === t.to || "string" != typeof t.to ? Promise.reject("Invalid receiver") : Promise.resolve(t)).then(function (e) {
                return i.text(r, e.to, e.message)
            }).then(function (e) {
                safeCall(n, "ok")
            }).catch(s("text", n)) : safeCall(n, "error", "Illegal request");
            var t
        }), e.on("publish", function (e, n) {
            if (!a.inRoom) return safeCall(n, "error", "Illegal request");
            var t, o = Math.round(1e18 * Math.random()) + "";
            return (t = e, requestData.validate("publication-request", t)).then(function (e) {
                return e.type = "webrtc", i.publish(r, o, e)
            }).then(function (e) {
                safeCall(n, "ok", {id: o})
            }).catch(s("publish", n))
        }), e.on("unpublish", function (e, n) {
            return a.inRoom ? o("stream id", e.id).then(function (e) {
                return i.unpublish(r, e)
            }).then(function (e) {
                safeCall(n, "ok")
            }).catch(s("unpublish", n)) : safeCall(n, "error", "Illegal request")
        }), e.on("stream-control", function (e, n) {
            return a.inRoom ? (t = e, o("stream id", t.id).then(function () {
                return requestData.validate("stream-control-info", t)
            })).then(function (e) {
                return i.streamControl(r, e.id, {operation: e.operation, data: e.data})
            }).then(function (e) {
                safeCall(n, "ok", e)
            }).catch(s("stream-control", n)) : safeCall(n, "error", "Illegal request");
            var t
        }), e.on("subscribe", function (e, n) {
            if (!a.inRoom) return safeCall(n, "error", "Illegal request");
            var t, o = Math.round(1e18 * Math.random()) + "";
            return (t = e, t.media && (t.media.audio || t.media.video) ? requestData.validate("subscription-request", t) : Promise.reject("Bad subscription request")).then(function (e) {
                return e.type = "webrtc", i.subscribe(r, o, e)
            }).then(function (e) {
                safeCall(n, "ok", {id: o})
            }).catch(s("subscribe", n))
        }), e.on("unsubscribe", function (e, n) {
            return a.inRoom ? o("subscription id", e.id).then(function (e) {
                return i.unsubscribe(r, e)
            }).then(function (e) {
                safeCall(n, "ok")
            }).catch(s("unsubscribe", n)) : safeCall(n, "error", "Illegal request")
        }), e.on("subscription-control", function (e, n) {
            return a.inRoom ? (t = e, o("subscription id", t.id).then(function () {
                return requestData.validate("subscription-control-info", t)
            })).then(function (e) {
                return i.subscriptionControl(r, e.id, {operation: e.operation, data: e.data})
            }).then(function (e) {
                safeCall(n, "ok")
            }).catch(s("subscription-control", n)) : safeCall(n, "error", "Illegal request");
            var t
        }), e.on("soac", function (e, n) {
            return a.inRoom ? (t = e, o("session id", t.id).then(function () {
                return "offer" === t.signaling.type || "answer" === t.signaling.type || "candidate" === t.signaling.type ? Promise.resolve(t) : Promise.reject("Invalid signaling type")
            })).then(function (e) {
                return i.onSessionSignaling(r, e.id, e.signaling)
            }).then(function (e) {
                safeCall(n, "ok")
            }).catch(s("soac", n)) : safeCall(n, "error", "Illegal request");
            var t
        })
    };
    return a.notify = function (e, n) {
        var t, o;
        t = e, o = n, a.connection.sendMessage(t, o)
    }, a.join = function (e) {
        return i.join(r, e).then(function (e) {
            return a.inRoom = e.data.room.id, a.tokenCode = e.tokenCode, e.data.id = a.id, e.data
        })
    }, a.leave = function () {
        if (a.inRoom) return i.leave(a.id).catch(function () {
            a.inRoom = void 0, a.tokenCode = void 0
        })
    }, a.resetConnection = function (e) {
        return a.connection.close(!1), a.connection = e, n(a.connection.socket), Promise.resolve("ok")
    }, a.drop = function () {
        a.connection.sendMessage("drop"), a.leave(), a.connection.close(!0)
    }, n(a.connection.socket), a
};
module.exports = V10Client;