"use strict";
var logger = require("./logger").logger, log = logger.getLogger("Nuve"), fs = require("fs"), toml = require("toml");
try {
    global.config = toml.parse(fs.readFileSync("./nuve.toml"))
} catch (e) {
    log.error("Parsing config error on line " + e.line + ", column " + e.column + ": " + e.message), process.exit(1)
}
var e = require("./errors"), rpc = require("./rpc/rpc"), express = require("express"),
    bodyParser = require("body-parser"), app = express(), nuveAuthenticator = require("./auth/nuveAuthenticator"),
    roomsResource = require("./resource/roomsResource"), roomResource = require("./resource/roomResource"),
    tokensResource = require("./resource/tokensResource"), servicesResource = require("./resource/servicesResource"),
    serviceResource = require("./resource/serviceResource"),
    participantsResource = require("./resource/participantsResource"),
    streamsResource = require("./resource/streamsResource"),
    streamingOutsResource = require("./resource/streamingOutsResource"),
    recordingsResource = require("./resource/recordingsResource");
app.use(bodyParser.urlencoded({extended: !0})), app.use(bodyParser.json()), app.use(function (e, r, o) {
    r.header("Access-Control-Allow-Origin", "*"), r.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PATCH"), r.header("Access-Control-Allow-Headers", "origin, authorization, content-type"), o()
}), app.options("*", function (e, r) {
    r.send(200)
});
var authPaths = ["/rooms*", "/v1/rooms*", "/services*", "/cluster*"];
app.get(authPaths, nuveAuthenticator.authenticate), app.post(authPaths, nuveAuthenticator.authenticate), app.delete(authPaths, nuveAuthenticator.authenticate), app.put(authPaths, nuveAuthenticator.authenticate), app.patch(authPaths, nuveAuthenticator.authenticate), app.post("/services", servicesResource.create), app.get("/services", servicesResource.represent), app.get("/services/:service", serviceResource.represent), app.delete("/services/:service", serviceResource.deleteService), app.post("/v1/rooms", roomsResource.createRoom), app.get("/v1/rooms", roomsResource.represent), app.get("/v1/rooms/:room", roomResource.represent), app.delete("/v1/rooms/:room", roomResource.deleteRoom), app.put("/v1/rooms/:room", roomResource.updateRoom), app.patch("/v1/rooms/:room", function (r, o, s) {
    return s(new e.AppError("Not implemented"))
}), app.use("/v1/rooms/:room/*", roomResource.validate), app.get("/v1/rooms/:room/participants", participantsResource.getList), app.get("/v1/rooms/:room/participants/:participant", participantsResource.get), app.patch("/v1/rooms/:room/participants/:participant", participantsResource.patch), app.delete("/v1/rooms/:room/participants/:participant", participantsResource.delete), app.get("/v1/rooms/:room/streams", streamsResource.getList), app.get("/v1/rooms/:room/streams/:stream", streamsResource.get), app.patch("/v1/rooms/:room/streams/:stream", streamsResource.patch), app.delete("/v1/rooms/:room/streams/:stream", streamsResource.delete), app.post("/v1/rooms/:room/streaming-ins", streamsResource.addStreamingIn), app.delete("/v1/rooms/:room/streaming-ins/:stream", streamsResource.delete), app.get("/v1/rooms/:room/streaming-outs", streamingOutsResource.getList), app.post("/v1/rooms/:room/streaming-outs", streamingOutsResource.add), app.patch("/v1/rooms/:room/streaming-outs/:id", streamingOutsResource.patch), app.delete("/v1/rooms/:room/streaming-outs/:id", streamingOutsResource.delete), app.get("/v1/rooms/:room/recordings", recordingsResource.getList), app.post("/v1/rooms/:room/recordings", recordingsResource.add), app.patch("/v1/rooms/:room/recordings/:id", recordingsResource.patch), app.delete("/v1/rooms/:room/recordings/:id", recordingsResource.delete), app.post("/v1/rooms/:room/tokens", tokensResource.create), app.use("*", function (r, o, s) {
    s(new e.NotFoundError)
}), app.use(function (r, o, s, t) {
    log.debug(r), r instanceof e.AppError || (r instanceof SyntaxError ? r = new e.BadRequestError("Failed to parse JSON body") : (log.warn(r), r = new e.AppError(r.name + " " + r.message))), s.status(r.status).send(r.data)
});
var nuveConfig = global.config.nuve || {}, cluster = require("cluster"), nuvePort = nuveConfig.port || 3e3,
    numCPUs = nuveConfig.numberOfProcess || 1;
if (cluster.isMaster) {
    var dataAccess = require("./data_access");
    dataAccess.token.genKey();
    for (var i = 0; i < numCPUs; i++) cluster.fork();
    cluster.on("exit", function (e, r, o) {
        log.info("Worker " + e.process.pid + " died")
    }), ["SIGINT", "SIGTERM"].map(function (e) {
        process.on(e, function () {
            log.info("Master exiting on", e), process.exit()
        })
    }), process.on("SIGUSR2", function () {
        logger.reconfigure()
    })
} else {
    if (rpc.connect(global.config.rabbit), !0 === nuveConfig.ssl) {
        var cipher = require("./cipher"), path = require("path"),
            keystore = path.resolve(path.dirname(nuveConfig.keystorePath), ".woogeen.keystore");
        cipher.unlock(cipher.k, keystore, function (r, e) {
            if (r) return log.warn("Failed to setup secured server:", r), process.exit(1);
            try {
                require("https").createServer({
                    pfx: require("fs").readFileSync(nuveConfig.keystorePath),
                    passphrase: e
                }, app).listen(nuvePort)
            } catch (e) {
                r = e
            }
        })
    } else app.listen(nuvePort);
    log.info("Worker " + process.pid + " started"), ["SIGINT", "SIGTERM"].map(function (e) {
        process.on(e, function () {
            log.warn("Worker exiting on", e), process.exit()
        })
    }), process.on("exit", function () {
        rpc.disconnect()
    }), process.on("SIGUSR2", function () {
        logger.reconfigure()
    })
}