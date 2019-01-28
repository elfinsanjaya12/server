require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

// router
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user')
const itemRouter = require('./routes/item')
const shopRouter = require('./routes/shop')

if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(process.env.MLAB, { useNewUrlParser: true });
} else {
  mongoose.connect("mongodb://localhost/inginJajanTest", { useNewUrlParser: true });
}

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/users', userRouter)
app.use('/items', itemRouter)
app.use('/shop', shopRouter)


module.exports = app;
