"use strict";
var amqp = require("amqp"), log = require("./logger").logger.getLogger("AmqpClient"), TIMEOUT = 2e3,
    REMOVAL_TIMEOUT = 6048e5, declareExchange = function (e, o, n, r, t, i) {
        var c = e.exchange(o, {type: n, autoDelete: r}, function (e) {
            log.debug("Exchange " + e.name + " is open"), !0, t(c)
        })
    }, rpcClient = function (e, o, n, r) {
        var t, u, a, i = {bus: e}, s = {}, d = 0, g = !1;
        return declareExchange(o, "woogeenRpc", "direct", !0, function (e) {
            u = e, t = o.queue("", function (e) {
                log.debug("Reply queue for rpc client " + e.name + " is open"), a = e.name, t.bind(u.name, a, function () {
                    t.subscribe(function (e) {
                        try {
                            log.debug("New message received", e), void 0 !== s[e.corrID] ? (log.debug("Callback", e.type, " - ", e.data), clearTimeout(s[e.corrID].timer), s[e.corrID].fn[e.type].call({}, e.data, e.err), s[e.corrID].fn.onStatus ? setTimeout(function () {
                                void 0 !== s[e.corrID] && delete s[e.corrID]
                            }, REMOVAL_TIMEOUT) : void 0 !== s[e.corrID] && delete s[e.corrID]) : log.warn("Late rpc reply:", e)
                        } catch (e) {
                            log.error("Error processing response: ", e)
                        }
                    }), g = !0, n()
                })
            })
        }, r), i.remoteCall = function (e, o, n, r, t) {
            if (log.debug("remoteCall, corrID:", d, "to:", e, "method:", o), g) {
                var i = d++;
                s[i] = {}, s[i].fn = r || {
                    callback: function () {
                    }
                }, s[i].timer = setTimeout(function () {
                    if (log.debug("remoteCall timeout, corrID:", i), s[i]) {
                        for (var e in s[i].fn) "function" == typeof s[i].fn[e] && s[i].fn[e]("timeout");
                        delete s[i]
                    }
                }, t || TIMEOUT), u.publish(e, {method: o, args: n, corrID: i, replyTo: a})
            } else for (var c in r) "function" == typeof r[c] && r[c]("error", "rpc client is not ready")
        }, i.remoteCast = function (e, o, n) {
            u && u.publish(e, {method: o, args: n})
        }, i.close = function () {
            for (var e in s) clearTimeout(s[e].timer);
            s = {}, t && t.destroy(), t = void 0, u && u.destroy(!0), u = void 0
        }, i
    }, rpcServer = function (e, o, n, t, r, i) {
        var c, u, a = {bus: e};
        return declareExchange(o, "woogeenRpc", "direct", !0, function (e) {
            c = e;
            u = o.queue(n, function (e) {
                log.debug("Request queue for rpc server " + e.name + " is open"), u.bind(c.name, n, function () {
                    u.subscribe(function (r) {
                        try {
                            log.debug("New message received", r), r.args = r.args || [], r.replyTo && void 0 !== r.corrID && r.args.push(function (e, o, n) {
                                c.publish(r.replyTo, {data: o, corrID: r.corrID, type: e, err: n})
                            }), "function" == typeof t[r.method] ? t[r.method].apply(t, r.args) : (log.warn("RPC server does not support this method:", r.method), r.replyTo && void 0 !== r.corrID && c.publish(r.replyTo, {
                                data: "error",
                                corrID: r.corrID,
                                type: "callback",
                                err: "Not support method"
                            }))
                        } catch (e) {
                            log.error("message:", r), log.error("Error processing call: ", e)
                        }
                    }), !0, r()
                })
            })
        }, i), a.close = function () {
            u && u.destroy(), u = void 0, c && c.destroy(!0), c = void 0
        }, a
    }, topicParticipant = function (e, o, n, r, t) {
        var i, c, u, a = {bus: e};
        return declareExchange(o, n, "topic", !1, function (e) {
            c = e;
            u = o.queue("", function (e) {
                log.debug("Message queue for topic participant is open:", e.name), !0, r()
            })
        }, t), a.subscribe = function (e, o, n) {
            u && (i = o, e.map(function (e) {
                u.bind(c.name, e, function () {
                    log.debug("Follow topic [" + e + "] ok.")
                })
            }), u.subscribe(function (o) {
                try {
                    i && i(o)
                } catch (e) {
                    log.error("Error processing topic message:", o, "and error:", e)
                }
            }), n())
        }, a.unsubscribe = function (e) {
            u && (i = void 0, e.map(function (e) {
                u.unbind(c.name, e), log.debug("Ignore topic [" + e + "]")
            }))
        }, a.publish = function (e, o) {
            c && c.publish(e, o)
        }, a.close = function () {
            u.destroy(), u = void 0, c && c.destroy(!0), c = void 0
        }, a
    }, faultMonitor = function (e, o, n, r, t) {
        var i, c, u = {bus: e}, a = n;
        return declareExchange(o, "woogeenMonitoring", "topic", !1, function (e) {
            i = e;
            c = o.queue("", function (e) {
                log.debug("Message queue for monitoring is open:", e.name), !0, c.bind(i.name, "exit.#", function () {
                    log.debug("Monitoring queue bind ok.")
                }), c.subscribe(function (o) {
                    try {
                        log.debug("received monitoring message:", o), a && a(o)
                    } catch (e) {
                        log.error("Error processing monitored message:", o, "and error:", e)
                    }
                }), r()
            })
        }, t), u.setMsgReceiver = function (e) {
            a = e
        }, u.close = function () {
            c.destroy(), c = void 0, i && i.destroy(!0), i = void 0
        }, u
    }, monitoringTarget = function (e, o, n, r) {
        var t, i = {bus: e};
        return declareExchange(o, "woogeenMonitoring", "topic", !1, function (e) {
            t = e, n()
        }, r), i.notify = function (e, o) {
            t && t.publish("exit." + e, {reason: e, message: o})
        }, i.close = function () {
            t.destroy(!0), t = void 0
        }, i
    };
