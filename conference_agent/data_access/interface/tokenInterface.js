"use strict";
var mongoose = require("mongoose"), Token = require("./../model/tokenModel"), Key = require("./../model/keyModel");
exports.create = function (e, o) {
    Token.create(e, function (e, n) {
        if (e) return console.error(e), o(null);
        o(n._id)
    })
}, exports.delete = function (e) {
    var u = new Date((new Date).getTime() - 18e4);
    return new Promise(function (t, i) {
        Token.findById(e, function (o, r) {
            Token.remove({$or: [{_id: e}, {creationDate: {$lt: u}}]}, function (e, n) {
                o || !r ? (console.log("err:", o || "WrongToken"), i(o)) : r.creationDate < u ? i({message: "Expired"}) : t(r)
            })
        })
    })
}, exports.genKey = function (e) {
    var n = require("crypto").randomBytes(64).toString("hex"), o = new Key({key: n});
    Key.findOneAndUpdate({_id: 0}, o, {upsert: !0}, function (e, n) {
        e && console.log("Save nuveKey error:", e)
    })
}, exports.key = function () {
    return new Promise(function (o, r) {
        Key.findById(0, function (e, n) {
            e || !n ? r(e) : o(n.key)
        })
    })
};