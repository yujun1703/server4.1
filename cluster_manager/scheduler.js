"use strict";
var logger = require("./logger").logger, Matcher = require("./matcher"), Strategy = require("./strategy"),
    log = logger.getLogger("Scheduler"), isWorkerAvailable = function (e) {
        return e.load < e.info.max_load && (void 0 === e.state || 2 === e.state)
    };
exports.Scheduler = function (e) {
    var r = {}, f = {}, l = {}, k = Matcher.create(e.purpose), v = Strategy.create(e.strategy),
        d = e.scheduleReserveTime, m = function (e, r, t) {
            l[e] && l[e].reserve_timer && clearTimeout(l[e].reserve_timer), l[e] = {
                worker: r,
                reserve_time: t,
                reserve_timer: setTimeout(function () {
                    g(e)
                }, t)
            }
        }, g = function (e) {
            l[e] && (l[e].reserve_timer && clearTimeout(l[e].reserve_timer), delete l[e])
        };
    return r.add = function (e, r) {
        log.debug("Add worker:", e, "info:", r), f[e] && log.warn("Double adding worker:", e), f[e] = {
            state: void 0,
            load: r.max_load || 1,
            info: r,
            tasks: []
        }
    }, r.remove = function (r) {
        log.debug("Remove worker:", r), f[r] && (f[r].tasks.map(function (e) {
            l[e] && l[e].worker === r && g(e)
        }), delete f[r])
    }, r.updateState = function (e, r) {
        f[e] && (f[e].state = r)
    }, r.updateLoad = function (e, r) {
        f[e] && (f[e].load = r)
    }, r.pickUpTasks = function (o, e) {
        f[o] && e.forEach(function (e) {
            var r, t;
            t = e, f[r = o] && (-1 === f[r].tasks.indexOf(t) && f[r].tasks.push(t), l[t] ? (l[t].reserve_timer && clearTimeout(l[t].reserve_timer), l[t].worker !== r && (log.warn("Worker conflicts for task:", t, "and update to worker:", r), l[t].worker = r)) : l[t] = {
                reserve_time: d,
                worker: r
            })
        })
    }, r.layDownTask = function (e, r) {
        f[e] && function (e, r) {
            var t = !1;
            if (f[e]) {
                var o = f[e].tasks.indexOf(r);
                -1 !== o && (f[e].tasks.splice(o, 1), t = !0)
            }
            l[r] && (t ? m(r, e, l[r].reserve_time) : g(r))
        }(e, r)
    }, r.schedule = function (r, e, t, o, a) {
        if (l[r]) {
            var i = t && l[r].reserve_time < t ? t : l[r].reserve_time, n = l[r].worker;
            if (f[n]) return u = n, l[s = r] && f[u] && u === l[s].worker && -1 !== f[u].tasks.indexOf(s) ? l[r].reserve_time = i : m(r, n, i), o(n, f[n].info);
            g(r)
        }
        var s, u, c = [];
        for (var n in f) isWorkerAvailable(f[n]) && c.push(n);
        if (c.length < 1) return a("No worker available, all in full load.");
        if ((c = k.match(e, f, c)).length < 1) return a("No worker matches the preference.");
        if (1 === c.length) {
            n = c[0];
            return m(r, n, t && 0 < t ? t : d), o(n, f[n].info)
        }
        v.allocate(f, c, function (e) {
            m(r, e, t && 0 < t ? t : d), o(e, f[e].info)
        }, a)
    }, r.unschedule = function (e, r) {
        l[r] && l[r].worker === e && g(r)
    }, r.getInfo = function (e) {
        return f[e]
    }, r.getScheduled = function (e, r, t) {
        l[e] ? r(l[e].worker) : t("No such a task")
    }, r.setScheduled = function (e, r, t) {
        l[e] = {worker: r, reserve_time: t}
    }, r.getData = function () {
        var e = {workers: f, tasks: {}};
        for (var r in l) e.tasks[r] = {reserve_time: l[r].reserve_time, worker: l[r].worker};
        return e
    }, r.setData = function (e) {
        for (var r in f = e.workers, e.tasks) l[r] = e.tasks[r]
    }, r.serve = function () {
        for (var e in l) {
            var r = l[e].worker;
            f[r] && -1 === f[r].tasks.indexOf(e) && m(e, r, l[e].reserve_time)
        }
    }, r
};