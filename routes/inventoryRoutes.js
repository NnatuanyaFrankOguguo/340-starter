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
router.get('/acct-management', utilities.authoriseEmployeeOrAdmin, utilities.handleErrors(invController.managementView));

// Task 2: Add Classification
router.get('/add-classification',  utilities.authoriseEmployeeOrAdmin, utilities.handleErrors(invController.getAddClassificationView));
router.post('/add-classification', invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Task 3: Add Inventory
router.get('/add-inventory',  utilities.authoriseEmployeeOrAdmin,  utilities.handleErrors(invController.getAddInventoryView));
router.post('/add-inventory', invValidate.inventoryRules(), invValidate.checkInvData, utilities.handleErrors(invController.getAddInventory));

// Task 4: Edit Inventory   
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

// Route to edit inventory item
router.get('/edit/:inv_id', utilities.authoriseEmployeeOrAdmin, utilities.handleErrors(invController.getEditInventoryView));
router.get('/delete/:inv_id', utilities.authoriseEmployeeOrAdmin,  utilities.handleErrors(invController.deleteInventoryView));


router.post('/update/', invValidate.inventoryRules(), invValidate.checkInvUpdateData, utilities.handleErrors(invController.updateInventory));
router.post('/delete/', utilities.handleErrors(invController.deleteInventory));


module.exports = router;

// started with the route file first then go to the controller folder next to write the logic for the route what to do 