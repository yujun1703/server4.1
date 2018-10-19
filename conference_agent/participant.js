"use strict";
var Participant = function (e, i) {
    var o = {}, r = e.id, s = e.role, n = e.user, u = e.portal, t = e.origin, a = e.permission;
    return o.update = function (e, o, i) {
        switch (o) {
            case"/permission/subscribe":
                return "replace" === e ? "boolean" == typeof i.audio && "boolean" == typeof i.video ? (a.subscribe = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            case"/permission/subscribe/audio":
                return "replace" === e ? "boolean" == typeof i ? (a.subscribe = a.subscribe || {
                    audio: !1,
                    video: !1
                }, a.subscribe.audio = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            case"/permission/subscribe/video":
                return "replace" === e ? "boolean" == typeof i ? (a.subscribe = a.subscribe || {
                    audio: !1,
                    video: !1
                }, a.subscribe.video = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            case"/permission/publish":
                return "replace" === e ? "boolean" == typeof i.audio && "boolean" == typeof i.video ? (a.publish = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            case"/permission/publish/audio":
                return "replace" === e ? "boolean" == typeof i ? (a.publish = a.publish || {
                    audio: !1,
                    video: !1
                }, a.publish.audio = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            case"/permission/publish/video":
                return "replace" === e ? "boolean" == typeof i ? (a.publish = a.publish || {
                    audio: !1,
                    video: !1
                }, a.publish.video = i, Promise.resolve("ok")) : Promise.reject("Invalid json value") : Promise.reject("Invalid json op");
            default:
                return Promise.reject("Invalid json path")
        }
    }, o.isPublishPermitted = function (e) {
        return !(!a.publish || !a.publish[e])
    }, o.isSubscribePermitted = function (e) {
        return !(!a.subscribe || !a.subscribe[e])
    }, o.notify = function (e, o) {
        return i.sendMsg(u, r, e, o)
    }, o.getInfo = function () {
        return {id: r, user: n, role: s}
    }, o.getDetail = function () {
        return {id: r, user: n, role: s, permission: a}
    }, o.getOrigin = function () {
        return t
    }, o.getPortal = function () {
        return u
    }, o.drop = function () {
        return i.dropUser(u, r).catch(function () {
        })
    }, o
};
module.exports = Participant;