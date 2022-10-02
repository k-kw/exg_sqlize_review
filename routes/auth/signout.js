const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  req.logout((err)=>{
    if(err){
        console.log("logout error");
        return next(err);
    }
    res.redirect("/top");
  });
  
});

module.exports = router;