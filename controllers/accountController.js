const acctModel = require("../models/account-model")
const utilities = require("../utilities/")

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

// const processLogin = async (req, res, next) => {
//     const { email, password } = req.body
//     const user = await acctModel.getUserByEmail(email)
//     if (!user || !user.password) {
//         req.flash("error", "Invalid email or password.")
//         return res.redirect("/account/login")
//     }
//     const validPassword = await acctModel.verifyPassword(password, user.password)
//     if (!validPassword) {
//         req.flash("error", "Invalid email or password.")
//         return res.redirect("/account/login")
//     }
//     req.session.user = user
//     res.redirect("/")
// }

const registerAccount = async (req, res) => {
    try {
        let nav = await utilities.getNav(); // Get navigation links
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        console.log("Received Data:", req.body); // Log incoming data

        // Call the model function to register the account
        const regResult = await acctModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            account_password
        );

        if (regResult) {
            req.flash("notice", `${account_firstname}, you are registered successfully. Please log in.`);
            return res.status(201).render("account/login", {
                title: "Login",
                nav,
                messages: req.flash()
            });
        } else {
            req.flash("error", "Registration failed. Please try again.");
            return res.status(501).render("account/register", { 
                title: "Register",
                nav,
                messages: req.flash()
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



module.exports = { buildLogin, buildRegister, registerAccount }