"use strict";
var RpcChannel = function (n) {
    var t = {}, i = n;
    return t.makeRPC = function (r, c, t, u, a) {
        return new Promise(function (o, e) {
            var n = {
                callback: function (n, t) {
                    "error" === n ? e(t || "unknown reason") : "timeout" === n ? e("Timeout to make rpc to " + r + "." + c) : o(n)
                }
            };
            a && (n.onStatus = function (n) {
                a(n).catch(function (n) {
                })
            }), i.remoteCall(r, c, t, n, u)
        })
    }, t
};
module.exports = RpcChannel;