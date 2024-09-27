var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let flash = require('express-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tugasRouter = require('./routes/tugas');
var materiRouter = require('./routes/materi');
var pengumumanRouter = require('./routes/pengumuman');
var mahasiswaRouter = require('./routes/mahasiswa');
var dosenRouter = require('./routes/dosen');
var absensiRouter = require('./routes/absensi');
var jadwalRouter = require('./routes/jadwal');
var matakuliahRouter = require('./routes/matakuliah');  // dari temanmu

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {
    maxAge: 600000000
  },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tugas', tugasRouter);
app.use('/materi', materiRouter);
app.use('/pengumuman', pengumumanRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/dosen', dosenRouter);
app.use('/absensi', absensiRouter);
app.use('/jadwal', jadwalRouter);
app.use('/matakuliah', matakuliahRouter);  // dari temanmu

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
