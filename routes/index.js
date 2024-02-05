// index라우터
const express = require('express');
const router = express.Router();
const { renderIndex } = require('../controller/index');

/* GET home page. */
router.get('/', renderIndex);

module.exports = router;
