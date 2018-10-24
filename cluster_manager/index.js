"use strict";
var config, amqper = require("./amqp_client")(), logger = require("./logger").logger, log = logger.getLogger("Main"),
    ClusterManager = require("./clusterManager"), toml = require("toml"), fs = require("fs");
try {
    config = toml.parse(fs.readFileSync("./cluster_manager.toml"))
} catch (e) {
    log.error("Parsing config error on line " + e.line + ", column " + e.column + ": " + e.message), process.exit(1)
}

function startup() {
    amqper.connect(config.rabbit, function () {
        var r, n;
        r = Math.floor(1e9 * Math.random()), n = {
            initialTime: config.manager.initial_time,
            checkAlivePeriod: config.manager.check_alive_interval,
            checkAliveCount: config.manager.check_alive_count,
            scheduleKeepTime: config.manager.schedule_reserve_time,
            generalStrategy: config.strategy.general,
            portalStrategy: config.strategy.portal,
            conferenceStrategy: config.strategy.conference,
            webrtcStrategy: config.strategy.webrtc,
            sipStrategy: config.strategy.sip,
            streamingStrategy: config.strategy.streaming,
            recordingStrategy: config.strategy.recording,
            audioStrategy: config.strategy.audio,
            videoStrategy: config.strategy.video
        }, amqper.asTopicParticipant(config.manager.name + ".management", function (e) {
            log.info("Cluster manager up! id:", r), ClusterManager.run(e, config.manager.name, r, n)
        }, function (e) {
            log.error("Cluster manager initializing failed, reason:", e), process.exit()
        })
    }, function (e) {
        log.error("Cluster manager connect to rabbitMQ server failed, reason:", e), process.exit()
    })
}

config.manager = config.manager || {}, config.manager.name = config.manager.name || "woogeen-cluster", config.manager.initial_time = config.manager.initial_time || 1e4, config.manager.check_alive_interval = config.manager.check_alive_interval || 1e3, config.manager.check_alive_count = config.manager.check_alive_count || 10, config.manager.schedule_reserve_time = config.manager.schedule_reserve_time || 6e4, config.strategy = config.strategy || {}, config.strategy.general = config.strategy.general || "round-robin", config.strategy.portal = config.strategy.portal || "last-used", config.strategy.conference = config.strategy.conference || "last-used", config.strategy.webrtc = config.strategy.webrtc || "last-used", config.strategy.sip = config.strategy.sip || "round-robin", config.strategy.streaming = config.strategy.streaming || "round-robin", config.strategy.recording = config.strategy.recording || "randomly-pick", config.strategy.audio = config.strategy.audio || "most-used", config.strategy.video = config.strategy.video || "least-used", config.rabbit = config.rabbit || {}, config.rabbit.host = config.rabbit.host || "localhost", config.rabbit.port = config.rabbit.port || 5672, startup(), ["SIGINT", "SIGTERM"].map(function (e) {
    process.on(e, function () {
        log.warn("Exiting on", e), process.exit()
    })
}), process.on("exit", function () {
    amqper.disconnect()
}), process.on("SIGUSR2", function () {
    logger.reconfigure()
});