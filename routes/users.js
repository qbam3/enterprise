var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')


/* GET users listing. */
router.get('/', (req, res, next)=> {
    res.render('users/index')
});

module.exports = router;
