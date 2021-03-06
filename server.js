require("dotenv").config();

const express = require("express");
var path = require('path');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path');

const user = require("./server/routes/user.route");
const app = express();

let dev_db_url = "mongodb://ionut:123qwe@ds125713.mlab.com:25713/webchatdb";
const mongodb = dev_db_url;
mongoose.connect(mongodb);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.static(path.join(__dirname, 'dist/chat-app')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/chat-app/index.html'));
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Authorization, SendBird, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, HEAD"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/users", user);

app.use(express.static(__dirname + '/dist/chat-app'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/chat-app/index.html'));
})

let port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(new Date() + " Server is listening on port " + port);
});