var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const serveStatic = require('serve-static')

//dotenv.config({ path: '.env.example' });
dotenv.config({ path: '.env' });

const app = express();
const dbRouter = require("./routes/db");
const gameRouter = require("./routes/game");
const userRouter = require("./routes/user");

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
// console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(db => {
  console.log(`MongoDB Connected: ${db.connection.host}`)
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


// app.set('port', process.env.PORT || 3000);
app.set('port', 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'web')));
app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use("/db", dbRouter);  // db endpoints for mongoose db host in atlas
app.use("/game", gameRouter);
app.use("/users", userRouter);

// development serving vue home page   (MUST HAVE dist dir in server)
// app.use(express.static(__dirname + "/dist/"));
// app.use('/', (req, res) => {
//   res.sendFile(__dirname + 'dist/index.html')
// })

/* Tells the application where public files like images, styling, and the minified javascript code lives */
//app.use(express.static(path.join(__dirname, '..', 'web', 'dist')));

// Handle production
// if (process.env.NODE_ENV ==='production') {
//   // static folder
//   app.use(express.static(__dirname + "/public/"));

// Handle Single page asset
//   app.use('/', (req, res) => {
//     res.sendFile(__dirname + 'public/index.html')
//   })
// }

// error handler
app.use(function (err, req, res, next) {
  status = err.status || 500
  message = err.message || 'Internal Server Error'

  console.error('[error] ' + err.stack)
  res.status(500).json({ status: status })
});

app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080

// Start server to listen on port
app.listen(app.get('port'), () => {
  console.log('App is running at port %d', app.get('port'));
});