"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, mongoose = require("mongoose"), Room = require("./../model/roomModel"), Service = require("./../model/serviceModel"),
    DEFAULT_AUDIO = [{codec: "opus", sampleRate: 48e3, channelNum: 2}, {
        codec: "isac",
        sampleRate: 16e3
    }, {codec: "isac", sampleRate: 32e3}, {
        codec: "g722",
        sampleRate: 16e3,
        channelNum: 1
    }, {codec: "pcma"}, {codec: "pcmu"}, {codec: "aac"}, {codec: "ac3"}, {codec: "nellymoser"}, {codec: "ilbc"}],
    DEFAULT_AUDIO_OUT = [{codec: "opus", sampleRate: 48e3, channelNum: 2}, {
        codec: "isac",
        sampleRate: 16e3
    }, {codec: "isac", sampleRate: 32e3}, {
        codec: "g722",
        sampleRate: 16e3,
        channelNum: 1
    }, {codec: "pcma"}, {codec: "pcmu"}, {
        codec: "aac",
        sampleRate: 48e3,
        channelNum: 2
    }, {codec: "ac3"}, {codec: "nellymoser"}, {codec: "ilbc"}],
    DEFAULT_VIDEO_IN = [{codec: "h264"}, {codec: "vp8"}, {codec: "vp9"}],
    DEFAULT_VIDEO_OUT = [{codec: "h264", profile: "CB"}, {codec: "vp8"}, {codec: "vp9"}], DEFAULT_VIDEO_PARA = {
        resolution: ["x3/4", "x2/3", "x1/2", "x1/3", "x1/4", "hd1080p", "hd720p", "svga", "vga", "cif"],
        framerate: [6, 12, 15, 24, 30, 48, 60],
        bitrate: ["x0.8", "x0.6", "x0.4", "x0.2"],
        keyFrameInterval: [100, 30, 5, 2, 1]
    }, DEFAULT_ROLES = [{
        role: "presenter",
        publish: {audio: !0, video: !0},
        subscribe: {audio: !0, video: !0}
    }, {role: "viewer", publish: {audio: !1, video: !1}, subscribe: {audio: !0, video: !0}}, {
        role: "audio_only_presenter",
        publish: {audio: !0, video: !1},
        subscribe: {audio: !0, video: !1}
    }, {role: "video_only_viewer", publish: {audio: !1, video: !1}, subscribe: {audio: !1, video: !0}}, {
        role: "sip",
        publish: {audio: !0, video: !0},
        subscribe: {audio: !0, video: !0}
    }];

function getAudioOnlyLabels(e) {
    var o = [];
    return e.views && e.views.forEach && e.views.forEach(function (e) {
        !1 === e.video && o.push(e.label)
    }), o
}

function checkMediaOut(i, n) {
    var t = !0;
    return i && i.views && i.views.forEach(function (o, e) {
        t && (-1 !== i.mediaOut.audio.findIndex(function (e) {
            return e.codec === o.audio.format.codec && e.sampleRate === o.audio.format.sampleRate && e.channelNum === o.audio.format.channelNum
        }) ? n.views && n.views[e] && !1 === n.views[e].video || -1 === i.mediaOut.video.format.findIndex(function (e) {
            return e.codec === o.video.format.codec && e.profile === o.video.format.profile
        }) && (t = !1) : t = !1)
    }), t
}

function updateAudioOnlyViews(o, i, n) {
    i.views && i.views.map && (i.views = i.views.map(function (e) {
        return -1 < o.indexOf(e.label) && (e.video = !1), e
    })), i.save({validateBeforeSave: !1}, function (e, o) {
        if (e) return n(e, null);
        n(null, i.toObject())
    })
}

var removeNull = function o(i) {
    Object.keys(i).forEach(function (e) {
        i[e] && "object" === _typeof(i[e]) ? o(i[e]) : null == i[e] && delete i[e]
    })
};
exports.create = function (e, o, i) {
    o.mediaOut || (o.mediaOut = {
        audio: DEFAULT_AUDIO_OUT,
        video: {format: DEFAULT_VIDEO_OUT, parameters: DEFAULT_VIDEO_PARA}
    }), o.mediaIn || (o.mediaIn = {
        audio: DEFAULT_AUDIO,
        video: DEFAULT_VIDEO_IN
    }), o.views || (o.views = [{}]), o.roles || (o.roles = DEFAULT_ROLES), removeNull(o);
    var n = getAudioOnlyLabels(o), t = new Room(o);
    checkMediaOut(t, o) ? t.save().then(function (o) {
        Service.findById(e).then(function (e) {
            e.rooms.push(o._id), e.save().then(function () {
                0 < n.length ? updateAudioOnlyViews(n, o, i) : i(null, o.toObject())
            })
        })
    }).catch(function (e) {
        i(e, null)
    }) : i(new Error("MediaOut conflicts with View Setting"), null)
}, exports.list = function (e, o, i) {
    var n = {path: "rooms", options: {sort: "-createdAt"}};
    o && "number" == typeof o.per_page && 0 < o.per_page && (n.options.limit = o.per_page, "number" == typeof o.page && 0 < o.page && (n.options.skip = (o.page - 1) * o.per_page)), Service.findById(e).populate(n).lean().exec(function (e, o) {
        e ? i(e) : i(null, o.rooms)
    })
}, exports.get = function (e, n, t) {
    Service.findById(e).populate("rooms").lean().exec(function (e, o) {
        if (e) return t(e, null);
        var i;
        for (i = 0; i < o.rooms.length; i++) if (o.rooms[i]._id.toString() === n) return void t(null, o.rooms[i]);
        t(null, null)
    })
}, exports.delete = function (e, n, t) {
    Room.remove({_id: n}, function (i) {
        Service.findByIdAndUpdate(e, {$pull: {rooms: n}}, function (e, o) {
            e && console.log("Pull rooms fail:", e.message), t(i, n)
        })
    })
}, exports.update = function (e, o, i, n) {
    removeNull(i);
    var t = getAudioOnlyLabels(i);
    Room.findById(o).then(function (e) {
        var o = Object.assign(e, i);
        if (!checkMediaOut(o, i)) throw new Error("MediaOut conflicts with View Setting");
        return o.save()
    }).then(function (e) {
        0 < t.length ? updateAudioOnlyViews(t, e, n) : n(null, e.toObject())
    }).catch(function (e) {
        n(e, null)
    })
}, exports.config = function (e) {
    return new Promise(function (n, t) {
        Room.findById(e, function (e, o) {
            if (e || !o) t(e); else {
                var i = Room.processLayout(o.toObject());
                n(i)
            }
        })
    })
}, exports.sips = function () {
    return new Promise(function (n, e) {
        Room.find({"sip.sipServer": {$ne: null}}, function (e, o) {
            if (e || !o) n([]); else {
                var i = o.map(function (e) {
                    return {roomId: e._id.toString(), sip: e.sip}
                });
                n(i)
            }
        })
    })
};