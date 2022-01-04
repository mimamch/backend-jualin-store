var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, viewEdit, actionStatus, actionEdit, actionDelete } = require('./controller')

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/status/:id', actionStatus);
router.put('/edit/:id', actionEdit);
router.delete('/delete/:id', actionDelete);

module.exports = router;