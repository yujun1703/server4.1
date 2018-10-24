#!/usr/bin/env node
"use strict";
!function () {
    var r = require("readline").createInterface({input: process.stdin, output: process.stdout}),
        t = require("./cipher"), o = require("path").resolve(__dirname, "cert/.woogeen.keystore");
    r.question("Enter passphrase of certificate: ", function (e) {
        r.close(), t.lock(t.k, e, o, function (e) {
            console.log(e || "done!")
        })
    })
}();