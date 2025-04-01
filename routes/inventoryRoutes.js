const express = require('express')
const router = express.Router()
const invController = require('../controllers/invController.js')
const utilities = require('../utilities/')
const invValidate = require('../utilities/inventory-validator.js')

// Route to build inventory by classification view

router.get('/type/:classification_id', utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by single detail
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildCarDetail));

// Route to build intentional error
router.get('/trigger-error', (req, res, next) => {
    next({status: 500, message: 'Intentional Error Triggered'})
})

// Task 1: Management View
router.get('/', utilities.handleErrors(invController.managementView));

// Task 2: Add Classification
router.get('/add-classification', utilities.handleErrors(invController.getAddClassificationView));
router.post('/add-classification', invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Task 3: Add Inventory
router.get('/add-inventory',  utilities.handleErrors(invController.getAddInventoryView));
router.post('/add-inventory', invValidate.inventoryRules(), invValidate.checkInvData, utilities.handleErrors(invController.getAddInventory));


module.exports = router;

// started with the route file first then go to the controller folder next to write the logic for the route what to do 