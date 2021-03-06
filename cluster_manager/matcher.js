"use strict";
var logger = require("./logger").logger, log = logger.getLogger("Matcher"), is_isp_applicable = function (e, r) {
    return -1 !== e.indexOf(r) || 0 === e.length
}, is_region_suited = function (e, r) {
    return -1 !== e.indexOf(r)
}, portalMatcher = function () {
    this.match = function (e, r, n) {
        var i = [], t = !1;
        for (var a in n) {
            var o = n[a], c = r[o].info.capacity;
            is_isp_applicable(c.isps, e.isp) && (is_region_suited(c.regions, e.region) ? t ? i.push(o) : (t = !0, i = [o]) : t || i.push(o))
        }
        return i
    }
}, webrtcMatcher = function () {
    this.match = function (e, r, n) {
        var i = [], t = !1;
        for (var a in n) {
            var o = n[a], c = r[o].info.capacity;
            is_isp_applicable(c.isps, e.isp) && (is_region_suited(c.regions, e.region) ? t ? i.push(o) : (t = !0, i = [o]) : t || i.push(o))
        }
        return i
    }
}, videoMatcher = function () {
    this.match = function (t, a, e) {
        if (!t || !t.video) return e;
        var o = function (r, e) {
            var n = 0;
            return e.forEach(function (e) {
                -1 < r.indexOf(e) && n++
            }), n === e.length
        };
        return e.filter(function (e) {
            var r = a[e].info.capacity, n = !1, i = !1;
            return r.video && (n = o(r.video.encode, t.video.encode), i = o(r.video.decode, t.video.decode)), n || log.warn("No available workers for encoding:", JSON.stringify(t.video.encode)), i || log.warn("No available workers for decoding:", JSON.stringify(t.video.decode)), n && i
        })
    }
}, generalMatcher = function () {
    this.match = function (e, r, n) {
        return n
    }
}, audioMatcher = generalMatcher;
exports.create = function (e) {
    switch (e) {
        case"portal":
            return new portalMatcher;
        case"conference":
            return new generalMatcher;
        case"webrtc":
            return new webrtcMatcher;
        case"recording":
        case"streaming":
        case"sip":
            return new generalMatcher;
        case"audio":
            return new audioMatcher;
        case"video":
            return new videoMatcher;
        default:
            return log.warn("Invalid specified purpose:", e, ", apply general-matcher instead."), new generalMatcher
    }
};