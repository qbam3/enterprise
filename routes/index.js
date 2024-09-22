var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const model_users = require('../model/model_users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});
router.post('/save', async function(req, res, next) {
  let {name, email,password} = req.body;
  console.log(name);
  let enkripsi = await bcrypt.hash(password,10);
  let data = {
    name,
    email,
    password: enkripsi
  };
  await model_users.store(data);
  req.flash('success', 'register berhasil!');
  res.redirect('/login');
});

router.post('/log', async function(req, res) {
  console.log(req.session);
  let {email, password} = req.body;
  try{
    let data = await model_users.Login(email);
    if(data.length > 0){
      let enkripsi = data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if(cek){
        req.session.userId = data[0].id;
        req.flash('success', 'login berhasil');
        res.redirect('/users');
      }
      else{
        req.flash('error','Akun tidak ditemukan');
        res.redirect('/login');
      }
    }
    else{
      req.flash('error', 'Error akun tidak ditemukan');
      res.redirect('/login')
    }
  }
  catch{
    req.flash('error','Error pada fungsi');
    res.redirect('/login');
  }
})

router.get('/logout',function(req, res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/login');
    }
  });
});

module.exports = router;