"use strict";
var config, Getopt = require("node-getopt"), spawn = require("child_process").spawn, fs = require("fs"),
    toml = require("toml"), logger = require("./logger").logger, log = logger.getLogger("ErizoAgent");
try {
    config = toml.parse(fs.readFileSync("./agent.toml"))
} catch (e) {
    log.error("Parsing config error on line " + e.line + ", column " + e.column + ": " + e.message), process.exit(1)
}
var loadConfig = {};
try {
    loadConfig = require("./loader.json")
} catch (e) {
    log.debug("No loader.json found.")
}
global.config = config || {}, global.config.agent = global.config.agent || {}, global.config.agent.maxProcesses = global.config.agent.maxProcesses || 13, global.config.agent.prerunProcesses = global.config.agent.prerunProcesses || 2, global.config.cluster = global.config.cluster || {}, global.config.cluster.name = global.config.cluster.name || "woogeen-cluster", global.config.cluster.join_retry = global.config.cluster.join_retry || 60, global.config.cluster.report_load_interval = global.config.cluster.report_load_interval || 1e3, global.config.cluster.max_load = global.config.cluster.max_load || .85, global.config.cluster.network_max_scale = global.config.cluster.network_max_scale || 1e3, global.config.internal.ip_address = global.config.internal.ip_address || "", global.config.internal.network_interface = global.config.internal.network_interface || void 0, global.config.capacity = global.config.capacity || {}, global.config.webrtc = global.config.webrtc || {}, global.config.webrtc.ip_address = global.config.webrtc.ip_address || "", global.config.webrtc.network_interface = global.config.webrtc.network_interface || void 0, global.config.recording = global.config.recording || {}, global.config.recording.path = global.config.recording.path || "/tmp", global.config.video = global.config.video || {}, global.config.video.hardwareAccelerated = !!global.config.video.hardwareAccelerated, global.config.video.enableBetterHEVCQuality = !!global.config.video.enableBetterHEVCQuality;
var getopt = new Getopt([["r", "rabbit-host=ARG", "RabbitMQ Host"], ["g", "rabbit-port=ARG", "RabbitMQ Port"], ["l", "logging-config-file=ARG", "Logging Config File"], ["M", "maxProcesses=ARG", "Stun Server URL"], ["P", "prerunProcesses=ARG", "Default video Bandwidth"], ["U", "my-purpose=ARG", "Purpose of this agent"], ["h", "help", "display this help"]]),
    myId = "", myPurpose = "webrtc", myState = 2, reuse = !0, opt = getopt.parse(process.argv.slice(2));
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
        case"my-purpose":
            "conference" === value || "webrtc" === value || "sip" === value || "streaming" === value || "recording" === value || "audio" === value || "video" === value ? myPurpose = value : process.exit(0);
            break;
        default:
            global.config.agent[prop] = value
    }
}
var rpcClient, monitoringTarget, worker, clusterWorker = require("./clusterWorker"),
    amqper = require("./amqp_client")(), erizo_index = 0, idle_erizos = [], erizos = [], processes = {}, tasks = {},
    load_collection = {period: global.config.cluster.report_load_interval}, capacity = global.config.capacity,
    spawn_failed = !1;

function cleanupErizoJS(e) {
    processes[e].check_alive_interval && clearInterval(processes[e].check_alive_interval), processes[e].check_alive_interval = void 0, delete processes[e], delete tasks[e];
    var o = erizos.indexOf(e);
    -1 !== o && erizos.splice(o, 1), -1 !== (o = idle_erizos.indexOf(e)) && idle_erizos.splice(o, 1)
}

