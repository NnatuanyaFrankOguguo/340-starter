const utilities = require('.');
const { body, validationResult } = require('express-validator')
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */

validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a firstname"),
        
        // lastname is required and must be 
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
  
    ]
}


/* **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
           
        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password does not meet requirements."),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.checkLoginData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

validate.editAcctRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a firstname"),
        
        // lastname is required and must be 
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
  
    ]
}

validate.checkEditAcctData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email, account_id, account_type } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
            errors,
            title: `Edit ${account_firstname} ${account_lastname}`,
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_type,
            account_id 
        })
        return
    }
    next()
}

validate.checkPasswordRules = () => {
    return [    
        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

validate.checkPasswordData = async (req, res, next) => {
    const {account_id} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("error", "Password validation failed. Please check the requirements.")
        res.redirect(`/account/update/${account_id}`)
        return
    }
    next()
}


module.exports = validate