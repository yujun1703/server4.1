"use strict";
var RpcRequest = function (i) {
    var e = {
        getRoomConfig: function (e, n) {
            return i.makeRPC(e, "getRoomConfig", n)
        }, getWorkerNode: function (e, n, t, r) {
            return i.makeRPC(e, "schedule", [n, t.task, r, 3e4]).then(function (n) {
                return i.makeRPC(n.id, "getNode", [t]).then(function (e) {
                    return {agent: n.id, node: e}
                })
            })
        }, recycleWorkerNode: function (e, n, t) {
            return i.makeRPC(e, "recycleNode", [n, t]).catch(function (e) {
                return "ok"
            }, function (e) {
                return "ok"
            })
        }, initiate: function (e, n, t, r, o) {
            return "in" === r ? i.makeRPC(e, "publish", [n, t, o]) : "out" === r ? i.makeRPC(e, "subscribe", [n, t, o]) : Promise.reject("Invalid direction")
        }, terminate: function (e, n, t) {
            return "in" === t ? i.makeRPC(e, "unpublish", [n]).catch(function (e) {
                return "ok"
            }) : "out" === t ? i.makeRPC(e, "unsubscribe", [n]).catch(function (e) {
                return "ok"
            }) : Promise.resolve("ok")
        }, onSessionSignaling: function (e, n, t) {
            return i.makeRPC(e, "onSessionSignaling", [n, t])
        }, mediaOnOff: function (e, n, t, r, o) {
            return i.makeRPC(e, "mediaOnOff", [n, t, r, o])
        }, sendMsg: function (e, n, t, r) {
            return i.makeRPC(e, "notify", [n, t, r])
        }, dropUser: function (e, n) {
            return i.makeRPC(e, "drop", [n])
        }
    };
    return e
};
module.exports = RpcRequest;