var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pengumuman/index');
});
router.get('/create', function(req, res, next) {
  res.render('pengumuman/create');
});

module.exports = router;
