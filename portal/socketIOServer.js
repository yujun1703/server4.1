"use strict";
var path = require("path"), log = require("./logger").logger.getLogger("SocketIOServer"), crypto = require("crypto"),
    vsprintf = require("sprintf-js").vsprintf, LegacyClient = require("./legacyClient"),
    V10Client = require("./v10Client");

function safeCall() {
    var e = arguments[0];
    if ("function" == typeof e) {
        var n = Array.prototype.slice.call(arguments, 1);
        e.apply(null, n)
    }
}

var getErrorMessage = function (e) {
    return "string" == typeof e ? e : e && e.message ? e.message : (log.debug("Unknown error:", e), "Unknown")
}, Connection = function (n, o, r, i, c) {
    var a, s, l, u = {socket: o}, t = null, f = [], d = {enabled: !1}, g = function (e) {
        var n = vsprintf("%s,%s,%s", [e.participantId, e.notBefore, e.notAfter]),
            t = crypto.createHmac("sha256", r).update(n).digest("hex");
        return new Buffer(t).toString("base64")
    }, p = function () {
        var e = Date.now();
        return d.ticket = {
            participantId: s,
            ticketId: Math.random().toString(36).substring(2),
            notBefore: e,
            notAfter: e + 1e3 * n.reconnectionTicketLifetime
        }, d.ticket.signature = g(d.ticket), new Buffer(JSON.stringify(d.ticket)).toString("base64")
    }, v = function () {
        log.debug("forceClientLeave, client_id:", s), s && (c.getClient(s).then(function (e) {
            e.connection === u && (e.leave(), c.onClientLeft(s))
        }), a = "initialized", s = void 0)
    }, k = function () {
        return "legacy" === l ? "success" : "ok"
    };
    return u.isInService = function () {
        return a && "initialized" !== a
    }, u.reconnect = function () {
        return log.debug("client reconnect", s), t && (clearTimeout(t), t = null), {
            pendingMessages: f,
            clientId: s,
            protocolVersion: l,
            reconnection: d
        }
    }, u.sendMessage = function (e, n) {
        if (log.debug("sendMessage, event:", e, "data:", n), "connected" === a) try {
            o.emit(e, n)
        } catch (e) {
            log.error("socket.emit error:", e.message)
        } else f.push({event: e, data: n})
    }, u.close = function (e) {
        log.debug("close it, client_id:", s), e && v(), t && clearTimeout(t), t = null;
        try {
            o.disconnect()
        } catch (e) {
            log.error("socket.emit error:", e.message)
        }
        d.enabled = !1
    }, a = "initialized", o.on("login", function (n, t) {
        if ("initialized" !== a) return safeCall(t, "error", "Connection is in service");
        var r, e;
        if (a = "connecting", s = o.id + "", void 0 === n.protocol) l = "legacy", r = new LegacyClient(s, u, i); else {
            if ("1.0" !== n.protocol) return safeCall(t, "error", "Unknown client protocol"), o.disconnect();
            if (n.userAgent && n.userAgent.sdk && "3.5" === n.userAgent.sdk.version) return safeCall(t, "error", "Deprecated client version"), o.disconnect();
            l = "1.0", r = new V10Client(s, u, i)
        }
        return (e = n.userAgent, e && e.sdk && e.sdk.version && e.sdk.type && e.runtime && e.runtime.version && e.runtime.name && e.os && e.os.version && e.os.name ? Promise.resolve("Objective-C" === e.sdk.type || "C++" === e.sdk.type || "Android" === e.sdk.type || "JavaScript" == e.sdk.type) : Promise.reject("User agent info is incorrect")).then(function (e) {
            return d.enabled = e, new Promise(function (e) {
                e(JSON.parse(new Buffer(n.token, "base64").toString()))
            })
        }).then(function (e) {
            return r.join(e)
        }).then(function (e) {
            "connecting" === a ? (d.enabled && (e.reconnectionTicket = p()), a = "connected", c.onClientJoined(s, r), safeCall(t, k(), e)) : (r.leave(s), a = "initialized", safeCall(t, "error", "Participant early left"), log.info("Login failed:", "Participant early left"), o.disconnect())
        }).catch(function (e) {
            a = "initialized";
            var n = getErrorMessage(e);
            safeCall(t, "error", n), log.info("Login failed:", n), o.disconnect()
        })
    }), o.on("relogin", function (n, t) {
        if ("initialized" !== a) return safeCall(t, "error", "Connection is in service");
        var r, i;
        a = "connecting", new Promise(function (e) {
            e(JSON.parse(new Buffer(n, "base64").toString()))
        }).then(function (e) {
            var n = Date.now();
            return e.notBefore > n || e.notAfter < n ? Promise.reject("Ticket is expired") : e.signature !== g(e) ? Promise.reject("Invalid reconnection ticket signature") : (i = e, c.getClient(e.participantId))
        }).then(function (e) {
            return (r = e).connection.reconnect()
        }).then(function (e) {
            return e.reconnection.enabled ? e.reconnection.ticket.participantId !== i.participantId ? Promise.reject("Participant ID is not matched") : (s = e.clientId + "", l = e.protocolVersion + "", f = e.pendingMessages, d.enabled = !0, r.resetConnection(u)) : Promise.reject("Reconnection is not allowed")
        }).then(function () {
            var e = p();
            a = "connected", safeCall(t, k(), e), function () {
                var e = !0, n = !1, t = void 0;
                try {
                    for (var r, i = f[Symbol.iterator](); !(e = (r = i.next()).done); e = !0) {
                        var o = r.value;
                        o && o.event && u.sendMessage(o.event, o.data)
                    }
                } catch (e) {
                    n = !0, t = e
                } finally {
                    try {
                        !e && i.return && i.return()
                    } finally {
                        if (n) throw t
                    }
                }
                f = []
            }()
        }).catch(function (e) {
            a = "initialized";
            var n = getErrorMessage(e);
            log.info("Relogin failed:", n), safeCall(t, "error", n), v(), o.disconnect()
        })
    }), o.on("refreshReconnectionTicket", function (e) {
        if ("connected" !== a) return safeCall(e, "error", "Illegal request");
        if (!d.enabled) return safeCall(e, "error", "Reconnection is not enabled.");
        var n = p();
        safeCall(e, k(), n)
    }), o.on("logout", function (e) {
        if (d.enabled = !1, a = "initialized", !s) return safeCall(e, "error", "Illegal request");
        v(), safeCall(e, k())
    }), o.on("disconnect", function (e) {
        log.debug("socket.io disconnected, reason: " + e), "connected" === a && d.enabled ? (a = "waiting_for_reconnecting", t = setTimeout(function () {
            log.info(s + " waiting for reconnecting timeout."), v()
        }, 1e3 * n.reconnectionTimeout)) : "connecting" !== a && "connected" !== a || v()
    }), u
}, SocketIOServer = function (t, r, i) {
    var u, o = {}, c = {}, a = require("crypto").randomBytes(64).toString("hex"), f = {};
    t.pingInterval && (f.pingInterval = 1e3 * t.pingInterval), t.pingTimeout && (f.pingTimeout = 1e3 * t.pingTimeout);
    var d = function () {
        u.sockets.on("connection", function (e) {
            var n = Connection(t, e, a, r, o);
            setTimeout(function () {
                n.isInService() || n.close()
            }, 18e4)
        })
    };
    return o.onClientJoined = function (e, n) {
        log.debug("onClientJoined, id:", e, "client.tokenCode:", n.tokenCode), c[e] = n, i.onJoin(n.tokenCode)
    }, o.onClientLeft = function (e) {
        log.debug("onClientLeft, id:", e), c[e] && (i.onLeave(c[e].tokenCode), delete c[e])
    }, o.getClient = function (e) {
        return c[e] ? Promise.resolve(c[e]) : Promise.reject("Client does NOT exist")
    }, o.start = function () {
        return t.ssl ? (a = t.port, s = t.keystorePath, l = t.forceTlsv12, new Promise(function (o, c) {
            var e = require("./cipher"), n = path.resolve(path.dirname(s), ".woogeen.keystore");
            e.unlock(e.k, n, function (e, n) {
                if (e) c(e); else {
                    var t = {pfx: require("fs").readFileSync(s), passphrase: n};
                    if (l) {
                        var r = require("constants");
                        t.secureOptions = r.SSL_OP_NO_TLSv1 | r.SSL_OP_NO_TLSv1_1
                    }
                    var i = require("https").createServer(t).listen(a);
                    u = require("socket.io").listen(i, f), d(), o("ok")
                }
            })
        })) : (e = t.port, n = require("http").createServer().listen(e), u = require("socket.io").listen(n, f), d(), Promise.resolve("ok"));
        var a, s, l, e, n
    }, o.stop = function () {
        for (var e in c) c[e].drop();
        c = {}, u && u.close(), u = void 0
    }, o.notify = function (e, n, t) {
        return log.debug("notify participant:", e, "event:", n, "data:", t), c[e] ? (c[e].notify(n, t), Promise.resolve("ok")) : Promise.reject("participant does not exist")
    }, o.drop = function (e) {
        if ("all" === e) for (var n in c) c[n].drop(); else c[e] ? c[e].drop() : log.debug("user not in room", e)
    }, o
};
module.exports = SocketIOServer;