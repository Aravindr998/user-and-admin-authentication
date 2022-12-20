const express = require('express');
const router = express.Router();
router.get('/', (req, res)=>{
  if(req.session.username){
    res.redirect('/')
  }else{
    res.render('register')
  }
});

module.exports = router;