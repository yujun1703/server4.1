"use strict";
var logger = require("./logger").logger, Scheduler = require("./scheduler").Scheduler,
    log = logger.getLogger("ClusterManager"), ClusterManager = function (e, a, r) {
        var t, d, o = {name: e, id: a}, p = "initializing", n = !0, s = r.initialTime, u = r.checkAlivePeriod,
            i = r.checkAliveCount, f = {}, l = {}, c = function (e) {
                var a = r.hasOwnProperty(e + "Strategy") ? r[e + "Strategy"] : r.generalStrategy;
                return new Scheduler({purpose: e, strategy: a, scheduleReserveTime: r.scheduleReserveTime})
            }, g = function () {
                for (var e in l) l[e].alive_count += 1, l[e].alive_count > i && (log.info("Worker", e, "is not alive any longer, Deleting it."), y(e))
            }, k = function (e, a, r) {
                return log.debug("workerJoin, purpose:", e, "worker:", a, "info:", r), f[e] = f[e] || c(e), f[e].add(a, r), l[a] = {
                    purpose: e,
                    alive_count: 0
                }, d && d({type: "worker_join", payload: {purpose: e, worker: a, info: r}}), p
            }, y = function (e) {
                log.debug("workerQuit, worker:", e), l[e] && f[l[e].purpose] && (f[l[e].purpose].remove(e), t && t.notify("quit", {
                    purpose: l[e].purpose,
                    id: e,
                    type: "worker"
                }), delete l[e], d && d({type: "worker_quit", payload: {worker: e}}))
            }, v = function (e, a) {
                l[e] && f[l[e].purpose] && f[l[e].purpose].updateState(e, a), d && d({
                    type: "worker_state",
                    payload: {worker: e, state: a}
                })
            }, m = function (e, a) {
                log.debug("reportLoad, worker:", e, "load:", a), l[e] && f[l[e].purpose] && f[l[e].purpose].updateLoad(e, a), d && d({
                    type: "worker_load",
                    payload: {worker: e, load: a}
                })
            }, w = function (e, a) {
                l[e] && f[l[e].purpose] && f[l[e].purpose].pickUpTasks(e, a), d && d({
                    type: "worker_pickup",
                    payload: {worker: e, tasks: a}
                })
            }, b = function (e, a) {
                l[e] && f[l[e].purpose] && f[l[e].purpose].layDownTask(e, a), d && d({
                    type: "worker_laydown",
                    payload: {worker: e, task: a}
                })
            }, h = function (e, a) {
                l[e] && f[l[e].purpose] && f[l[e].purpose].unschedule(e, a), d && d({
                    type: "unscheduled",
                    payload: {worker: e, task: a}
                })
            };
        return o.getRuntimeData = function (e) {
            var a = {schedulers: {}, workers: l};
            for (var r in f) a.schedulers[r] = f[r].getData();
            e(a)
        }, o.registerDataUpdate = function (e) {
            d = e
        }, o.setRuntimeData = function (e) {
            for (var a in log.debug("onRuntimeData, data:", e), n && (n = !1), l = e.workers, e.schedulers) f[a] = c(a), f[a].setData(e.schedulers[a])
        }, o.setUpdatedData = function (e) {
            if (!n) switch (log.debug("onUpdatedData, data:", e), e.type) {
                case"worker_join":
                    k(e.payload.purpose, e.payload.worker, e.payload.info);
                    break;
                case"worker_quit":
                    y(e.payload.worker);
                    break;
                case"worker_state":
                    v(e.payload.worker, e.payload.state);
                    break;
                case"worker_load":
                    m(e.payload.worker, e.payload.load);
                    break;
                case"worker_pickup":
                    w(e.payload.worker, e.payload.tasks);
                    break;
                case"worker_laydown":
                    b(e.payload.worker, e.payload.task);
                    break;
                case"scheduled":
                    f[e.payload.purpose] && f[e.payload.purpose].setScheduled(e.payload.task, e.payload.worker, e.payload.reserve_time);
                    break;
                case"unscheduled":
                    h(e.payload.worker, e.payload.task);
                    break;
                default:
                    log.warn("unknown updated data type:", e.type)
            }
        }, o.serve = function (e) {
            for (var a in n ? setTimeout(function () {
                p = "in-service"
            }, s) : p = "in-service", n = !1, t = e, setInterval(g, u), f) f[a].serve()
        }, o.rpcAPI = {
            join: function (e, a, r, t) {
                t("callback", k(e, a, r))
            }, quit: function (e) {
                y(e)
            }, keepAlive: function (e, a) {
                var r, t;
                t = function (e) {
                    a("callback", e)
                }, l[r = e] ? (l[r].alive_count = 0, t("ok")) : t("whoareyou")
            }, reportState: function (e, a) {
                v(e, a)
            }, reportLoad: function (e, a) {
                m(e, a)
            }, pickUpTasks: function (e, a) {
                w(e, a)
            }, layDownTask: function (e, a) {
                b(e, a)
            }, schedule: function (e, a, r, t, o) {
                var n, s, u, i, l, c;
                n = e, s = a, u = r, i = t, l = function (e, a) {
                    o("callback", {id: e, info: a})
                }, c = function (e) {
                    o("callback", "error", e)
                }, log.debug("schedule, purpose:", n, "task:", s, ", preference:", u, "reserveTime:", i, "while state:", p), "in-service" === p ? f[n] ? f[n].schedule(s, u, i, function (e, a) {
                    log.debug("schedule OK, got  worker", e), l(e, a), d && d({
                        type: "scheduled",
                        payload: {purpose: n, task: s, worker: e, reserve_time: i}
                    })
                }, function (e) {
                    log.warn("schedule failed, purpose:", n, "task:", s, "reason:", e), c("Failed in scheduling " + n + " worker, reason: " + e)
                }) : (log.warn("No scheduler for purpose:", n), c("No scheduler for purpose: " + n)) : (log.warn("cluster manager is not ready."), c("cluster manager is not ready."))
            }, unschedule: function (e, a) {
                h(e, a)
            }, getWorkerAttr: function (e, a) {
                !function (e, a, r) {
                    if (l[e]) {
                        var t = f[l[e].purpose] && f[l[e].purpose].getInfo(e);
                        t = t || {state: 0, load: 0, info: {}, tasks: []}, "portal" === l[e].purpose ? a({
                            id: e,
                            purpose: l[e].purpose,
                            ip: t.info.ip,
                            rpcID: e,
                            state: t.state,
                            load: t.load,
                            hostname: t.info.hostname || "",
                            port: t.info.port || 0,
                            keepAlive: l[e].alive_count
                        }) : a(info)
                    } else r("Worker [" + e + "] does NOT exist.")
                }(e, function (e) {
                    a("callback", e)
                }, function (e) {
                    a("callback", "error", e)
                })
            }, getWorkers: function (e, a) {
                !function (e, a) {
                    if ("all" === e) a(Object.keys(l)); else {
                        var r = [];
                        for (var t in l) l[t].purpose === e && r.push(t);
                        a(r)
                    }
                }(e, function (e) {
                    a("callback", e)
                })
            }, getTasks: function (e, a) {
                var r;
                l[r = e] && f[l[r].purpose] && f[l[r].purpose].getTasks(r)
            }, getScheduled: function (e, a, r) {
                var t, o, n, s;
                o = a, n = function (e) {
                    r("callback", e)
                }, s = function (e) {
                    r("callback", "error", e)
                }, f[t = e] ? f[t].getScheduled(o, n, s) : s("Invalid purpose.")
            }
        }, o
    }, runAsSlave = function (e, a) {
        var r, t = 0;
        log.info("Run as slave."), e.subscribe(["clusterManager.slave.#", "clusterManager.*." + a.id], function (e) {
            "runtimeData" === e.type ? a.setRuntimeData(e.data) : "updateData" === e.type ? a.setUpdatedData(e.data) : "declareMaster" === e.type ? t = 0 : log.info("slave, not concerned message:", e)
        }, function () {
            e.publish("clusterManager.master", {type: "requestRuntimeData", data: a.id}), r = setInterval(function () {
                2 < ++t && (log.info("Lose heart-beat from master."), clearInterval(r), e.unsubscribe(["clusterManager.slave.#", "clusterManager.*." + a.id]), runAsCandidate(e, a, 0))
            }, 30)
        })
    }, runAsMaster = function (r, t) {
        log.info("Run as master.");
        var o = 0;
        r.bus.asRpcServer(t.name, t.rpcAPI, function (e) {
            r.bus.asMonitoringTarget(function (e) {
                t.serve(e), setInterval(function () {
                    o += 1, r.publish("clusterManager.slave", {
                        type: "declareMaster",
                        data: {id: t.id, life_time: o}
                    }), r.publish("clusterManager.candidate", {
                        type: "declareMaster",
                        data: {id: t.id, life_time: o}
                    }), r.publish("clusterManager.master", {type: "declareMaster", data: {id: t.id, life_time: o}})
                }, 20);
                r.subscribe(["clusterManager.master.#", "clusterManager.*." + t.id], function (e) {
                    if ("requestRuntimeData" === e.type) {
                        var a = e.data;
                        log.info("requestRuntimeData from:", a), t.getRuntimeData(function (e) {
                            r.publish("clusterManager.slave." + a, {type: "runtimeData", data: e})
                        })
                    } else "declareMaster" === e.type && e.data.id !== t.id && (log.error("!!Double master!! self:", t.id, "another:", e.data.id), e.data.life_time > o && (log.error("Another master is more senior than me, I quit."), process.exit(1)))
                }, function () {
                    log.info("Cluster manager is in service as master!"), t.registerDataUpdate(function (e) {
                        r.publish("clusterManager.slave", {type: "updateData", data: e})
                    })
                })
            }, function (e) {
                log.error("Cluster manager running as monitoring target failed, reason:", e), process.exit()
            })
        }, function (e) {
            log.error("Cluster manager running as RPC server failed, reason:", e), process.exit()
        })
    }, runAsCandidate = function (a, r) {
        var t, o, n = !0, s = !1, u = function () {
            o && clearInterval(o), t = o = void 0, a.unsubscribe(["clusterManager.candidate.#"]), n ? runAsMaster(a, r) : runAsSlave(a, r)
        };
        log.info("Run as candidate."), a.subscribe(["clusterManager.candidate.#"], function (e) {
            s || (t = setTimeout(u, 160), s = !0), "selfRecommend" === e.type ? e.data > r.id && (n = !1) : "declareMaster" === e.type && (log.info("Someone else became master."), o && clearInterval(o), o = void 0, t && clearTimeout(t), t = void 0, a.unsubscribe(["clusterManager.#"]), runAsSlave(a, r))
        }, function () {
            o = setInterval(function () {
                log.debug("Send self recommendation.."), a.publish("clusterManager.candidate", {
                    type: "selfRecommend",
                    data: r.id
                })
            }, 30)
        })
    };
exports.run = function (e, a, r, t) {
    var o = new ClusterManager(a, r, t);
    runAsCandidate(e, o)
};