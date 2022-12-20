const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

router.get('/', (req, res)=>{
  if(req.session.username){
    res.redirect('/')
  }else{
    res.render('register')
  }
});
module.exports = router;