const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.config.js');
const path = require('path');


const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(config);

const app = express();
const http = require("http").Server(app);

app.use(express.static('public'));


/*fs.readFile(path.resolve(__dirname, "../weather.json"), "utf8",
    function (error, data) {
        console.log("Асинхронное чтение файла");
        if (error) throw error; // если возникла ошибка

      //  const dataArr = JSON.parse(data, ['name', 'id']);
        fs.writeFile("Weather.txt", data, function (err) {
            if (err) throw err;
        })
    });*/


app.use(webpackDevMiddleware(compiler, {publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.js"))
});

let port = 3001;
http.listen(port, function () {
    setTimeout(() => console.log("Example app listening on port " + port + "!"), 1000);
});