module.exports = function () {
    var i, n, t, r, c, u = {}, a = {}, s = function () {
        for (var e in t && t.close(), t = void 0, n && n.close(), n = void 0, a) a[e].close();
        a = {}, r && r.close(), r = void 0, c && c.close(), c = void 0
    };
    return u.connect = function (e, o, n) {
        log.debug("Connecting to rabbitMQ server:", e);
        var r = amqp.createConnection(e), t = !1;
        r.on("ready", function () {
            log.info("Connecting to rabbitMQ server OK, hostPort:", e), i = r, t || (t = !0, o())
        }), r.on("error", function (e) {
            log.info("Connection to rabbitMQ server error", e)
        }), r.on("disconnect", function () {
            i && (s(), i = void 0, log.info("Connection to rabbitMQ server disconnected."), n("amqp connection disconnected"))
        })
    }, u.disconnect = function () {
        s(), i && i.disconnect(), i = void 0
    }, u.asRpcServer = function (e, o, n, r) {
        if (t) return n(t);
        i ? t = rpcServer(u, i, e, o, function () {
            n(t)
        }, r) : r("amqp connection not ready")
    }, u.asRpcClient = function (e, o) {
        if (n) return e(n);
        i ? n = rpcClient(u, i, function () {
            e(n)
        }, o) : o("amqp connection not ready")
    }, u.asTopicParticipant = function (e, o, n) {
        if (a[e]) return o(a[e]);
        if (i) var r = topicParticipant(u, i, e, function () {
            a[e] = r, o(r)
        }, n); else n("amqp connection not ready")
    }, u.asMonitor = function (e, o, n) {
        if (r) return r.setMsgReceiver(e), o(r);
        i ? r = faultMonitor(u, i, e, function () {
            o(r)
        }, n) : n("amqp connection not ready")
    }, u.asMonitoringTarget = function (e, o) {
        if (c) return e(c);
        i ? c = monitoringTarget(u, i, function () {
            e(c)
        }, o) : o("amqp connection not ready")
    }, u
};