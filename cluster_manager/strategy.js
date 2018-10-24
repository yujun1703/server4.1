"use strict";
var logger = require("./logger").logger, log = logger.getLogger("Strategy"), leastUsed = function () {
    this.allocate = function (e, n, o, t) {
        var a = 1, r = void 0;
        for (var i in n) {
            var l = n[i];
            e[l].load < a && (a = e[l].load, r = l)
        }
        o(r)
    }
}, mostUsed = function () {
    this.allocate = function (e, n, o, t) {
        var a = 0, r = void 0;
        for (var i in n) {
            var l = n[i];
            e[l].load >= a && (a = e[l].load, r = l)
        }
        o(r)
    }
}, lastUsed = function () {
    var a = void 0;
    this.allocate = function (e, n, o, t) {
        void 0 !== a && void 0 !== e[a] && -1 !== n.indexOf(a) || (a = n[0]), o(a)
    }
}, roundRobin = function () {
    var r = 4294967296;
    this.allocate = function (e, n, o, t) {
        var a = n.indexOf(r);
        o(r = -1 === a ? n[0] : a === n.length - 1 ? n[0] : n[a + 1])
    }
}, randomlyPick = function () {
    this.allocate = function (e, n, o, t) {
        o(n[Math.floor(Math.random() * n.length)])
    }
};
exports.create = function (e) {
    switch (e) {
        case"least-used":
            return new leastUsed;
        case"most-used":
            return new mostUsed;
        case"last-used":
            return new lastUsed;
        case"round-robin":
            return new roundRobin;
        case"randomly-pick":
            return new randomlyPick;
        default:
            return log.warn("Invalid specified scheduling strategy:", e, ', apply "randomly-pick" instead.'), new randomlyPick
    }
};