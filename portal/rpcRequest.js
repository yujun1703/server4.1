"use strict";
var RpcRequest = function (u) {
    var e = {
        getController: function (e, n) {
            return u.makeRPC(e, "schedule", ["conference", n, "preference", 3e4]).then(function (e) {
                return u.makeRPC(e.id, "getNode", [{room: n, task: n}])
            })
        }, join: function (e, n, r) {
            return u.makeRPC(e, "join", [n, r], 6e3)
        }, leave: function (e, n) {
            return u.makeRPC(e, "leave", [n])
        }, text: function (e, n, r, t) {
            return u.makeRPC(e, "text", [n, r, t], 4e3)
        }, publish: function (e, n, r, t) {
            return u.makeRPC(e, "publish", [n, r, t])
        }, unpublish: function (e, n, r) {
            return u.makeRPC(e, "unpublish", [n, r])
        }, streamControl: function (e, n, r, t) {
            return u.makeRPC(e, "streamControl", [n, r, t], 4e3)
        }, subscribe: function (e, n, r, t) {
            return u.makeRPC(e, "subscribe", [n, r, t])
        }, unsubscribe: function (e, n, r) {
            return u.makeRPC(e, "unsubscribe", [n, r])
        }, subscriptionControl: function (e, n, r, t) {
            return u.makeRPC(e, "subscriptionControl", [n, r, t])
        }, onSessionSignaling: function (e, n, r) {
            return u.makeRPC(e, "onSessionSignaling", [n, r])
        }
    };
    return e
};
module.exports = RpcRequest;