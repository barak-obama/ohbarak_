const express = require('express');
const multer  = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });



module.exports = function () {
    /* GET home page. */
    router.post('/', upload.single('ohbarak'), function(req, res, next) {
        res.send('yayyyy');
        res.end();
    });

    return router;
};
