const functions = require('firebase-functions');
const admin = require('firebase-admin');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');



const serviceAccount = require("./ohbarak-42e3f-firebase-adminsdk-2num4-f8fe27238e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ohbarak-42e3f.firebaseio.com"
});

const fileBucket = "gs://ohbarak-42e3f.appspot.com";
const starCountRef = admin.database().ref('approved');
const storageBucket = admin.storage().bucket(fileBucket);

const indexRouter = require('./routes/index')(starCountRef, storageBucket);
const recordRouter = require('./routes/record')();
const uploadRouter = require('./routes/upload')();





const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.use('/', indexRouter);
app.use('/record', recordRouter);
app.use('/upload', uploadRouter);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


//
// exports.uploadTrack = functions.https.onRequest((req, res) => {
//     if(req.method !== "POST"){
//         res.sendStatus(200);
//     }
// });


exports.app = functions.https.onRequest(app);


