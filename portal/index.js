"use strict";
var config, fs = require("fs"), toml = require("toml"), logger = require("./logger").logger,
    log = logger.getLogger("Main");
try {
    config = toml.parse(fs.readFileSync("./portal.toml"))
} catch (o) {
    log.error("Parsing config error on line " + o.line + ", column " + o.column + ": " + o.message), process.exit(1)
}
config.portal = config.portal || {}, config.portal.ip_address = config.portal.ip_address || "", config.portal.hostname = config.portal.hostname || "", config.portal.port = config.portal.port || 8080, config.portal.ssl = config.portal.ssl || !1, config.portal.force_tls_v12 = config.portal.force_tls_v12 || !1, config.portal.reconnection_ticket_lifetime = config.portal.reconnection_ticket_lifetime || 600, config.portal.reconnection_timeout = Number.isInteger(config.portal.reconnection_timeout) ? config.portal.reconnection_timeout : 60, config.cluster = config.cluster || {}, config.cluster.name = config.cluster.name || "woogeen-cluster", config.cluster.join_retry = config.cluster.join_retry || 60, config.cluster.report_load_interval = config.cluster.report_load_interval || 1e3, config.cluster.max_load = config.cluster.max_laod || .85, config.cluster.network_max_scale = config.cluster.network_max_scale || 1e3, config.capacity = config.capacity || {}, config.capacity.isps = config.capacity.isps || [], config.capacity.regions = config.capacity.regions || [], config.rabbit = config.rabbit || {}, config.rabbit.host = config.rabbit.host || "localhost", config.rabbit.port = config.rabbit.port || 5672, global.config = config;
var rpcClient, socketio_server, portal, worker, ip_address, amqper = require("./amqp_client")();
!function () {
    var o, e, r, t = config.portal.networkInterface, n = require("os").networkInterfaces(), i = [];
    for (o in n) if (n.hasOwnProperty(o)) for (e in n[o]) n[o].hasOwnProperty(e) && ("IPv4" !== (r = n[o][e]).family || r.internal || o !== t && t || i.push(r.address), "IPv6" !== r.family || r.internal || o !== t && t || i.push("[" + r.address + "]"));
    ip_address = "" === config.portal.ip_address || void 0 === config.portal.ip_address ? i[0] : config.portal.ip_address
}();
var dropAll = function () {
    socketio_server && socketio_server.drop("all")
}, getTokenKey = function (o, e, r) {
    require("./data_access").token.key(o).then(function (o) {
        e(o)
    }).catch(function (o) {
        log.info("Failed to get token key. err:", o && o.message ? o.message : o), r(o)
    })
}, joinCluster = function (o) {
    var e = o, r = {
        rpcClient: rpcClient,
        purpose: "portal",
        clusterName: config.cluster.name,
        joinRetry: config.cluster.join_retry,
        info: {
            ip: ip_address,
            hostname: config.portal.hostname,
            port: config.portal.port,
            ssl: config.portal.ssl,
            state: 2,
            max_load: config.cluster.max_load,
            capacity: config.capacity
        },
        onJoinOK: e,
        onJoinFailed: function (o) {
            log.error("portal join cluster failed. reason:", o), worker && worker.quit(), process.exit()
        },
        onLoss: function () {
            log.info("portal lost."), dropAll()
        },
        onRecovery: function () {
            log.info("portal recovered.")
        },
        loadCollection: {period: config.cluster.report_load_interval, item: {name: "cpu"}}
    };
    worker = require("./clusterWorker")(r)
}, refreshTokenKey = function (o, e, r) {
    var t = setInterval(function () {
        getTokenKey(o, function (o) {
            void 0 === socketio_server && clearInterval(t), o !== r && (log.info("Token key updated!"), e.updateTokenKey(o), r = o)
        }, function () {
            void 0 === socketio_server && clearInterval(t), log.warn("Keep trying...")
        })
    }, 6e3)
}, serviceObserver = {
    onJoin: function (o) {
        worker && worker.addTask(o)
    }, onLeave: function (o) {
        worker && worker.removeTask(o)
    }
}, startServers = function (o, e) {
    var r = require("./rpcChannel")(rpcClient), t = require("./rpcRequest")(r);
    return portal = require("./portal")({
        tokenKey: e,
        tokenServer: "nuve",
        clusterName: config.cluster.name,
        selfRpcId: o
    }, t), (socketio_server = require("./socketIOServer")({
        port: config.portal.port,
        ssl: config.portal.ssl,
        forceTlsv12: config.portal.force_tls_v12,
        keystorePath: config.portal.keystorePath,
        reconnectionTicketLifetime: config.portal.reconnection_ticket_lifetime,
        reconnectionTimeout: config.portal.reconnection_timeout,
        pingInterval: config.portal.ping_interval,
        pingTimeout: config.portal.ping_timeout
    }, portal, serviceObserver)).start().then(function () {
        log.info("start socket.io server ok."), refreshTokenKey(o, portal, e)
    }).catch(function (o) {
        throw log.error("Failed to start servers, reason:", o && o.message), o
    })
}, stopServers = function () {
    socketio_server && socketio_server.stop(), socketio_server = void 0, worker && worker.quit(), worker = void 0
}, rpcPublic = {
    drop: function (o, e) {
        socketio_server && socketio_server.drop(o), e("callback", "ok")
    }, notify: function (o, e, r, t) {
        socketio_server && socketio_server.notify(o, e, r).catch(function (o) {
        }), t("callback", "ok")
    }
};
amqper.connect(config.rabbit, function () {
    amqper.asRpcClient(function (o) {
        rpcClient = o, log.info("portal initializing as rpc client ok"), joinCluster(function (e) {
            log.info("portal join cluster ok, with rpcID:", e), amqper.asRpcServer(e, rpcPublic, function (o) {
                log.info("portal initializing as rpc server ok"), amqper.asMonitor(function (e) {
                    if (("abnormal" === e.reason || "error" === e.reason || "quit" === e.reason) && void 0 !== portal && "conference" === e.message.purpose) return portal.getParticipantsByController(e.message.type, e.message.id).then(function (o) {
                        o.forEach(function (o) {
                            log.error("Fault on conference controller(type:", e.message.type, "id:", e.message.id, ") of participant", o, "was detected, drop it."), socketio_server && socketio_server.drop(o)
                        })
                    })
                }, function (o) {
                    log.info(e + " as monitor ready"), getTokenKey(e, function (o) {
                        startServers(e, o)
                    }, function () {
                        log.error("portal getting token failed."), stopServers(), process.exit()
                    })
                }, function (o) {
                    log.error("portal initializing as rpc client failed, reason:", o), stopServers(), process.exit()
                })
            }, function (o) {
                log.error("portal initializing as rpc client failed, reason:", o), stopServers(), process.exit()
            })
        })
    }, function (o) {
        log.error("portal initializing as rpc client failed, reason:", o), stopServers(), process.exit()
    })
}, function (o) {
    log.error("portal connect to rabbitMQ server failed, reason:", o), process.exit()
}), ["SIGINT", "SIGTERM"].map(function (o) {
    process.on(o, function () {
        log.warn("Exiting on", o), stopServers(), process.exit()
    })
}), process.on("SIGPIPE", function () {
    log.warn("SIGPIPE!!")
}), process.on("exit", function () {
    amqper.disconnect()
}), process.on("unhandledRejection", function (o) {
    log.info("Reason: " + o)
}), process.on("SIGUSR2", function () {
    logger.reconfigure()
});