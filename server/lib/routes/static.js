var compression = require('compression');
var static = require('serve-static');

exports.addRoutes = function(app, config) {
    // First looks for a static file: index.html, css, images, etc.
    app.use(config.server.staticUrl, compression());
    app.use(config.server.staticUrl, static(config.server.distFolder));
    app.use(config.server.staticUrl, function(req, res, next) {
        res.send(404); // If we get here then the request for a static file is invalid
    });
};