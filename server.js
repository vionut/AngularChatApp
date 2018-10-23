/**
 * Necessary imports
 */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const user = require("./routes/user.route");

/**
 * Create the express server which handles
 * CRUD operations
 */
const app = express();

let dev_db_url = "mongodb://ionut:123qwe@ds125713.mlab.com:25713/webchatdb";
const mongodb = dev_db_url;
mongoose.connect(mongodb);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(function(req, res, next) {
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

app.listen(3005, () => {
  console.log(new Date() + " Server is listening on port " + 3005);
});

/**
 * Create the websocket server which handles
 * chat comunication
 */

// const server = http.createServer((req, res) => {});
// server.listen(1337, () => {
//   console.log(new Date() + " Web Socket is listening on port " + 1337);
// });

// const wsServer = new WebSocketServer({
//   httpServer: server
// });

// const history = [];
// const users = [];
// const colors = [
//   "red",
//   "green",
//   "blue",
//   "yellow",
//   "magenta",
//   "purple",
//   "orange",
//   "redorange"
// ];
// wsServer.on("request", req => {
//   console.log(new Date() + " Connection from origin " + req.origin + ".");
//   const connection = req.accept(null, req.origin);

//   let index = users.push(connection) - 1;
//   let userName;
//   let userColor;

//   console.log(new Date() + " Connection accepted.");

//   // send back chat history
//   if (history.length > 0) {
//     connection.sendUTF(JSON.stringify({ type: "history", data: history }));
//   }

//   // handle all messages from users
//   connection.on("message", message => {
//     if (message.type === "utf8") {
//       // process message
//       if (!userName) {
//         // remember username
//         userName = message.utf8Data;
//         userColor = colors.shift();

//         console.log(
//           new Date() + " User is known as: " + userName + " color: " + userColor
//         );
//         connection.sendUTF(
//           JSON.stringify({ type: "status", user: userName, color:userColor})
//         );
//       } else {
//         console.log(
//           new Date() +
//             " Received Message from " +
//             userName +
//             ": " +
//             message.utf8Data
//         );

//         // keep message history
//         const messageReceived = {
//           time: new Date().getTime(),
//           text: message.utf8Data,
//           author: userName,
//           color: userColor
//         };
//         history.push(messageReceived);

//         // send message to all connected users
//         const json = JSON.stringify({ type: "message", data: messageReceived });
//         users.forEach(user => {
//           user.sendUTF(json);
//         });
//       }
//     }
//   });

//   connection.on("close", con => {
//     // close connection
//     if (userName) {
//       console.log(
//         new Date() + " User " + connection.remoteAddress + " disconnected."
//       );

//       // remove user from the list of connected users
//       users.splice(index, 1);
//       // push back user's color to be reused by another user
//       colors.push(userColor);
//     }
//   });
// });
