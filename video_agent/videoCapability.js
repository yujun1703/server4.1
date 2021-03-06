"use strict";
var videoCapability = {decode: ["vp8", "vp9", "h264"], encode: ["vp8", "vp9"]}, fs = require("fs"),
    detectSWModeCapability = function () {
        fs.existsSync("./lib/libopenh264.so.4") && 1e5 < fs.statSync("./lib/libopenh264.so.4").size && videoCapability.encode.push("h264_CB")
    };
if (global.config.video.hardwareAccelerated) {
    var info = "";
    try {
        info = require("child_process").execSync("vainfo", {
            env: process.env,
            stdio: ["ignore", "pipe", "pipe"]
        }).toString(), global.config.video.hardwareAccelerated = -1 != info.indexOf("VA-API version")
    } catch (e) {
        e && 0 !== e.code ? global.config.video.hardwareAccelerated = !1 : info = e.stderr.toString()
    }
    global.config.video.hardwareAccelerated = -1 != info.indexOf("VA-API version")
}
global.config.video.hardwareAccelerated ? (videoCapability.decode.push("h265"), videoCapability.encode.push("h265"), videoCapability.encode.push("h264_CB"), videoCapability.encode.push("h264_B"), videoCapability.encode.push("h264_M"), videoCapability.encode.push("h264_H")) : detectSWModeCapability(), module.exports = videoCapability;