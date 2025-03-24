const express = require('express')
const router = express.Router()
const invController = require('../controllers/invController.js')

// Route to build inventory by classification view

router.get('/type/:classification_id', invController.buildByClassificationId);

// Route to build inventory by single detail
router.get('/detail/:inv_id', invController.buildCarDetail);

// Route to build intentional error
router.get('/trigger-error', (req, res, next) => {
    next({status: 500, message: 'Intentional Error Triggered'})
})


module.exports = router;

// started with the route file first then go to the controller folder next to write the logic for the route what to do 