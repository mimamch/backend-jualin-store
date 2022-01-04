var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, actionStatus, viewEdit, actionEdit, actionDelete } = require('./controller')
const multer = require('multer')
const os = require('os')

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', multer({dest: os.tmpdir()}).single('image'), actionCreate);
router.put('/status/:id', actionStatus);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id',multer({dest: os.tmpdir()}).single('image'), actionEdit);
router.delete('/delete/:id', multer({dest: os.tmpdir()}).single('image'), actionDelete);

module.exports = router;