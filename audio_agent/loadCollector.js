"use strict";
var logger = require("./logger").logger, log = logger.getLogger("LoadCollector"),
    child_process = require("child_process"), os = require("os"), cpuCollector = function (e, a) {
        var c = os.cpus(), s = c.length - 1, o = setInterval(function () {
            for (var e = os.cpus(), o = 0, t = 0, r = 0; r <= s; r++) for (var l in e[r].times) {
                var n = e[r].times[l] - c[r].times[l];
                "idle" === l && (o += n), t += n
            }
            c = e, a(1 - o / t), log.debug("cpu usage:", 1 - o / t)
        }, e);
        this.stop = function () {
            log.debug("To stop cpu load collector."), clearInterval(o)
        }
    }, memCollector = function (e, o) {
        var t = setInterval(function () {
            var e = 1 - os.freemem() / os.totalmem();
            o(e), log.debug("mem usage:", e)
        }, e);
        this.stop = function () {
            log.debug("To mem cpu load collector."), clearInterval(t)
        }
    }, diskCollector = function (e, o, c) {
        var t = setInterval(function () {
            var n = 1, a = 0;
            child_process.exec("df -k '" + o.replace(/'/g, "'\\''") + "'", function (e, o, t) {
                if (e) log.error(t); else {
                    var r = o.trim().split("\n"), l = r[r.length - 1].replace(/[\s\n\r]+/g, " ").split(" ");
                    n = l[1], a = l[3], c(Math.round(1e3 * (1 - a / n)) / 1e3)
                }
            })
        }, e);
        this.stop = function () {
            log.debug("To stop disk load collector."), clearInterval(t)
        }
    }, networkCollector = function (e, o, t, r) {
        var a = 0, c = 0, s = 0, i = 0, l = setInterval(function () {
            child_process.exec("awk 'NR>2{if (index($1, \"" + o + "\")==1){print $2, $10}}' /proc/net/dev", function (e, o, t) {
                if (e) log.error(t); else {
                    var r = o.trim().split(" ");
                    if (r.length < 2) return log.warn("not ordinary network load data");
                    var l = Number(r[0]), n = Number(r[1]);
                    s <= l && 0 < s && (a = Math.round(8 * (l - s) / 1048576 * 1e3) / 1e3), i <= n && 0 < i && (c = Math.round(8 * (n - i) / 1048576 * 1e3) / 1e3), s = l, i = n
                }
            })
        }, 1e3), n = setInterval(function () {
            var e = Math.round(1e3 * Math.max(a / t, c / t)) / 1e3;
            r(e)
        }, e);
        this.stop = function () {
            log.debug("To stop network load collector."), l && clearInterval(l), n && clearInterval(n), n = l = void 0
        }
    }, gpuCollector = function (e, o) {
        var t = child_process.spawn("intel_gpu_top", ["-s", "200"]), r = 0, l = new cpuCollector(e, function (e) {
                r = e
            }), a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], c = 0, s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0,
            u = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], d = 0, n = 0;
        t.stdout.on("data", function (e) {
            e.toString().split("\n").forEach(function (e) {
                var o = null;
                if ((o = e.match(/\s+render busy:\s+(\d+)%/)) && null !== o && 1 < o.length) {
                    var t = Number(o[1]), r = a.shift();
                    a.push(t), c = c - r + t
                } else if ((o = e.match(/\s+bitstream busy:\s+(\d+)%/)) && null !== o && 1 < o.length) {
                    var l = Number(o[1]);
                    r = s.shift();
                    s.push(l), i = i - r + l
                } else if ((o = e.match(/\s+blitter busy:\s+(\d+)%/)) && null !== o && 1 < o.length) {
                    var n = Number(o[1]);
                    r = u.shift();
                    u.push(n), d = d - r + n
                }
            }), n = Math.floor(Math.max(c, i, d) / 10) / 100
        });
        var g = setInterval(function () {
            var e = Math.max(n, r);
            o(e)
        }, e);
        this.stop = function () {
            log.debug("To stop gpu load collector."), l && l.stop(), l = void 0, t && t.kill(), t = void 0, g && clearInterval(g), g = void 0
        }
    };
exports.LoadCollector = function (e) {
    var o = {}, t = e.period || 1e3, r = e.item, l = e.onLoad || function (e) {
        log.debug("Got", r.name, "load:", e)
    }, n = void 0;
    switch (o.stop = function () {
        log.info("To stop load collector."), n && n.stop(), n = void 0
    }, r.name) {
        case"network":
            n = new networkCollector(t, r.interf, r.max_scale, l);
            break;
        case"cpu":
            n = new cpuCollector(t, l);
            break;
        case"gpu":
            n = new gpuCollector(t, l);
            break;
        case"memory":
            n = new memCollector(t, l);
            break;
        case"disk":
            n = new diskCollector(t, r.drive, l);
            break;
        default:
            return void log.error("Unknown load item")
    }
    return o
};