const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const userModel = require('./models/users');
const registerRouter = require('./router/register');
const adminRouter = require('./router/admin');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(session({
  secret: "qerwaiaejgijerg",
  saveUninitialized: true,
  resave: false
}));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userdata')
.then(app.listen(PORT, ()=>{
  console.log(`server is listening on port ${PORT}`);
}))
.catch(error => {
  console.log(`Couldn't connect to database`);
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once('open', ()=>{
  console.log("connected succesfully");
});

// const user = "Aravind";
// const pass = "1234";

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
    const name = req.session.username;
    res.render('home', {name})
  }else if(req.session.loggedin){
    res.redirect('/admin')
  }else{
    if(req.session.message){
      const message = req.session.message;
      req.session.message = "";
      res.render('login', {message});
    }else{
      const message = ""
      res.render('login', {message});
    }
  }
});
app.get('/', (req, res)=>{
  if(req.session.username){
    const name = req.session.username;
    res.render('home', {name})
  }else if(req.session.loggedin){
    res.redirect('/admin')
  }else{
    res.redirect('/login')
  }
});
app.post('/', async (req, res)=>{
  const user = await userModel.find({email: req.body.email})
  if(user.length == 0){
    req.session.message = "User with given credentials does not exist"
    res.redirect('/login');
  }else if(req.body.password!=user[0].password){
    req.session.message = "Incorrect Password"
    res.redirect('/login');
  }else{
    req.session.username = user[0].fname;
    res.redirect('/');
    // res.send('hello')
  }
});
//change register so that it prevents duplicate registering
app.post('/login', async (req, res) =>{
  const existing = await userModel.find({email: req.body.email});
  if(existing.length == 0){
    const user = new userModel({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    });
    try{
      await user.save();
      res.redirect('/logout');
    }catch(error){
      res.status(500).send(error);
    }
  }else{
    req.session.register = "User already exists. Please sign in";
    res.redirect('/register')
  }
  
})
app.get('/logout', (req, res)=>{
  if(req.session.loggedin){
    res.redirect('/admin/home')
  }else{
    req.session.destroy();
    res.redirect('/login');
  }
});

