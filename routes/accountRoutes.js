const express = require('express')
const router = express.Router()
const utilities = require('../utilities/')
const acctController = require('../controllers/accountController.js')
const regValidate = require('../utilities/account-validation.js')

// Route to login to account

router.get('/login', utilities.handleErrors(acctController.buildLogin))

router.get('/register', utilities.handleErrors(acctController.buildRegister))

router.get('/update/:id', utilities.handleErrors(acctController.buildUpdateAcctView))

// Route to process login/registration form

router.post('/login', regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(acctController.processLogin))

router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(acctController.registerAccount))

router.get('/', utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(acctController.buildAccountView));

router.post("/update", regValidate.editAcctRules(), regValidate.checkEditAcctData, utilities.handleErrors(acctController.updateAccount))

router.post('/update-password', regValidate.checkPasswordRules(), regValidate.checkPasswordData, utilities.handleErrors(acctController.updatePassword))

router.post('/delete', utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(acctController.deleteAccount))

router.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
  })



module.exports = router;