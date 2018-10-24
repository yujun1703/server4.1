#!/usr/bin/env node
"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e
} : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}, Fraction = require("fraction.js"), databaseUrl = "localhost/nuvedb", collections = ["rooms", "services"];
(databaseUrl = process.env.DB_URL) || (databaseUrl = "localhost/nuvedb");
var db = require("mongojs")(databaseUrl, ["rooms", "services"]);

function makeFraction(e) {
    return "number" == typeof e ? e.toString() : "number" == typeof e.denominator && "number" == typeof e.numerator ? makeFraction(e.numerator, e.denominator) : "1"
}

function translateCustom(e) {
    return e.forEach(function (e) {
        e.region.forEach(function (e) {
            "number" == typeof e.relativesize ? (e.shape = "rectangle", e.area = {
                left: makeFraction(e.left),
                top: makeFraction(e.top),
                width: makeFraction(e.relativesize),
                height: makeFraction(e.relativesize)
            }, delete e.relativesize) : e.area = {
                left: makeFraction(e.area.left),
                top: makeFraction(e.area.top),
                width: makeFraction(e.area.width),
                height: makeFraction(e.area.height)
            }
        })
    }), e
}

function translateColor(e) {
    var o = {white: {r: 255, g: 255, b: 255}, black: {r: 0, g: 0, b: 0}};
    return "string" == typeof e && o[e] ? o[e] : "object" !== (void 0 === e ? "undefined" : _typeof(e)) ? {
        r: 0,
        g: 0,
        b: 0
    } : e
}

function translateOldRoom(e) {
    var o, i, t, a, r, d = [{size: 0, bitrate: 0}, {size: 76800, bitrate: 400}, {size: 307200, bitrate: 800}, {
        size: 921600,
        bitrate: 2e3
    }, {size: 2073600, bitrate: 4e3}, {size: 8294400, bitrate: 16e3}], n = function (e, o, i, t) {
        var a = 1;
        switch (e) {
            case"h264":
            case"vp8":
                a = 1;
                break;
            case"vp9":
                a = .8;
                break;
            case"h265":
                a = .9
        }
        return function (e, o, i) {
            for (var t = -1, a = 0, r = 0, n = 0, s = e * o * i / 30, c = 0; c < d.length - 1; c++) if (a = d[c].size, r = d[c + 1].size, a < s && s <= r) {
                n = (s - a) / (r - a), t = d[c].bitrate + (d[c + 1].bitrate - d[c].bitrate) * n;
                break
            }
            return -1 == t && (t = 16e3), t
        }(o.width, o.height, i) * a * t
    }, s = {
        _id: e._id,
        name: e.name,
        inputLimit: e.publishLimit,
        participantLimit: e.userLimit,
        roles: [{role: "admin", publish: {audio: !0, video: !0}, subscribe: {audio: !0, video: !0}}, {
            role: "presenter",
            publish: {audio: !0, video: !0},
            subscribe: {audio: !0, video: !0}
        }, {
            role: "viewer",
            publish: {audio: !1, video: !1},
            subscribe: {audio: !0, video: !0}
        }, {
            role: "audio_only_presenter",
            publish: {audio: !0, video: !1},
            subscribe: {audio: !0, video: !1}
        }, {
            role: "video_only_viewer",
            publish: {audio: !1, video: !1},
            subscribe: {audio: !1, video: !0}
        }, {role: "sip", publish: {audio: !0, video: !0}, subscribe: {audio: !0, video: !0}}],
        views: [],
        mediaIn: {
            audio: [{
                codec: "opus",
                sampleRate: 48e3,
                channelNum: 2
            }, {codec: "pcmu"}, {codec: "pcma"}, {codec: "isac", sampleRate: 16e3}, {
                codec: "isac",
                sampleRate: 32e3
            }, {codec: "ilbc"}, {
                codec: "g722",
                sampleRate: 16e3,
                channelNum: 1
            }, {codec: "aac"}, {codec: "ac3"}, {codec: "nellymoser"}],
            video: [{codec: "h264"}, {codec: "vp8"}, {codec: "h265"}, {codec: "vp9"}]
        },
        mediaOut: {
            audio: [{
                codec: "opus",
                sampleRate: 48e3,
                channelNum: 2
            }, {codec: "pcmu"}, {codec: "pcma"}, {codec: "isac", sampleRate: 16e3}, {
                codec: "isac",
                sampleRate: 32e3
            }, {codec: "ilbc"}, {codec: "g722", sampleRate: 16e3, channelNum: 1}, {
                codec: "aac",
                sampleRate: 48e3,
                channelNum: 2
            }, {codec: "ac3"}, {codec: "nellymoser"}],
            video: {
                format: [{codec: "h264"}, {codec: "vp8"}, {codec: "h265"}, {codec: "vp9"}],
                parameters: {
                    resolution: ["x3/4", "x2/3", "x1/2", "x1/3", "x1/4", "hd1080p", "hd720p", "svga", "vga", "cif"],
                    framerate: [6, 12, 15, 24, 30, 48, 60],
                    bitrate: ["x0.8", "x0.6", "x0.4", "x0.2"],
                    keyFrameInterval: [100, 30, 5, 2, 1]
                }
            }
        },
        transcoding: {
            audio: !0,
            video: {format: !0, parameters: {resolution: !0, framerate: !0, bitrate: !0, keyFrameInterval: !0}}
        },
        notifying: {participantActivities: !0, streamChange: !0},
        sip: e.sip ? e.sip : void 0
    }, c = {
        cif: {width: 352, height: 288},
        vga: {width: 640, height: 480},
        svga: {width: 800, height: 600},
        xga: {width: 1024, height: 768},
        r640x360: {width: 640, height: 360},
        hd720p: {width: 1280, height: 720},
        sif: {width: 320, height: 240},
        hvga: {width: 480, height: 320},
        r480x360: {width: 480, height: 360},
        qcif: {width: 176, height: 144},
        r192x144: {width: 192, height: 144},
        hd1080p: {width: 1920, height: 1080},
        uhd_4k: {width: 3840, height: 2160},
        r360x360: {width: 360, height: 360},
        r480x480: {width: 480, height: 480},
        r720x720: {width: 720, height: 720},
        r720x1280: {width: 720, height: 1280},
        r1080x1920: {width: 1080, height: 1920}
    }, l = {best_quality: 1.4, better_quality: 1.2, standard: 1, better_speed: .8, best_speed: .6};

    function u(e) {
        return c[e] || {width: 640, height: 480}
    }

    for (var h in e.mediaMixing && !e.views && (e.views = {common: {mediaMixing: e.mediaMixing}}), e.views) {
        var m = e.views[h].mediaMixing;
        s.views.push({
            label: h,
            audio: {
                format: {codec: "opus", sampleRate: 48e3, channelNum: 2},
                vad: !(!m.video || !m.video.avCoordinated)
            },
            video: m.video ? {
                format: {codec: "h264"},
                motionFactor: .8,
                parameters: {
                    resolution: u(m.video.resolution),
                    framerate: 24,
                    bitrate: (o = "h264", i = m.video.resolution, t = 24, a = .8, r = m.video.quality_level, n(o, u(i), t, a) * (l[r] || 1)),
                    keyFrameInterval: 100
                },
                maxInput: m.video.maxInput,
                bgColor: translateColor(m.video.bkColor),
                layout: {
                    fitPolicy: m.video.crop ? "crop" : "letterbox",
                    setRegionEffect: "insert",
                    templates: {base: m.video.layout.base, custom: translateCustom(m.video.layout.custom)}
                }
            } : void 0
        })
    }
    return s
}

