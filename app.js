require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const flash = require('connect-flash')
const dbUrl = 'mongodb://127.0.0.1:/webform'

// const User = require('./models/users')
const userRoutes = require('./routes/users');
const { json } = require('express');

mongoose.connect(dbUrl)
.then(() => {
    console.log('DB Connected!')
})

app.engine('ejs', ejsMate) /* For adding layout/boilerplate */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public')); /* for adding css file */
app.use(express.urlencoded({extended: true})) 
app.use(cookieParser())

const secret = 'thisshouldbeabettersecret!'

const sessionConfig = {
    key: 'user_sid',
    secret,
    resave: false, /* false */
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }    
}


app.use(session(sessionConfig))
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error') 
   
    // console.log('cookies.user_sid: '+req.cookies.user_sid)
    // console.log('Req.session.user: ' + req.session.user)
    next()
})



    

app.use('/', userRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Serving Port ${port}`)
})
