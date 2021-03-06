"use strict";
var validateReq = require("./restReqValidator").validate, rpc = require("./rpc/rpc"),
    log = require("./logger").logger.getLogger("CloudHandler"),
    cluster_name = ((global.config || {}).cluster || {}).name || "woogeen-cluster", e = require("./errors");
exports.schedulePortal = function (o, e, n) {
    var c = !0;
    !function t(r) {
        if (r <= 0) return n("timeout");
        rpc.callRpc(cluster_name, "schedule", ["portal", o, e, 6e4], {
            callback: function (e) {
                "timeout" === e || "error" === e ? c && (log.info("Faild in scheduling portal, tokenCode:", o, ", keep trying."), setTimeout(function () {
                    t(r - ("timeout" === e ? 4 : 1))
                }, 1e3)) : (n(e.info), c = !1)
            }
        })
    }(60)
};
var scheduleRoomController = function (o) {
    return new Promise(function (t, r) {
        rpc.callRpc(cluster_name, "schedule", ["conference", o, "preference", 3e4], {
            callback: function (e) {
                "timeout" === e || "error" === e ? r("Error in scheduling room controller") : rpc.callRpc(e.id, "getNode", [{
                    room: o,
                    task: o
                }], {
                    callback: function (e) {
                        "timeout" === e || "error" === e ? r("Error in scheduling room controller") : t(e)
                    }
                })
            }
        })
    })
}, getRoomController = function (o) {
    return new Promise(function (t, r) {
        rpc.callRpc(cluster_name, "getScheduled", ["conference", o], {
            callback: function (e) {
                "timeout" === e || "error" === e ? r("Room is inactive") : rpc.callRpc(e, "queryNode", [o], {
                    callback: function (e) {
                        "timeout" === e || "error" === e ? r("Room is inactive") : t(e)
                    }
                })
            }
        })
    })
}, idPattern = /^[0-9a-zA-Z\-_]+$/, validateId = function (e, t) {
    return "string" == typeof t && idPattern.test(t) ? Promise.resolve(t) : Promise.reject("Invalid " + e)
};
exports.deleteRoom = function (t, r) {
    return validateId("Room ID", t).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "destroy", [], {
            callback: function (e) {
                r(e)
            }
        })
    }).catch(function () {
        r([])
    })
}, exports.getParticipantsInRoom = function (t, r) {
    return validateId("Room ID", t).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "getParticipants", [], {
            callback: function (e) {
                log.debug("Got participants:", e), r("timeout" === e || "error" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        log.info("getParticipantsInRoom failed, reason:", e.message ? e.message : e), r("Room is inactive" === e ? [] : "error")
    })
}, exports.updateParticipant = function (t, r, o, n) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Participant ID", r)
    }).then(function (e) {
        return validateReq("participant-update", o)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "controlParticipant", [r, o], {
            callback: function (e) {
                n("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        n("error")
    })
}, exports.deleteParticipant = function (t, r, o) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Participant ID", r)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "dropParticipant", [r], {
            callback: function (e) {
                o("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        o("error")
    })
}, exports.getStreamsInRoom = function (t, r) {
    return validateId("Room ID", t).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "getStreams", [], {
            callback: function (e) {
                log.debug("Got streams:", e), r("timeout" === e || "error" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        log.info("getStreamsInRoom failed, reason:", e.message ? e.message : e), r("Room is inactive" === e ? [] : "error")
    })
}, exports.addStreamingIn = function (t, r, o) {
    return validateId("Room ID", t).then(function (e) {
        return validateReq("streamingIn-req", r)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        return e
    }, function (e) {
        return "Room is inactive" === e ? scheduleRoomController(t) : Promise.reject("Validation failed")
    }).then(function (e) {
        rpc.callRpc(e, "addStreamingIn", [t, r], {
            callback: function (e) {
                o("error" === e || "timeout" === e ? "error" : e)
            }
        }, 9e4)
    }).catch(function (e) {
        o("error")
    })
}, exports.controlStream = function (t, r, o, n) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Stream ID", r)
    }).then(function (e) {
        return validateReq("stream-update", o)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "controlStream", [r, o], {
            callback: function (e) {
                n("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        n("error")
    })
}, exports.deleteStream = function (t, r, o) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Stream ID", r)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "deleteStream", [r], {
            callback: function (e) {
                o("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        o("error")
    })
}, exports.getSubscriptionsInRoom = function (t, r, o) {
    return validateId("Room ID", t).then(function (e) {
        return "streaming" === r || "recording" === r || "webrtc" === r ? Promise.resolve("ok") : Promise.reject("Invalid type")
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "getSubscriptions", [r], {
            callback: function (e) {
                log.debug("Got subscriptions:", e), o("timeout" === e || "error" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        log.info("getSubscriptionsInRoom failed, reason:", e.message ? e.message : e), o("Room is inactive" === e ? [] : "error")
    })
}, exports.addServerSideSubscription = function (r, o, n) {
    return validateId("Room ID", r).then(function (e) {
        return validateReq("serverSideSub-req", o)
    }).then(function (t) {
        getRoomController(r).catch(function (e) {
            return "Room is inactive" === e ? scheduleRoomController(r) : Promise.reject("Failed to get room controller")
        }).then(function (t) {
            rpc.callRpc(t, "addServerSideSubscription", [r, o], {
                callback: function (t, r) {
                    "error" === t || "timeout" === t ? (log.debug("RPC fail", t, r), n("error", new e.CloudError("RPC:addServerSideSubscription failed"))) : n(t)
                }
            })
        }).catch(function (t) {
            n("error", new e.CloudError(t && t.message ? t.message : ""))
        })
    }).catch(function (t) {
        var r = t && t.message ? t.message : "";
        n("error", new e.BadRequestError(r))
    })
}, exports.controlSubscription = function (t, r, o, n) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Subscription ID", r)
    }).then(function (e) {
        return validateReq("subscription-update", o)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "controlSubscription", [r, o], {
            callback: function (e) {
                n("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        n("error")
    })
}, exports.deleteSubscription = function (t, r, o) {
    return validateId("Room ID", t).then(function (e) {
        return validateId("Subscription ID", r)
    }).then(function (e) {
        return getRoomController(t)
    }).then(function (e) {
        rpc.callRpc(e, "deleteSubscription", [r], {
            callback: function (e) {
                o("error" === e || "timeout" === e ? "error" : e)
            }
        })
    }).catch(function (e) {
        o("error")
    })
}, exports.notifySipPortal = function (e, t, r) {
    var o = {type: e, room_id: t._id, sip: t.sip};
    rpc.callRpc("sip-portal", "handleSipUpdate", [o], {
        callback: function (e) {
            r("timeout" === e || "error" === e ? "Fail" : "Success")
        }
    })
};