var todo = 10, rCount = 0, sCount = 0, finishCallback = null;

function checkClose() {
    rCount === todo && sCount === todo && (console.log("Finish"), db.close(), "function" == typeof finishCallback && finishCallback())
}

function processRoom(i, t) {
    if (t >= i.length) return rCount++, checkClose();
    var a = translateOldRoom(i[t]);
    db.rooms.save(a, function (e, o) {
        e ? console.log("Error in updating room:", a._id, e.message) : console.log("Room:", a._id, "converted."), processRoom(i, t + 1)
    })
}

function processServices() {
    db.services.find({}).toArray(function (e, o) {
        if (console.log("Starting"), e) return console.log("Error in getting services:", e.message), void db.close();
        var i, t;
        for (todo = o.length, i = 0; i < todo; i++) "number" != typeof(t = o[i]).__v ? (t.rooms && 0 < t.rooms.length ? t.rooms[0]._id ? processRoom(t.rooms, 0) : db.rooms.find({_id: {$in: t.rooms}}).toArray(function (e, o) {
            !e && o && 0 < o.length ? processRoom(o, 0) : rCount++
        }) : rCount++, t.__v = 0, t.rooms = t.rooms.map(function (e) {
            return e._id ? e._id : e
        }), db.services.save(t, function (e, o) {
            e ? console.log("Error in updating service:", t._id, e.message) : console.log("Service:", t._id, "converted."), sCount++, checkClose()
        })) : (sCount++, rCount++, checkClose())
    })
}

function main(e) {
    var o = require("readline").createInterface({input: process.stdin, output: process.stdout});
    o.question("This operation will overwrite the old database, which is irreversible and may cause incompatibility between old version MCU's and the converted database. It is strongly suggested to backup the database files before continuing. Are you sure you want to proceed this operation anyway?[y/n]", function (e) {
        o.close(), "y" === (e = e.toLowerCase()) || "yes" === e ? processServices() : process.exit(0)
    })
}

require.main === module ? main() : exports.update = function (e) {
    finishCallback = e, main()
};