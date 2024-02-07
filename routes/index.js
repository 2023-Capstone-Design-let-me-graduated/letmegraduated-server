// index라우터
const express = require('express');
const router = express.Router();
const { renderIndex } = require('../controller/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('안녕');
});

module.exports = router;