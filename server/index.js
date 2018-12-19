const express = require('express');
const path = require('path');


const app = express();
const http = require("http").Server(app);

app.use(express.static('public'));
app.use(express.static('dist'));



app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.js"))
});

let port = 3001;
http.listen(port, function () {
    setTimeout(() => console.log("Example app listening on port " + port + "!"), 1000);
});
