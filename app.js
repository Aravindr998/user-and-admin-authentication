const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const userModel = require('./models/users');
const registerRouter = require('./router/register');
const adminRouter = require('./router/admin');
const { urlencoded } = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(urlencoded({ extended:false }));
app.use(session({
  secret: "qerwaiaejgijerg",
  saveUninitialized: true,
  resave: false
}));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userdata')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once('open', ()=>{
  console.log("connected succesfully");
});

const user = "Aravind";
const pass = "1234";

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}))
app.use(express.static('./public'));

app.use('/register', registerRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.get('/login', (req,res)=>{
  if(req.session.username){
    res.render('home')
  }else if(req.session.loggedin){
    res.redirect('/admin')
  }else{
    res.render('login')
  }
});
app.get('/', (req, res)=>{
  if(req.session.username){
    res.render('home')
  }else if(req.session.loggedin){
    res.redirect('/admin')
  }else{
    res.redirect('/login')
  }
});
app.post('/', (req, res)=>{
  if(req.body.username!=user){
    res.redirect('/login');
  }else if(req.body.password!=pass){
    res.redirect('/login');
  }else{
    req.session.username = req.body.username;
    res.redirect('/');
  }
});
app.get('/logout', (req, res)=>{
  req.session.destroy();
  res.redirect('/login');
});

app.listen(PORT, ()=>{
  console.log(`server is listening on port ${PORT}`);
});