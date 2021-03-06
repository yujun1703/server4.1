"use strict";
require = require("module")._load("./AgentLoader");
var cxxLogger, config, fs = require("fs"), Getopt = require("node-getopt"), toml = require("toml"),
    logger = require("./logger").logger, log = logger.getLogger("ErizoJS");
try {
    cxxLogger = require("./logger/build/Release/logger")
} catch (o) {
    log.debug("No native logger for reconfiguration")
}
try {
    config = toml.parse(fs.readFileSync("./agent.toml"))
} catch (o) {
    log.error("Parsing config error on line " + o.line + ", column " + o.column + ": " + o.message), process.exit(1)
}
global.config = config || {}, global.config.webrtc = global.config.webrtc || {}, global.config.webrtc.stunserver = global.config.webrtc.stunserver || "", global.config.webrtc.stunport = global.config.webrtc.stunport || 0, global.config.webrtc.minport = global.config.webrtc.minport || 0, global.config.webrtc.maxport = global.config.webrtc.maxport || 0, global.config.webrtc.keystorePath = global.config.webrtc.keystorePath || "", global.config.webrtc.num_workers = global.config.webrtc.num_workers || 24, global.config.webrtc.use_nicer = global.config.webrtc.use_nicer || !1, global.config.webrtc.io_workers = global.config.webrtc.io_workers || 1, global.config.video = global.config.video || {}, global.config.video.hardwareAccelerated = !!global.config.video.hardwareAccelerated, global.config.video.enableBetterHEVCQuality = !!global.config.video.enableBetterHEVCQuality, global.config.video.MFE_timeout = global.config.video.MFE_timeout || 0, global.config.video.codecs = {
    decode: ["vp8", "vp9", "h264"],
    encode: ["vp8", "vp9"]
}, global.config.avatar = global.config.avatar || {}, global.config.audio = global.config.audio || {}, global.config.recording = global.config.recording || {}, global.config.recording.path = global.config.recording.path || "/tmp", global.config.recording.initializeTimeout = global.config.recording.initialize_timeout || 3e3, global.config.avstream = global.config.avstream || {}, global.config.avstream.initializeTimeout = global.config.avstream.initialize_timeout || 3e3, global.config.internal = global.config.internal || {}, global.config.internal.protocol = global.config.internal.protocol || "sctp", global.config.internal.minport = global.config.internal.minport || 0, global.config.internal.maxport = global.config.internal.maxport || 0;
var getopt = new Getopt([["r", "rabbit-host=ARG", "RabbitMQ Host"], ["g", "rabbit-port=ARG", "RabbitMQ Port"], ["l", "logging-config-file=ARG", "Logging Config File"], ["s", "stunserver=ARG", "Stun Server hostname"], ["p", "stunport=ARG", "Stun Server port"], ["m", "minport=ARG", "Minimum port"], ["M", "maxport=ARG", "Maximum port"], ["h", "help", "display this help"]]),
    opt = getopt.parse(process.argv.slice(2));
for (var prop in opt.options) if (opt.options.hasOwnProperty(prop)) {
    var value = opt.options[prop];
    switch (prop) {
        case"help":
            getopt.showHelp(), process.exit(0);
            break;
        case"rabbit-host":
            global.config.rabbit = global.config.rabbit || {}, global.config.rabbit.host = value;
            break;
        case"rabbit-port":
            global.config.rabbit = global.config.rabbit || {}, global.config.rabbit.port = value;
            break;
        default:
            global.config.webrtc[prop] = value
    }
}
var controller, rpc = require("./amqp_client")();

function init_env() {
    "video" === process.argv[3] && (global.config.video.codecs = require("./videoCapability"))
}

function init_controller() {
    log.info("pid:", process.pid), log.info("Connecting to rabbitMQ server..."), rpc.connect(global.config.rabbit, function () {
        rpc.asRpcClient(function (o) {
            var e = process.argv[3], r = process.argv[2], n = process.argv[5];
            switch (e) {
                case"conference":
                    controller = require("./conference")(o, r);
                    break;
                case"audio":
                    controller = require("./audio")(o);
                    break;
                case"video":
                    controller = require("./video")(o, n);
                    break;
                case"webrtc":
                    controller = require("./webrtc")(o);
                    break;
                case"streaming":
                    controller = require("./avstream")(o);
                    break;
                case"recording":
                    controller = require("./recording")(o, r);
                    break;
                case"sip":
                    controller = require("./sip")(o, {id: r, addr: n});
                    break;
                default:
                    return log.error("Ambiguous purpose:", e), void process.send("ambiguous purpose")
            }
            var i = JSON.parse(process.argv[4]);
            controller.networkInterfaces = Array.isArray(i) ? i : [], controller.clusterIP = process.argv[5], controller.agentID = process.argv[6], controller.networkInterfaces.forEach(function (o) {
                o.ip_address && (o.private_ip_match_pattern = new RegExp(o.ip_address, "g"))
            });
            var l = controller.rpcAPI || controller;
            l.keepAlive = function (o) {
                o("callback", !0)
            }, rpc.asRpcServer(r, l, function (o) {
                log.info(r + " as rpc server ready"), rpc.asMonitor(function (o) {
                    "abnormal" !== o.reason && "error" !== o.reason && "quit" !== o.reason || controller && "function" == typeof controller.onFaultDetected && controller.onFaultDetected(o.message)
                }, function (o) {
                    log.info(r + " as monitor ready"), process.send("READY")
                }, function (o) {
                    process.send("ERROR"), log.error(o)
                })
            }, function (o) {
                process.send("ERROR"), log.error(o)
            })
        }, function (o) {
            process.send("ERROR"), log.error(o)
        })
    }, function (o) {
        process.send("ERROR"), log.error("Node connect to rabbitMQ server failed, reason:", o)
    })
}

["SIGINT", "SIGTERM"].map(function (o) {
    process.on(o, function () {
        log.warn("Exiting on", o), controller && "function" == typeof controller.close && controller.close(), process.exit()
    })
}), ["SIGHUP", "SIGPIPE"].map(function (o) {
    process.on(o, function () {
        log.warn(o, "caught and ignored")
    })
}), process.on("exit", function () {
    rpc.disconnect()
}), process.on("unhandledRejection", function (o) {
    log.info("Reason: " + o)
}), process.on("SIGUSR2", function () {
    logger.reconfigure(), cxxLogger && cxxLogger.configure()
}), init_env(), init_controller();