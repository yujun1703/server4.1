"use strict";
exports.makeRPC = function (t, e, n, o, c, f) {
    t.remoteCall(e, n, o, {
        callback: function (t, o) {
            "error" === t ? "function" == typeof f && f(o) : "timeout" === t ? "function" == typeof f && f("Timeout to make rpc to " + e + "." + n) : "function" == typeof c && c(t)
        }
    })
};