"use strict";
var Ajv = require("ajv"), ajv = new Ajv({useDefaults: !0});

function generateValidator(e) {
    var t = ajv.compile(e);
    return function (e) {
        return t(e) ? Promise.resolve(e) : Promise.reject(getErrorMessage(t.errors))
    }
}

function getErrorMessage(e) {
    for (var t = e.shift(), i = "", r = []; t;) if ("anyOf" !== t.keyword) {
        i = "request" + t.dataPath + " " + t.message;
        for (var o in t.params) {
            var a = t.params[o];
            a && (i += " " + JSON.stringify(a))
        }
        r.push(i), t = e.shift()
    } else t = e.shift();
    return r.join(",")
}

var Resolution = {
    id: "/Resolution",
    type: "object",
    properties: {width: {type: "number"}, height: {type: "number"}},
    additionalProperties: !1,
    required: ["width", "height"]
};
ajv.addSchema(Resolution);
var ParticipantUpdate = {
    type: "array",
    items: {$ref: "#/definitions/PermissionUpdate"},
    additionalProperties: !1,
    definitions: {
        PermissionUpdate: {
            type: "object",
            properties: {
                op: {enum: ["replace"]},
                path: {enum: ["/permission/publish", "/permission/publish/audio", "/permission/publish/video", "/permission/subscribe", "/permission/subscribe/audio", "/permission/subscribe/video"]},
                value: {
                    anyOf: [{type: "boolean"}, {
                        type: "object",
                        properties: {audio: {type: "boolean"}, video: {type: "boolean"}},
                        additionalProperties: !1,
                        required: ["audio", "video"]
                    }]
                }
            },
            additionalProperties: !1,
            required: ["op", "path", "value"]
        }
    }
}, StreamingInRequest = {
    type: "object",
    properties: {
        type: {const: "streaming"},
        connection: {$ref: "#/definitions/StreamingInConnectionOptions"},
        media: {$ref: "#/definitions/StreamingInMediaOptions"},
        attributes: {type: "object"}
    },
    additionalProperties: !1,
    required: ["type", "connection", "media"],
    definitions: {
        StreamingInConnectionOptions: {
            type: "object",
            properties: {
                url: {type: "string"},
                transportProtocol: {enum: ["tcp", "udp"], default: "tcp"},
                bufferSize: {type: "number", default: 8192}
            },
            additionalProperties: !1,
            required: ["url"]
        },
        StreamingInMediaOptions: {
            type: "object",
            properties: {audio: {enum: ["auto", !0, !1]}, video: {enum: ["auto", !0, !1]}},
            additionalProperties: !1,
            required: ["audio", "video"]
        }
    }
}, StreamUpdate = {
    type: "array",
    items: {$ref: "#/definitions/StreamInfoUpdate"},
    additionalProperties: !1,
    definitions: {
        StreamInfoUpdate: {
            type: "object",
            anyOf: [{
                properties: {
                    op: {enum: ["add", "remove"]},
                    path: {const: "/info/inViews"},
                    value: {type: "string"}
                }, additionalProperties: !1
            }, {
                properties: {
                    op: {const: "replace"},
                    path: {enum: ["/media/audio/status", "/media/video/status"]},
                    value: {enum: ["active", "inactive"]}
                }, additionalProperties: !1
            }, {
                properties: {
                    op: {const: "replace"},
                    path: {const: "/info/layout"},
                    value: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                stream: {type: "string"},
                                region: {
                                    type: "object",
                                    properties: {
                                        id: {type: "string"},
                                        shape: {const: "rectangle"},
                                        area: {
                                            type: "object",
                                            properties: {
                                                left: {$ref: "#/definitions/RationalNumberStr"},
                                                top: {$ref: "#/definitions/RationalNumberStr"},
                                                width: {$ref: "#/definitions/RationalNumberStr"},
                                                height: {$ref: "#/definitions/RationalNumberStr"}
                                            },
                                            additionalProperties: !1,
                                            required: ["left", "top", "width", "height"]
                                        }
                                    },
                                    additionalProperties: !1,
                                    required: ["id", "shape", "area"]
                                }
                            },
                            additionalProperties: !1,
                            required: ["region"]
                        }
                    }
                }, additionalProperties: !1
            }, {
                properties: {
                    op: {const: "replace"},
                    path: {pattern: "/info/layout/[0-9]+/stream"},
                    value: {type: "string"}
                }, additionalProperties: !1
            }],
            required: ["op", "path", "value"]
        }, RationalNumberStr: {type: "string", value: {pattern: "/^0|1|(?:[1-9][0-9]*/[1-9][0-9]*)/"}}
    }
}, ServerSideSubscriptionRequest = {
    anyOf: [{
        type: "object",
        properties: {
            type: {const: "streaming"},
            connection: {$ref: "#/definitions/StreamingOutConnectionOptions"},
            media: {$ref: "#/definitions/MediaSubOptions"}
        },
        additionalProperties: !1,
        required: ["type", "connection", "media"]
    }, {
        type: "object",
        properties: {
            type: {const: "recording"},
            connection: {$ref: "#/definitions/RecordingStorageOptions"},
            media: {$ref: "#/definitions/MediaSubOptions"}
        },
        additionalProperties: !1,
        required: ["type", "connection", "media"]
    }],
    definitions: {
        StreamingOutConnectionOptions: {
            type: "object",
            properties: {url: {type: "string"}},
            additionalProperties: !1,
            required: ["url"]
        },
        RecordingStorageOptions: {
            type: "object",
            properties: {container: {enum: ["mp4", "mkv", "ts", "auto"]}},
            additionalProperties: !1
        },
        MediaSubOptions: {
            type: "object",
            properties: {
                audio: {anyOf: [{$ref: "#/definitions/AudioSubOptions"}, {const: !1}]},
                video: {anyOf: [{$ref: "#/definitions/VideoSubOptions"}, {const: !1}]}
            },
            additionalProperties: !1,
            required: ["audio", "video"]
        },
        AudioSubOptions: {
            type: "object",
            properties: {from: {type: "string"}, format: {$ref: "#/definitions/AudioFormat"}},
            additionalProperties: !1,
            required: ["from"]
        },
        VideoSubOptions: {
            type: "object",
            properties: {
                from: {type: "string"},
                format: {$ref: "#/definitions/VideoFormat"},
                parameters: {$ref: "#/definitions/VideoParametersSpecification"}
            },
            additionalProperties: !1,
            required: ["from"]
        },
        AudioFormat: {
            type: "object",
            properties: {
                codec: {enum: ["pcmu", "pcma", "opus", "g722", "isac", "ilbc", "aac", "ac3", "nellymoser"]},
                sampleRate: {type: "number"},
                channelNum: {type: "number"}
            },
            additionalProperties: !1,
            required: ["codec"]
        },
        VideoFormat: {
            type: "object",
            properties: {codec: {enum: ["h264", "h265", "vp8", "vp9"]}, profile: {enum: ["B", "CB", "M", "H", "E"]}},
            additionalProperties: !1,
            required: ["codec"]
        },
        VideoParametersSpecification: {
            type: "object",
            properties: {
                resolution: {$ref: "/Resolution"},
                framerate: {type: "number"},
                bitrate: {type: ["string", "number"]},
                keyFrameInterval: {type: "number"}
            },
            additionalProperties: !1
        }
    }
}, SubscriptionControlInfo = {
    id: "/SubscriptionControlInfo",
    type: "object",
    anyOf: [{
        properties: {
            op: {const: "replace"},
            path: {enum: ["/media/audio/status", "/media/video/status"]},
            value: {enum: ["active", "inactive"]}
        }, additionalProperties: !1
    }, {
        properties: {
            op: {const: "replace"},
            path: {enum: ["/media/audio/from", "/media/video/from"]},
            value: {type: "string"}
        }, additionalProperties: !1
    }, {
        properties: {
            op: {const: "replace"},
            path: {const: "/media/video/parameters/resolution"},
            value: {$ref: "/Resolution"}
        }, additionalProperties: !1
    }, {
        properties: {
            op: {const: "replace"},
            path: {const: "/media/video/parameters/framerate"},
            value: {enum: [6, 12, 15, 24, 30, 48, 60]}
        }, additionalProperties: !1
    }, {
        properties: {
            op: {const: "replace"},
            path: {const: "/media/video/parameters/bitrate"},
            value: {enum: ["x0.8", "x0.6", "x0.4", "x0.2"]}
        }, additionalProperties: !1
    }, {
        properties: {
            op: {const: "replace"},
            path: {const: "/media/video/parameters/keyFrameInterval"},
            value: {enum: [1, 2, 5, 30, 100]}
        }, additionalProperties: !1
    }],
    required: ["op", "path", "value"]
};
ajv.addSchema(SubscriptionControlInfo);
var SubscriptionUpdate = {type: "array", items: {$ref: "/SubscriptionControlInfo"}}, validators = {
    "participant-update": generateValidator(ParticipantUpdate),
    "streamingIn-req": generateValidator(StreamingInRequest),
    "stream-update": generateValidator(StreamUpdate),
    "serverSideSub-req": generateValidator(ServerSideSubscriptionRequest),
    "subscription-update": generateValidator(SubscriptionUpdate)
};
module.exports = {
    validate: function (e, t) {
        if (validators[e]) return validators[e](t);
        throw new Error("No such validator: " + e)
    }
};