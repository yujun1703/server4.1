"use strict";
var logger = require("./logger").logger, makeRPC = require("./makeRPC").makeRPC,
    loadCollector = require("./loadCollector").LoadCollector, log = logger.getLogger("ClusterWorker"),
    genID = function () {
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }

        return function () {
            return e() + e() + e() + e() + e()
        }
    }();
module.exports = function (e) {
    var r, o = {}, t = "unregistered", i = [], l = e.rpcClient,
        u = e.purpose + "-" + genID() + "@" + (e.info.hostname || e.info.ip), n = e.purpose, c = e.info,
        s = e.clusterName || "woogeenCluster", a = e.joinRetry || 60, g = void 0, f = e.onJoinOK || function () {
            log.debug("Join cluster successfully.")
        }, d = e.onJoinFailed || function (e) {
            log.debug("Join cluster failed. reason:", e)
        }, v = e.onLoss || function () {
            log.debug("Lost connection with cluster manager")
        }, m = e.onRecovery || function () {
            log.debug("Rejoin cluster successfully.")
        }, C = e.onOverload || function () {
            log.debug("Overloaded!!")
        }, p = .99, k = loadCollector({
            period: e.loadCollection.period, item: e.loadCollection.item, onLoad: function (e) {
                e != p && (p = e, "registered" === t && l.remoteCast(s, "reportLoad", [u, e]), .98 < e && C())
            }
        }), R = function (o, e) {
            makeRPC(l, s, "join", [n, u, c], function (e) {
                t = "registered", o(e), p = .99, b()
            }, e)
        }, b = function () {
            g && clearInterval(g);
            var o = function (n) {
                clearInterval(g), g = void 0, t = "recovering";
                !function o() {
                    log.debug("Try rejoining cluster", s, "...."), R(function (e) {
                        log.debug("Rejoining result", e), "initializing" === e ? 0 < i.length && j(i) : (v(), i = []), n()
                    }, function (e) {
                        "recovering" === t && (log.debug("Rejoin cluster", s, "failed. reason:", e), o())
                    })
                }()
            }, n = 0;
            g = setInterval(function () {
                makeRPC(l, s, "keepAlive", [u], function (e) {
                    n = 0, "whoareyou" === e && "recovering" !== t && (log.info("Unknown by cluster manager", s), o(function () {
                        log.info("Rejoin cluster", s, "OK.")
                    }))
                }, function (e) {
                    3 < (n += 1) && "recovering" !== t && (log.info("Lost connection with cluster", s), o(function () {
                        log.info("Rejoin cluster", s, "OK."), m(u)
                    }))
                })
            }, 800)
        }, j = function (e) {
            l.remoteCast(s, "pickUpTasks", [u, e])
        };
    return o.quit = function () {
        "registered" === t ? (g && (clearInterval(g), g = void 0), l.remoteCast(s, "quit", [u])) : "recovering" === t && g && clearInterval(g), k && k.stop()
    }, o.reportState = function (e) {
        "registered" === t && l.remoteCast(s, "reportState", [u, e])
    }, o.addTask = function (e) {
        -1 === i.indexOf(e) && (i.push(e), "registered" === t && j([e]))
    }, o.removeTask = function (e) {
        var o, n = i.indexOf(e);
        -1 !== n && (i.splice(n, 1), "registered" === t && (o = e, l.remoteCast(s, "layDownTask", [u, o])))
    }, o.rejectTask = function (e) {
        var o;
        o = e, l.remoteCast(s, "unschedule", [u, o])
    }, function o(n) {
        log.debug("Try joining cluster", s, ", retry count:", r - n), R(function (e) {
            f(u), log.info("Join cluster", s, "OK.")
        }, function (e) {
            "unregistered" === t && (log.info("Join cluster", s, "failed."), n <= 0 ? (log.error("Join cluster", s, "failed. reason:", e), d(e)) : o(n - 1))
        })
    }(r = a), o
};