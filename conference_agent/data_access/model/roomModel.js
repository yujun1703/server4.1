"use strict";
var mongoose = require("mongoose"), Fraction = require("fraction.js"), Schema = mongoose.Schema,
    Layout = require("./layoutTemplate"), ColorRGB = {type: Number, min: 0, max: 255, default: 0}, RNumber = {
        type: String, validate: {
            validator: function (e) {
                try {
                    new Fraction(e)
                } catch (e) {
                    return !1
                }
                return !0
            }, message: "{VALUE} is not a valid fraction string!"
        }, required: !0
    }, Region = {
        _id: !1,
        id: {type: String, required: !0},
        shape: {type: String, enum: ["rectangle"], default: "rectangle"},
        area: {left: RNumber, top: RNumber, width: RNumber, height: RNumber}
    }, Resolution = {width: {type: Number, default: 640}, height: {type: Number, default: 480}}, ViewSchema = new Schema({
        label: {type: String, default: "common"},
        audio: {
            format: {
                codec: {type: String, default: "opus"},
                sampleRate: {type: Number, default: 48e3},
                channelNum: {type: Number, default: 2}
            }, vad: {type: Boolean, default: !0}
        },
        video: {
            format: {codec: {type: String, default: "vp8"}, profile: {type: String}},
            parameters: {
                resolution: Resolution,
                framerate: {type: Number, default: 24},
                bitrate: {type: Number},
                keyFrameInterval: {type: Number, default: 100}
            },
            maxInput: {type: Number, default: 16, min: 1, max: 256},
            motionFactor: {type: Number, default: .8},
            bgColor: {r: ColorRGB, g: ColorRGB, b: ColorRGB},
            keepActiveInputPrimary: {type: Boolean, default: !1},
            layout: {
                fitPolicy: {type: String, enum: ["letterbox", "crop"], default: "letterbox"},
                setRegionEffect: {type: String},
                templates: {
                    base: {type: String, enum: ["fluid", "lecture", "void"], default: "fluid"},
                    custom: [{_id: !1, primary: {type: String}, region: [Region]}]
                }
            }
        }
    }, {_id: !1}), RoomSchema = new Schema({
        name: {type: String, required: !0},
        inputLimit: {type: Number, default: -1},
        participantLimit: {type: Number, default: -1},
        roles: [],
        views: [ViewSchema],
        mediaIn: {audio: [], video: []},
        mediaOut: {
            audio: [],
            video: {format: [], parameters: {resolution: [], framerate: [], bitrate: [], keyFrameInterval: []}}
        },
        transcoding: {
            audio: {type: Boolean, default: !0},
            video: {
                format: {type: Boolean, default: !0},
                parameters: {
                    resolution: {type: Boolean, default: !0},
                    framerate: {type: Boolean, default: !0},
                    bitrate: {type: Boolean, default: !0},
                    keyFrameInterval: {type: Boolean, default: !0}
                }
            }
        },
        sip: {sipServer: String, username: String, password: String},
        notifying: {participantActivities: {type: Boolean, default: !0}, streamChange: {type: Boolean, default: !0}}
    });
RoomSchema.statics.ViewSchema = mongoose.model("View", ViewSchema), RoomSchema.statics.processLayout = function (e) {
    return e && e.views && e.views.forEach(function (e) {
        e.video && (e.video.layout.templates = Layout.applyTemplate(e.video.layout.templates.base, e.video.maxInput, e.video.layout.templates.custom))
    }), e
}, module.exports = mongoose.model("Room", RoomSchema);