var clusterIP, clusterInterface, launchErizoJS = function () {
    var r = myId + "_" + erizo_index++;
    fs.existsSync("../logs") || fs.mkdirSync("../logs");
    var e = fs.openSync("../logs/" + r + ".log", "a"), o = fs.openSync("../logs/" + r + ".log", "a"), i = "node";
    !process.env.NODE_DEBUG_ERIZO && loadConfig.bin && (i = "./" + loadConfig.bin);
    var n = ["./erizoJS.js", r, myPurpose, JSON.stringify(webrtcInterfaces), clusterIP, myId];
    "erizoJS" === loadConfig.bin && n.shift();
    var a = spawn(i, n, {detached: !0, stdio: ["ignore", e, o, "ipc"]});
    a.unref(), a.out_log_fd = e, a.err_log_fd = o, log.debug("launchErizoJS, id:", r), a.on("close", function (e, o) {
        log.debug("Node", r, "exited with code:", e, "signal:", o), 0 !== e && log.info("Node", r, "is closed on unexpected code:", e), processes[r] && (monitoringTarget && monitoringTarget.notify("abnormal", {
            purpose: myPurpose,
            id: r,
            type: "node"
        }), cleanupErizoJS(r));
        try {
            fs.closeSync(a.out_log_fd), fs.closeSync(a.err_log_fd)
        } catch (e) {
            log.warn("Close fd failed")
        }
        spawn_failed || fillErizos()
    }), a.on("error", function (e) {
        log.error("failed to launch worker", r, "error:", JSON.stringify(e)), a.READY = !1, spawn_failed = !0, setTimeout(function () {
            spawn_failed = !1
        }, 2e3)
    }), a.on("message", function (e) {
        log.debug("message from node", r, ":", e), "READY" === e ? (a.READY = !0, a.check_alive_interval = setInterval(function () {
            a.READY && rpcClient.remoteCall(r, "keepAlive", [], {
                callback: function (e) {
                    !0 !== e && (log.info("Node(", r, ") is no longer responsive!"), dropErizoJS(r), monitoringTarget && monitoringTarget.notify("abnormal", {
                        purpose: myPurpose,
                        id: r,
                        type: "node"
                    }))
                }
            })
        }, 3e3), spawn_failed = !1) : (a.READY = !1, a.kill(), fs.closeSync(a.out_log_fd), fs.closeSync(a.err_log_fd), cleanupErizoJS(r))
    }), processes[r] = a, tasks[r] = {}, idle_erizos.push(r)
}, dropErizoJS = function (e) {
    log.debug("dropErizoJS, id:", e), processes.hasOwnProperty(e) && (processes[e].kill(), cleanupErizoJS(e))
}, dropAll = function (o) {
    Object.keys(processes).map(function (e) {
        dropErizoJS(e), !o && monitoringTarget && monitoringTarget.notify("abnormal", {
            purpose: myPurpose,
            id: e,
            type: "node"
        })
    })
}, fillErizos = function () {
    for (var e = idle_erizos.length; e < global.config.agent.prerunProcesses; e++) launchErizoJS()
}, addTask = function (e, o, r) {
    tasks[o] = tasks[o] || {}, tasks[o][r.room] = tasks[o][r.room] || [], -1 === tasks[o][r.room].indexOf(r.task) && e && e.addTask(r.task), tasks[o][r.room].push(r.task)
}, removeTask = function (e, o, r, i) {
    if (tasks[o] && tasks[o][r.room]) {
        var n = tasks[o][r.room].indexOf(r.task);
        -1 < n && tasks[o][r.room].splice(n, 1), -1 === tasks[o][r.room].indexOf(r.task) && e && e.removeTask(r.task), 0 === tasks[o][r.room].length && (delete tasks[o][r.room], 0 === Object.keys(tasks[o]).length && i())
    }
}, api = function (l) {
    return {
        getNode: function (n, a) {
            log.debug("getNode, task:", n);
            var e = function (o, e) {
                var r = 0, i = e / 100 + 1;
                !function e() {
                    if (processes[o]) return void 0 === processes[o].READY ? (log.debug(o, "not ready"), void(r < i ? (r += 1, setTimeout(e, 100)) : (dropErizoJS(o), a("callback", "error", "node not ready")))) : void(!0 === processes[o].READY && (log.debug(o, "ready"), a("callback", o), addTask(l, o, n)));
                    log.warn("process", o, "not found")
                }()
            };
            try {
                var o, r = n.room;
                if (reuse) {
                    var i;
                    for (i in erizos) if (o = erizos[i], void 0 !== tasks[o] && void 0 !== tasks[o][r]) return void e(o, 1500);
                    for (i in idle_erizos) if (o = idle_erizos[i], void 0 !== tasks[o] && void 0 !== tasks[o][r]) return void e(o, 1500)
                }
                if (idle_erizos.length < 1) return log.error("getNode error:", "No available worker"), a("callback", "error", "No available worker");
                e(o = idle_erizos.shift(), 1500), erizos.push(o), reuse && "conference" !== myPurpose && "sip" !== myPurpose && erizos.length + idle_erizos.length >= global.config.agent.maxProcesses ? idle_erizos.push(erizos.shift()) : fillErizos()
            } catch (e) {
                log.error("getNode error:", e)
            }
        }, recycleNode: function (e, o, r) {
            log.debug("recycleNode, id:", e, "task:", o);
            try {
                removeTask(l, e, o, function () {
                    dropErizoJS(e)
                }), r("callback", "ok")
            } catch (e) {
                log.error("recycleNode error:", e)
            }
        }, queryNode: function (e, o) {
            for (var r in tasks) if (void 0 !== tasks[r][e]) return o("callback", r);
            return o("callback", "error")
        }
    }
}, webrtcInterfaces = global.config.webrtc.network_interfaces || [];

