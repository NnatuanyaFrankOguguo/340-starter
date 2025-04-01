const express = require('express')
const router = express.Router()
const utilities = require('../utilities/')
const acctController = require('../controllers/accountController.js')
const regValidate = require('../utilities/account-validation.js')

// Route to login to account

router.get('/login', utilities.handleErrors(acctController.buildLogin))

router.get('/register', utilities.handleErrors(acctController.buildRegister))

// Route to process login/registration form

router.post('/login', utilities.handleErrors(acctController.processLogin))

router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(acctController.registerAccount))

module.exports = router;