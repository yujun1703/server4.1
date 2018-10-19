"use strict";
global.config = global.config || {}, global.config.mongo = global.config.mongo || {}, global.config.mongo.dataBaseURL = global.config.mongo.dataBaseURL || "localhost/nuvedb";
var databaseUrl = global.config.mongo.dataBaseURL,
    connectOption = {useMongoClient: !0, reconnectTries: 900, reconnectInterval: 1e3}, mongoose = require("mongoose");
mongoose.plugin(function (o) {
    o.options.usePushEach = !0
}), mongoose.Promise = Promise, mongoose.connect("mongodb://" + databaseUrl, connectOption).catch(function (o) {
    console.log(o.message)
}), mongoose.connection.on("error", function (o) {
    console.log(o.message)
}), exports.token = require("./interface/tokenInterface"), exports.room = require("./interface/roomInterface"), exports.service = require("./interface/serviceInterface");