"use strict";
var rpcClient, helper, config, fs = require("fs"), toml = require("toml"), amqper = require("./amqp_client")(),
    makeRPC = require("./makeRPC").makeRPC, logger = require("./logger").logger, log = logger.getLogger("SipPortal"),
    sipErizoHelper = require("./sipErizoHelper");
try {
    config = toml.parse(fs.readFileSync("./sip_portal.toml"))
} catch (e) {
    log.error("Parsing config error on line " + e.line + ", column " + e.column + ": " + e.message), process.exit(1)
}
config.rabbit = config.rabbit || {}, config.rabbit.host = config.rabbit.host || "localhost", config.rabbit.port = config.rabbit.port || 5672, config.cluster = config.cluster || {}, config.cluster.name = config.cluster.name || "woogeen-cluster", global.config = config;
var dataAccess = require("./data_access"), roomPromises = {}, AllocateInterval = 5e3, erizos = {}, roomInfo = {},
    api = {
        handleSipUpdate: function (e) {
            log.debug("on handleSipUpdate, update:", e);
            var o = e.room_id, r = e.sip;
            roomInfo[o] = r, "delete" == e.type && delete roomInfo[o], "create" === e.type ? createSipConnectivity(o, r.sipServer, r.username, r.password) : "update" === e.type ? (deleteSipConnectivity(o), createSipConnectivity(o, r.sipServer, r.username, r.password)) : "delete" === e.type && deleteSipConnectivity(o)
        }
    }, rebuildErizo = function (e) {
        for (var o in erizos) if (erizos[o] === e) {
            log.info("SIP agent failed, try to re-assign an agent work for room:", o), delete erizos[o];
            var r = roomInfo[o];
            r && createSipConnectivity(o, r.sipServer, r.username, r.password);
            break
        }
    };

function initSipRooms() {
    log.debug("Start to get SIP rooms"), helper || (helper = sipErizoHelper({
        cluster: config.cluster.name,
        rpcClient: rpcClient,
        on_broken: function (e) {
            rebuildErizo(e)
        }
    })), dataAccess.room.sips().then(function (e) {
        if (!Array.isArray(e)) return log.warn("Get sip rooms from nuve failed:", e), void setTimeout(function () {
            log.info("Try to re-get sip rooms from nuve."), initSipRooms()
        }, 5e3);
        for (var o in log.debug("SIP rooms", e), e) {
            var r = e[o].roomId, i = e[o].sip;
            createSipConnectivity(r, (roomInfo[r] = i).sipServer, i.username, i.password)
        }
        log.info("initSipRooms ok")
    })
}

function createSipConnectivity(i, t, n, s) {
    roomPromises[i] || (roomPromises[i] = Promise.resolve(0)), roomPromises[i] = roomPromises[i].then(function () {
        if (!erizos[i]) return new Promise(function (r, o) {
            helper.allocateSipErizo({room: i, task: i}, function (o) {
                log.debug("allocateSipErizo", o), makeRPC(rpcClient, o.id, "init", [{
                    room_id: i,
                    sip_server: t,
                    sip_user: n,
                    sip_passwd: s
                }], function (e) {
                    log.debug("Sip node init successfully."), erizos[i] = o.id, r(o.id)
                }, function (e) {
                    log.error("Init sip node fail, try to de-allocate it:", e), helper.deallocateSipErizo(o.id), r()
                })
            }, function (e) {
                log.warn("Allocate sip Erizo fail: ", e), log.info("Try to allocate after", AllocateInterval / 1e3, "s."), o(e)
            })
        }).catch(function (e) {
            return new Promise(function (e, o) {
                setTimeout(e, AllocateInterval)
            }).then(function () {
                return createSipConnectivity(i, t, n, s)
            })
        })
    })
}

function deleteSipConnectivity(r) {
    roomPromises[r] || (roomPromises[r] = Promise.resolve(0)), roomPromises[r] = roomPromises[r].then(function () {
        if (erizos[r]) return new Promise(function (e, o) {
            log.debug("deallocateSipErizo", erizos[r]), makeRPC(rpcClient, erizos[r], "clean"), helper.deallocateSipErizo(erizos[r]), delete erizos[r], e(r)
        })
    })
}

function startup() {
    amqper.connect(config.rabbit, function () {
        amqper.asRpcClient(function (e) {
            rpcClient = e, amqper.asRpcServer("sip-portal", api, function (e) {
                log.info("sip-portal up!"), initSipRooms()
            }, function (e) {
                log.error("initializing sip-portal as rpc server failed, reason:", e), process.exit()
            })
        }, function (e) {
            log.error("initializing sip-portal as rpc server failed, reason:", e), process.exit()
        })
    }, function (e) {
        log.error("Sip-portal connect to rabbitMQ server failed, reason:", e), process.exit()
    })
}

startup(), process.on("SIGUSR2", function () {
    logger.reconfigure()
});