const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.dev.js');
const path = require('path');


const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(config);

const app = express();
const http = require("http").Server(app);

app.use(express.static('public'));

app.use(webpackDevMiddleware(compiler, {publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.js"))
});

let port = 3001;
http.listen(port, function () {
    setTimeout(() => console.log("Example app listening on port " + port + "!"), 1000);
});
