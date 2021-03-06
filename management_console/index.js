"use strict";
var config, fs = require("fs"), toml = require("toml"), url = require("url");
try {
    config = toml.parse(fs.readFileSync("./management_console.toml"))
} catch (e) {
    console.log("Parsing config error on line " + e.line + ", column " + e.column + ": " + e.message), process.exit(1)
}
var port = config.console.port || 3300, nuveHost = config.nuve.host || "http://localhost:3000",
    keystorePath = config.console.keystorePath || "./cert/certificate.pfx", express = require("express"),
    app = express();
app.use("/console", express.static(__dirname + "/public"));
var httpProxy = require("http-proxy"), proxyOption = {};
"https:" !== url.parse(nuveHost).protocol || config.nuve.secure || (proxyOption.secure = !1);
var proxy = httpProxy.createProxyServer(proxyOption);
proxy.on("error", function (e) {
    console.log(e)
});
var allowedPaths = ["/v1/rooms", "/services"], isAllowed = function (e) {
    var r;
    for (r = 0; r < allowedPaths.length; r++) if (0 === e.indexOf(allowedPaths[r])) return !0;
    return !1
};
if (app.use(function (e, r) {
    if (isAllowed(e.path)) try {
        proxy.web(e, r, {target: nuveHost})
    } catch (e) {
        r.status(400).send("Invalid path")
    } else r.status(404).send("Resource not found")
}), config.console.ssl) {
    var path = require("path"), cipher = require("./cipher"),
        keystore = path.resolve(path.dirname(keystorePath), ".woogeen.keystore");
    cipher.unlock(cipher.k, keystore, function (r, e) {
        if (r) return log.warn("Failed to setup secured server:", r), process.exit(1);
        try {
            require("https").createServer({
                pfx: require("fs").readFileSync(keystorePath),
                passphrase: e
            }, app).listen(port), console.log("Start management-console HTTPS server")
        } catch (e) {
            r = e
        }
    })
} else app.listen(port), console.log("Start management-console HTTP server");