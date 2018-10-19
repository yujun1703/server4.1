"use strict";
var Service = require("./../model/serviceModel");
exports.create = function (e, i) {
    new Service(e).save(function (e, n) {
        i(e, n)
    })
}, exports.list = function (i) {
    Service.find().lean().exec(function (e, n) {
        i(e, n)
    })
}, exports.get = function (e, i) {
    Service.findById(e).lean().exec(function (e, n) {
        i(e, n)
    })
}, exports.delete = function (i, c) {
    Service.remove({_id: i}, function (e, n) {
        0 === n.n && (i = null), c(e, i)
    })
};