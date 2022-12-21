const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const userModel = require('./../models/users');
const adminModel = require('./../models/admin');
const router = express.Router();

mongoose.set('strictQuery', true);
router.use(express.urlencoded({extended:false}));
router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
router.use(express.static('./public'));
router.use(session({
  secret: 'secret-key',
  saveUninitialized: true,
  resave: false
}))

// const username = "admin";
// const password = "1234";

router.get('/', (req, res)=> {
  if(req.session.loggedin){
    res.redirect('/admin/home')
  }else if(req.session.username){
    res.redirect('/')
  }else{
    if(req.session.message){
      const message = req.session.message;
      req.session.message="";
      res.render('admin-login', {message});
    }else{
      const message =""
      res.render('admin-login', {message});
    }
  }
});

router.get('/home', async (req, res)=>{
  let users;
  if(req.session.searchKey!=""){
    const searchKey = req.session.searchKey;
    req.session.searchKey="";
    users = await userModel.find({$or: [{fname: new RegExp(searchKey, 'i')}, {lname: new RegExp(searchKey, 'i')}, {email: new RegExp('^' + searchKey + '$', 'i')}]});
  }else{
    users = await userModel.find();
  }
  if(req.session.loggedin){
    res.render('admin-home', {users});
  }else if(req.session.username){
    res.redirect('/')
  }else{
    res.redirect('/admin');
  }
});

router.get('/user', (req, res)=>{
  if(req.session.loggedin){
    res.render('admin-user');
  }else if(req.session.username){
    res.redirect('/')
  }else{
    res.redirect('/admin');
  }
});

router.post('/', async (req, res)=>{
  const admin = await adminModel.find({username : req.body.username})
  // console.log(admin);
  if(admin.length==0){
    req.session.message = "Incorrect username"
    res.redirect('/admin');
  }else if(req.body.password != admin[0].password){
    req.session.message = "Incorrect password"
    res.redirect('/admin');
  }else{
    req.session.loggedin = true;
    res.redirect('/admin/home')
  }
});

router.post('/home', (req, res) => {
  req.session.searchKey = req.body.search;
  res.redirect('/admin/home');
})

router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try{
    const users = await userModel.find({_id: id});
    const user = users[0];
    res.render('admin-user', {user});
  }catch(error){
    console.log(error);
    res.redirect('/admin')
  }
})

router.put('/user/:id', async(req, res)=>{
  const id = req.params.id;
  try{
    const user = await userModel.findOneAndUpdate({_id:id}, {$set: {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    }});
  }catch(error){
    console.log(error);
  }
})

router.get('/logout', (req, res)=>{
  req.session.destroy();
  res.redirect('/admin')
})


module.exports = router;