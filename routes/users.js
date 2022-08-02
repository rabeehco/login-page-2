const express = require('express')
const router = express.Router()
const User = require('../models/users') 
// const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const sessionChecker = function(req, res, next){
  if(req.session.user){
    res.redirect('/')
  } else {
      next()
  }
}

const isLoggedIn = function(req, res, next){
  if(req.session.user){
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/', isLoggedIn, (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  const user = req.session.user
  res.render('home', {user})
})

router.get('/register', sessionChecker,(req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  const user = req.session.user
   res.render('users/register', {user})
})

router.post('/register', async(req, res) => {
  const ifUser = await User.findOne({username: req.body.username})
  if(ifUser != null){
    req.flash('error', 'User Already Exist')
    res.redirect('/login')
  } else {
    const user = new User(req.body)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    req.session.user = user.username;
    res.redirect('/')

  }
  
})

router.get('/login', sessionChecker,(req, res) => {
  
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');const user = req.session.user

  res.render('users/login', {user})
  
})
                                       
router.post('/login', async(req, res) => {
  const password = req.body.password
  const ifUser = await User.findOne({username: req.body.username})
  if(ifUser === null){
    req.flash('error', 'User Not Exist')
    res.redirect('/login')
  } else{
      const valid = await bcrypt.compare(req.body.password, ifUser.password)
      if(valid){
        req.session.user = ifUser.username;
        res.redirect('/')
      } else {
        req.flash('error', 'User Not Exist')
        res.redirect('/login')
      }
  }
})

router.get('/logout', (req, res) => {
  // res.clearCookie("user_sid");
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;