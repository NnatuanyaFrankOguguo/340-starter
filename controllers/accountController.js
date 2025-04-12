const acctModel = require("../models/account-model")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

const buildLogin = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash()
        
    })
}

const buildRegister = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: req.flash()
        
    })
}

const processLogin = async (req, res, next) => {
    let nav = await utilities.getNav()
    
    const { account_email, account_password } = req.body
    const user = await acctModel.getUserByEmail(account_email)
    
    if (!user || !user.account_password) {
        req.flash("error", "Invalid email or password.")
        res.redirect("/account/login")
        return;
    }
    console.log("logged in user details", user)
    try {
        if(await bcrypt.compare(account_password, user.account_password)) {
            delete user.account_password // Remove password from user object

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 3600 * 1000}) // Create JWT token

            if(process.env.NODE_ENV === "production") {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 }) // Set cookie with JWT in production environment
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }) // Set cookie with JWT in development environment
            }

            req.flash("success", `${user.account_firstname}, you are logged in successfully.`);
            res.redirect("/account")
            return;

        } else {
            req.flash("error", "Invalid email or password.")
            res.redirect("/account/login")
        }
    } catch (error) {
        return new Error ("Access Forbidden")
    }
}

const registerAccount = async (req, res) => {
    try {
        let nav = await utilities.getNav(); // Get navigation links
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        console.log("Received Data:", req.body); // Log incoming data

        //hashed password
        const hashedPassword = await bcrypt.hash(account_password, 10);


        // Call the model function to register the account
        const regResult = await acctModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword,
        );

        if (regResult) {
            req.flash("success", `${account_firstname}, you are registered successfully. Please log in.`);
            return res.status(201).render("account/login", {
                title: "Login",
                nav,
                messages: req.flash(),
                errors: null // No errors on successful registration
            });
        } else {
            req.flash("error", "Registration failed. Please try again.");
            return res.status(501).render("account/register", { 
                title: "Register",
                nav,
                messages: req.flash(),
                errors: null // No errors on failed registration
            });
        }
    } catch (error) {
        console.error("Error registering account:", error);
        req.flash("error", "An unexpected error occurred. Please try again later.");
        return res.status(500).render("account/registration", {
            title: "Registration",
            nav
        });
    }
    
} 


const buildAccountView = async (req, res) => {
    let nav = await utilities.getNav()
    res.render("account/acct-management", {
        title: "Account Management",
        nav,
        grid: null, // Pass the grid variable here if needed
        errors: null,
        messages: req.flash(),
        welcome: `Welcome ${res.locals.user.account_firstname}`,
        user: res.locals.user
    })
}


const buildUpdateAcctView = async (req, res) => {
    const account_id = parseInt(req.params.id)
    console.log("ACCOUNT ID", account_id)
    let data = await acctModel.getUserbyId(account_id)
    let nav = await utilities.getNav()
    const userName = data[0].account_firstname + " " + data[0].account_lastname
    res.render("./account/edit-account", {
        title: "Edit " + userName,
        nav,
        account_id: data[0].account_id,
        account_email: data[0].account_email,
        account_firstname: data[0].account_firstname,
        account_lastname: data[0].account_lastname,
        account_type: data[0].account_type,
        errors: null,
        messages: req.flash()
    })   
}

const updateAccount = async (req, res) => {
    let nav = await utilities.getNav()
    const { 
    account_id,
    account_email,
    account_firstname,
    account_lastname,
    account_type } = req.body
    const updateResult = await acctModel.accountUpdate(
        account_id,
        account_email,
        account_firstname,
        account_lastname,
        account_type
    )
    if (updateResult) {
        const userName = updateResult.account_firstname + " " + updateResult.account_lastname
        req.flash("success", `The ${userName} was successfully updated.`)
        res.redirect("/account/")
    } else {
        const userName = account_firstname + " " + account_lastname
        req.flash("error", `The account was not successfully updated.`)
        res.render("./account/edit-account", {
            title: "Edit " + userName,
            nav,
            account_id,
            account_email,
            account_firstname,
            account_lastname,
            errors: null,
            messages: req.flash()
        })   
    }

}

const updatePassword = async (req, res) => {
    const { account_password, account_id } = req.body

    const hashedPassword = await bcrypt.hash(account_password, 10);

    const result = await acctModel.passwordUpdate(hashedPassword, account_id)

    if (result) {
        req.flash("success", `password successfully updated.`)
        res.redirect("/account/")
    } else {
        req.flash('error', 'Password update failed.')
        res.redirect(`/account/update/${account_id}`)
    }
}

const deleteAccount = async (req, res) => {
    const account_id = res.locals.user.account_id
    
    const result = await acctModel.deleteAccount(account_id)
    
    if (result) {
        res.clearCookie('jwt')
        req.flash("success", "Your account has been successfully deleted.")
        res.redirect("/")
    } else {
        req.flash("error", "Failed to delete account. Please try again.")
        res.redirect("/account")
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin, buildAccountView, buildUpdateAcctView, updateAccount, updatePassword, deleteAccount }