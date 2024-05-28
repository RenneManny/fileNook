var express = require('express');
const session = require('express-session');
var router = express.Router();
const auth = require('../middlewares/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

router.get("/dashboard",auth.isUserLoggedin,(req,res)=>{
res.send("Welcome Akhil")
})

module.exports = router;
