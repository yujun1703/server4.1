"use strict";
var log4js = require("log4js");
log4js.configure("./log4js_configuration.json"), log4js.reconfigure = function () {
    log4js.configure("./log4js_configuration.json")
}, exports.logger = log4js;