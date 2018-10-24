"use strict";
var logger = require("./logger").logger, makeRPC = require("./makeRPC").makeRPC,
    log = logger.getLogger("SipErizoHelper");
module.exports = function (e) {
    var o = {}, u = {}, c = e.cluster, g = e.rpcClient, i = e.on_broken, n = function (n) {
        return function (e) {
            if (void 0 !== u[n] && (!0 === e ? u[n].kaCount = 0 : (log.debug("ErizoJS[", n, "] check alive timeout!"), u[n].kaCount += 1), 5 === u[n].kaCount)) {
                log.info("ErizoJS[", n, "] is no longer alive!");
                var o = function () {
                    u[n] && delete u[n]
                };
                makeRPC(g, u[n].agent, "recycleNode", [n, u[n].for_whom], o, o), i(n)
            }
        }
    };
    setInterval(function () {
        for (var e in u) makeRPC(g, e, "keepAlive", [], n(e), n(e))
    }, 2e3);
    return o.allocateSipErizo = function (n, i, t) {
        var e, r, a, l;
        e = n, r = function (o) {
            makeRPC(g, o.id, "getNode", [n], function (e) {
                u[e] = {
                    agent: o.id,
                    for_whom: n,
                    kaCount: 0
                }, log.info("Successully schedule sip node ", e, " for ", n), i({id: e, addr: o.addr})
            }, t)
        }, a = function (e) {
            t("Failed to get sip agent:", e)
        }, l = !0, function o(n) {
            if (n <= 0) return a("Failed in scheduling a sip agent.");
            makeRPC(g, c, "schedule", ["sip", e, "preference", 1e4], function (e) {
                r({id: e.id, addr: e.info.ip}), l = !1
            }, function (e) {
                l && (log.debug("Failed in scheduling a sip agent, keep trying."), setTimeout(function () {
                    o(n - ("string" == typeof e && e.startsWith("Timeout") ? 6 : 1))
                }, 200))
            })
        }(25)
    }, o.deallocateSipErizo = function (e) {
        if (u[e]) {
            var o = u[e].for_whom;
            makeRPC(g, u[e].agent, "recycleNode", [e, o], function () {
                delete u[e]
            }, function () {
                delete u[e]
            })
        } else log.warn("Try to deallocate a non-existing sip node")
    }, o
};