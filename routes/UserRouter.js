var express = require('express');
var router = express.Router();
const upload = require("../lib/upload");
const UserController = require('../controllers/UserController');

router.get('/users', UserController.list);
router.get('/users/create', UserController.create);
router.post('/users/store', UserController.store);
router.get('/users/:id/edit', UserController.edit);
router.put('/users/:id/update', upload.single("img"), UserController.update);
router.delete('/users/:id/delete', UserController.delete);

module.exports = router;