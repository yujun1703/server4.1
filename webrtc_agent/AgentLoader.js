"use strict";
var Module = require("module"), path = require("path"), debug = process.env.NODE_DEBUG_ERIZO, loadPrefix = "";
try {
    loadPrefix = Module._load("./loader.json").lib || ""
} catch (r) {
}

function checkError(r) {
    "MODULE_NOT_FOUND" !== r.code && console.log(r)
}

module.exports = function (r) {
    if (debug) {
        try {
            return require(r)
        } catch (r) {
            checkError(r)
        }
        return require("./" + path.join(loadPrefix, r))
    }
    var e = path.normalize(r);
    if (e === r) {
        try {
            return require(r)
        } catch (r) {
            checkError(r)
        }
        return Module._load("./" + r)
    }
    try {
        return Module._load(r)
    } catch (r) {
        checkError(r)
    }
    try {
        return require(e)
    } catch (r) {
        checkError(r)
    }
    try {
        return require(path.join(e, "index"))
    } catch (r) {
        checkError(r)
    }
    return require(path.join(loadPrefix, e))
};