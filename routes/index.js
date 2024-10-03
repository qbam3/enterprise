var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')
const bcrypt = require('bcrypt')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethol' });
});

router.get('/register', function(req, res, next){
  res.render('auth/register')
})

router.get('/admin_log', (req, res, next)=> {
  res.render('auth/admin')
});


router.get('/login', function(req, res, next){
  res.render('auth/login')
})

router.post('/saveusers', async (req, res)=>{
  let {username, password, role, email} =
  req.body
  let enkripsi = await bcrypt.hash(password, 10);
  let data = {
    username,
    password: enkripsi,
    email,
    role
  }
  await model_users.store(data);
  req.flash('success', 'berhasil register');
  res.redirect('/login')
  
})

router.post('/log', async (req, res)=>{
  let {email, password} = req.body;
  try {
      let data = await model_users.Login(email);
      if (data.length > 0) {
          let enkripsi = data[0].password;
          let cek = await bcrypt.compare(password, enkripsi);
          
          if (cek) {
              req.session.userId = data[0].id_users;
              req.flash('success', 'Berhasil login');
              res.redirect('/users');
          } else {
              req.flash('error', 'Password atau email salah');
              res.redirect('/login');
          }
      }else{
        req.flash('error', 'akun tidak ada')
        res.redirect('/login')
      }
  } catch (err) {
    req.flash('error', 'Terjadi kesalahan. Silakan coba lagi.');
    res.redirect('/login');
  }
})

router.get('/logout', (req, res)=>{
  req.session.destroy(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/login')
    }
  })
})

module.exports = router;
