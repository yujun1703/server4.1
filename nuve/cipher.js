"use strict";
var crypto = require("crypto"), algorithm = "aes-256-ctr", stream = require("stream"), fs = require("fs"),
    zlib = require("zlib");

function encrypt(e, r) {
    var t = crypto.createCipher(algorithm, e), n = t.update(r, "utf8", "hex");
    return n += t.final("hex")
}

function decrypt(e, r) {
    var t = crypto.createDecipher(algorithm, e), n = t.update(r, "hex", "utf8");
    return n += t.final("utf8")
}

function lock(e, r, t, n) {
    var c = new stream.Readable;
    c._read = function () {
    }, c.push(JSON.stringify(r)), c.push(null);
    var i = fs.createWriteStream(t);
    i.on("error", function (e) {
        n(e)
    }), i.on("finish", function () {
        n(null)
    }), c.pipe(zlib.createGzip()).pipe(crypto.createCipher(algorithm, e)).pipe(i)
}

function unlock(e, r, t) {
    var n = fs.createReadStream(r);
    n.on("error", function (e) {
        t(e)
    });
    var c = zlib.createGunzip(), i = "";
    c.on("data", function (e) {
        i += e.toString()
    }), c.on("end", function () {
        t(null, JSON.parse(i))
    }), c.on("error", function (e) {
        t(e)
    }), n.pipe(crypto.createDecipher(algorithm, e)).pipe(c)
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    k: crypto.pbkdf2Sync("woogeen", "mcu", 4e3, 128, "sha1"),
    lock: lock,
    unlock: unlock
};