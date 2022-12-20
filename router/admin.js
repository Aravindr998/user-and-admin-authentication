const express = require('express');
const session = require('express-session');
const router = express.Router();

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

const username = "admin";
const password = "1234";

router.get('/', (req, res)=> {
  if(req.session.loggedin){
    res.redirect('/admin/home')
  }else if(req.session.username){
    res.redirect('/')
  }else{
    res.render('admin-login');
  }
});

router.get('/home', (req, res)=>{
  if(req.session.loggedin){
    res.render('admin-home');
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

router.post('/', (req, res)=>{
  if(req.body.username != username){
    res.redirect('/admin');
  }else if(req.body.password != password){
    res.redirect('/admin');
  }else{
    req.session.loggedin = true;
    res.redirect('/admin/home')
  }
});

router.get('/logout', (req, res)=>{
  req.session.destroy();
  res.redirect('/admin')
})


module.exports = router;