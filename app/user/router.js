var express = require('express');
var router = express.Router();
const { view_signin, actionSignin, actionLogout } = require('./controller')

/* GET home page. */
router.get('/', view_signin);
router.post('/', actionSignin);
router.use('/logout', actionLogout);


module.exports = router;