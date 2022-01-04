var express = require('express');
var router = express.Router();
const {
    index
} = require('./controller')
const {isLoginAdmin} = require('../middleware/auth')
router.use(isLoginAdmin)
/* GET home page. */
router.get('/', index);


module.exports = router;