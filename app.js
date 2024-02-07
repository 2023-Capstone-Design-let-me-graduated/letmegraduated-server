const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const app = express();

// 호스트
app.set('port', process.env.PORT || 3000);

app.use(indexRouter);
app.use(authRouter);
app.use(userRouter);
// app.use('/signup',signupRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send("오류 발생");
});

app.listen(app.get("port"),(req,res,next)=>{
  console.log(app.get("port")+"에서 대기중");
})

module.exports = app;