#!/usr/bin/env node
"use strict";
var dbURL = process.env.DB_URL;
if (!dbURL) throw"DB_URL not found";
var currentVersion = "1.0", fs = require("fs"), path = require("path"),
    db = require("mongojs")(dbURL, ["services", "infos", "rooms"]), cipher = require("./cipher"),
    configFile = path.join(__dirname, "nuve.toml"),
    sampleServiceFile = path.resolve(__dirname, "../extras/basic_example/samplertcservice.js");

function upgradeH264(t) {
    db.rooms.find({}).toArray(function (e, o) {
        if (e) return console.log("Error in getting rooms:", e.message), void db.close();
        if (o && 0 !== o.length) {
            var r, i, n = o.length, c = 0;
            for (r = 0; r < n; r++) (i = o[r]).mediaOut.video.format.forEach(function (e) {
                e && "h264" === e.codec && !e.profile && (e.profile = "CB")
            }), i.mediaOut.video.format = i.mediaOut.video.format.filter(function (e) {
                return e && "h265" !== e.codec
            }), i.mediaIn.video = i.mediaIn.video.filter(function (e) {
                return e && "h265" !== e.codec
            }), i.views.forEach(function (e) {
                var o = e.video.format;
                o && "h264" === o.codec && !o.profile ? o.profile = "CB" : o && "h265" === o.codec ? (o.codec = "h264", o.profile = "CB") : o || (e.video.format = {codec: "vp8"})
            }), db.rooms.save(i, function (e, o) {
                e && console.log("Error in upgrading room:", i._id, e.message), ++c === n && t()
            })
        } else t()
    })
}

function checkVersion(c) {
    db.infos.findOne({_id: 1}, function (e, n) {
        if (e) return console.log("mongodb: error in query info"), db.close();
        n ? "1.0" === n.version && c() : db.services.findOne({}, function (e, o) {
            if (e) return console.log("mongodb: error in query service"), db.close();
            var r = function (r) {
                upgradeH264(function () {
                    n = {_id: 1, version: currentVersion}, db.infos.save(n, function (e, o) {
                        if (e) return console.log("mongodb: error in updating version"), db.close();
                        r()
                    })
                })
            };
            if (o) if ("number" != typeof o.__v) console.log('The existed service "' + o.name + '" is not in 4.* format.'), console.log("Preparing to upgrade your database."), require("./SchemaUpdate3to4").update(function () {
                r(c)
            }); else {
                var i = require("readline").createInterface({input: process.stdin, output: process.stdout});
                i.question("This operation will upgrade stored data to version 4.1. Are you sure you want to proceed this operation anyway?[y/n]", function (e) {
                    i.close(), "y" === (e = e.toLowerCase()) || "yes" === e ? r(c) : process.exit(0)
                })
            } else r(c)
        })
    })
}

function prepareService(n, c) {
    db.services.findOne({name: n}, function (e, o) {
        if (e || !o) {
            var r = require("crypto"),
                i = r.pbkdf2Sync(r.randomBytes(64).toString("hex"), r.randomBytes(32).toString("hex"), 4e3, 128, "sha256").toString("base64");
            o = {
                name: n,
                key: cipher.encrypt(cipher.k, i),
                encrypted: !0,
                rooms: [],
                __v: 0
            }, db.services.save(o, function (e, o) {
                if (e) return console.log("mongodb: error in adding", n), db.close();
                o.key = i, c(o)
            })
        } else !0 === o.encrypted && (o.key = cipher.decrypt(cipher.k, o.key)), c(o)
    })
}

function writeConfigFile(r, e) {
    try {
        fs.statSync(configFile), fs.readFile(configFile, "utf8", function (e, o) {
            if (e) return console.log(e);
            o = (o = o.replace(/\ndataBaseURL =[^\n]*\n/, '\ndataBaseURL = "' + dbURL + '"\n')).replace(/\nsuperserviceID =[^\n]*\n/, '\nsuperserviceID = "' + r + '"\n'), fs.writeFile(configFile, o, "utf8", function (e) {
                if (e) return console.log("Error in saving configuration:", e)
            })
        })
    } catch (e) {
        console.error("config file not found:", configFile)
    }
}

function writeSampleFile(r, i) {
    fs.readFile(sampleServiceFile, "utf8", function (e, o) {
        if (e) return console.log(e);
        o = o.replace(/icsREST\.API\.init\('[^']*', '[^']*'/, "icsREST.API.init('" + r + "', '" + i + "'"), fs.writeFile(sampleServiceFile, o, "utf8", function (e) {
            if (e) return console.log(e)
        })
    })
}

checkVersion(function () {
    prepareService("superService", function (e) {
        var o = e._id + "", r = e.key;
        console.log("superServiceId:", o), console.log("superServiceKey:", r), writeConfigFile(o, r), prepareService("sampleService", function (e) {
            var o = e._id + "", r = e.key;
            console.log("sampleServiceId:", o), console.log("sampleServiceKey:", r), db.close(), writeSampleFile(o, r)
        })
    })
});