"use strict";
var Ajv = require("ajv"), ajv = new Ajv({useDefaults: !0});

function generateValidator(e) {
    var i = ajv.compile(e);
    return function (e) {
        return i(e) ? Promise.resolve(e) : Promise.reject(getErrorMessage(i.errors))
    }
}

function getErrorMessage(e) {
    for (var i = e.shift(), t = "", r = []; i;) if ("anyOf" !== i.keyword) {
        t = "request" + i.dataPath + " " + i.message;
        for (var o in i.params) {
            var a = i.params[o];
            a && (t += " " + JSON.stringify(a))
        }
        r.push(t), i = e.shift()
    } else i = e.shift();
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
var PublicationRequest = {
    anyOf: [{
        type: "object",
        properties: {media: {$ref: "#/definitions/WebRTCMediaOptions"}, attributes: {type: "object"}},
        additionalProperties: !1,
        required: ["media"]
    }],
    definitions: {
        WebRTCMediaOptions: {
            type: "object",
            properties: {
                audio: {
                    anyOf: [{
                        type: "object",
                        properties: {source: {enum: ["mic", "screen-cast", "raw-file", "encoded-file"]}},
                        additionalProperties: !1,
                        required: ["source"]
                    }, {const: !1}]
                },
                video: {
                    anyOf: [{
                        type: "object",
                        properties: {
                            source: {enum: ["camera", "screen-cast", "raw-file", "encoded-file"]},
                            parameters: {
                                type: "object",
                                properties: {resolution: {$ref: "/Resolution"}, framerate: {type: "number"}}
                            }
                        },
                        additionalProperties: !1,
                        required: ["source"]
                    }, {const: !1}]
                }
            },
            additionalProperties: !1,
            required: ["audio", "video"]
        }
    }
}, StreamControlInfo = {
    type: "object",
    anyOf: [{
        properties: {
            id: {type: "string", require: !0},
            operation: {enum: ["mix", "unmix", "get-region"]},
            data: {type: "string"}
        }, additionalProperties: !1
    }, {
        properties: {
            id: {type: "string", require: !0},
            operation: {enum: ["set-region"]},
            data: {$ref: "#/definitions/RegionSetting"}
        }, additionalProperties: !1
    }, {
        properties: {
            id: {type: "string", require: !0},
            operation: {enum: ["pause", "play"]},
            data: {enum: ["audio", "video", "av"]}
        }, additionalProperties: !1
    }],
    required: ["id", "operation", "data"],
    definitions: {
        RegionSetting: {
            type: "object",
            properties: {view: {type: "string"}, region: {type: "string", minLength: 1}},
            additionalProperties: !1,
            required: ["view", "region"]
        }
    }
}, SubscriptionRequest = {
    anyOf: [{
        type: "object",
        properties: {media: {$ref: "#/definitions/MediaSubOptions"}},
        additionalProperties: !1,
        required: ["media"]
    }],
    definitions: {
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
                codec: {enum: ["pcmu", "pcma", "opus", "g722", "iSAC", "iLBC", "aac", "ac3", "nellymoser"]},
                sampleRate: {type: "number"},
                channelNum: {type: "number"}
            },
            additionalProperties: !1,
            required: ["codec"]
        },
        VideoFormat: {
            type: "object",
            properties: {codec: {enum: ["h264", "h265", "vp8", "vp9"]}, profile: {enum: ["CB", "B", "M", "E", "H"]}},
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
    type: "object",
    anyOf: [{
        properties: {
            id: {type: "string"},
            operation: {enum: ["update"]},
            data: {$ref: "#/definitions/SubscriptionUpdate"}
        }, additionalProperties: !1
    }, {
        properties: {
            id: {type: "string"},
            operation: {enum: ["pause", "play"]},
            data: {enum: ["audio", "video", "av"]}
        }, additionalProperties: !1
    }],
    required: ["id", "operation", "data"],
    definitions: {
        SubscriptionUpdate: {
            type: "object",
            properties: {audio: {$ref: "#/definitions/AudioUpdate"}, video: {$ref: "#/definitions/VideoUpdate"}},
            additionalProperties: !1
        },
        AudioUpdate: {
            type: "object",
            properties: {from: {type: "string"}},
            additionalProperties: !1,
            required: ["from"]
        },
        VideoUpdate: {
            type: "object",
            properties: {from: {type: "string"}, parameters: {$ref: "#/definitions/VideoUpdateSpecification"}},
            additionalProperties: !1
        },
        VideoUpdateSpecification: {
            type: "object",
            properties: {
                resolution: {$ref: "/Resolution"},
                framerate: {type: "number"},
                bitrate: {type: ["number", "string"]},
                keyFrameInterval: {type: "number"}
            },
            additionalProperties: !1
        }
    }
}, validators = {
    "publication-request": generateValidator(PublicationRequest),
    "stream-control-info": generateValidator(StreamControlInfo),
    "subscription-request": generateValidator(SubscriptionRequest),
    "subscription-control-info": generateValidator(SubscriptionControlInfo)
};
module.exports = {
    validate: function (e, i) {
        if (validators[e]) return validators[e](i);
        throw new Error("No such validator: " + e)
    }
};