function collectIPs() {
    var e, o, r, i, n = require("os").networkInterfaces();
    for (o in n) if (n.hasOwnProperty(o)) for (r in n[o]) if (n[o].hasOwnProperty(r) && "IPv4" === (i = n[o][r]).family && !i.internal) {
        var a = webrtcInterfaces.find(function (e) {
            return e.name === o
        });
        a && (a.ip_address = i.address), clusterInterface || o !== global.config.internal.network_interface && global.config.internal.network_interface || (clusterInterface = o, e = i.address)
    }
    clusterIP = "" === global.config.internal.ip_address || void 0 === global.config.internal.ip_address ? e : global.config.internal.ip_address
}

var joinCluster = function (o) {
    worker = clusterWorker({
        rpcClient: rpcClient,
        purpose: myPurpose,
        clusterName: global.config.cluster.name,
        joinRetry: global.config.cluster.join_retry,
        info: {
            ip: clusterIP,
            purpose: myPurpose,
            state: 2,
            max_load: global.config.cluster.max_load,
            capacity: global.config.capacity
        },
        onJoinOK: function (e) {
            myId = e, myState = 2, log.info(myPurpose, "agent join cluster ok."), o(e)
        },
        onJoinFailed: function (e) {
            log.error(myPurpose, "agent join cluster failed. reason:", e), process.exit()
        },
        onLoss: function () {
            log.info(myPurpose, "agent lost."), dropAll(!1), fillErizos()
        },
        onRecovery: function () {
            log.info(myPurpose, "agent recovered.")
        },
        onOverload: function () {
            log.warn(myPurpose, "agent overloaded!"), "recording" === myPurpose && dropAll(!1)
        },
        loadCollection: load_collection
    })
};
!function () {
    switch (reuse = "audio" !== myPurpose && "video" !== myPurpose, collectIPs(), myPurpose) {
        case"webrtc":
            global.config.capacity.isps = global.config.capacity.isps || [], global.config.capacity.regions = global.config.capacity.regions || [];
        case"streaming":
            var e = clusterInterface;
            if (!e) {
                var o = require("os").networkInterfaces();
                for (var r in o) {
                    for (var i in o[r]) if (!o[r][i].internal) {
                        e = r;
                        break
                    }
                    if (e) break
                }
            }
            load_collection.item = {
                name: "network",
                interf: e || "lo",
                max_scale: global.config.cluster.network_max_scale
            };
            break;
        case"recording":
            try {
                fs.accessSync(global.config.recording.path, fs.F_OK)
            } catch (e) {
                log.error("The configured recording path is not accessible."), process.exit(1)
            }
            load_collection.item = {name: "disk", drive: global.config.recording.path};
            break;
        case"sip":
            load_collection.item = {name: "cpu"};
            break;
        case"audio":
        case"conference":
            load_collection.item = {name: "cpu"};
            break;
        case"video":
            var n = require("./videoCapability");
            log.debug("Video Capability:", JSON.stringify(n)), capacity.video = n, global.config.video.codecs = n, load_collection.item = {name: global.config.video.hardwareAccelerated ? "gpu" : "cpu"};
            break;
        default:
            log.error("Ambiguous purpose:", purpose), process.exit()
    }
}(), amqper.connect(global.config.rabbit, function () {
    log.debug("Adding agent to cloudhandler, purpose:", myPurpose), amqper.asRpcClient(function (e) {
        rpcClient = e, joinCluster(function (o) {
            amqper.asRpcServer(o, api(worker), function (e) {
                log.info("as rpc server ok."), amqper.asMonitoringTarget(function (e) {
                    monitoringTarget = e, log.info("as monitoring target ok.")
                }, function (e) {
                    log.error(o + "as monitoring target failed, reason:", e), process.exit()
                })
            }, function (e) {
                log.error(o + " as rpc server failed, reason:", e), process.exit()
            }), fillErizos()
        })
    }, function (e) {
        log.error("Agent as rpc client failed, reason:", e), process.exit()
    })
}, function (e) {
    log.error("Agent connect to rabbitMQ server failed, reason:", e), process.exit()
}), ["SIGINT", "SIGTERM"].map(function (e) {
    process.on(e, function () {
        log.warn("Exiting on", e), process.exit()
    })
}), process.on("exit", function () {
    dropAll(!0), worker && worker.quit(), amqper.disconnect()
}), process.on("unhandledRejection", function (e) {
    log.info("Reason: " + e)
}), process.on("SIGUSR2", function () {
    logger.reconfigure()
});