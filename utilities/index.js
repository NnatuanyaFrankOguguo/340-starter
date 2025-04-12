const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()



const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async (req, res, next) => {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/ '+ row.classification_id +' " title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list

}

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async (data) => {
    let grid 
    if (data.length > 0) {
        grid = '<ul id="in-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/'+ vehicle.inv_id +' " title="View '+ vehicle.inv_make +' '+vehicle.inv_model+' details"> <img src="'+vehicle.inv_thumbnail+'" alt="Image of'+ vehicle.inv_make+' '+vehicle.inv_model+' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
                    + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
                    + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice"> Sorry, no match vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the car details view HTML
* ************************************ */

Util.buildCarDetailsGrid = async (data) => {
    let grid
    if (data.length > 0) {
        grid = '<div id="in-car-display">'
        data.forEach(vehicle => {
            grid += '<div class="carDetail">'
            grid += '<img src="/'+ vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
            grid += '<ul>'
            grid += '<li>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
            grid += '<li>Year: '+ vehicle.inv_year +'</li>'
            grid += '<li>Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +'</li>'
            grid += '<li>Color: '+ vehicle.inv_color +'</li>'
            grid += '</ul>'
            grid += '<p>'+ vehicle.inv_description +'</p>'
            grid += '</div>'
            
        })
        grid += '</div>'
    } else {
        grid += '<p class="notice">Sorry, no match vehicle could be found.</p>'
    }
    return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
//This middleware checks if the user is logged in by verifying the JWT token in the cookies
//If the token is valid, it sets the user and loggedin properties in res.locals
//First, the JWT token is checked and res.locals.loggedin is set properly
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt){
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    req.flash("error", "Your session has expired. Please log in again.")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                } 
                res.locals.user = user
                res.locals.loggedin = 1
                next() 
            })
    } else {
        next()
    }
}

//Then, the checkLogin middleware can properly verify the login status
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        return next()
    } else {
        req.flash("error", "Please log in to access this page.")
        return res.redirect("/account/login")
    }
}


Util.authoriseEmployeeOrAdmin = (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) {
        req.flash("error", "Unauthorised access")
        return res.redirect("/account/login")
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
            res.locals.user = decoded
            return next()
        } else {
            req.flash("error", "Unauthorised access")
            return res.redirect("/account/")
        }
    } catch (error) {
        req.flash("error", "Invalid token or token expired... please log in again")
        return res.redirect("/account/login")
    }
}

module.exports = Util

// this is where we will build the html structure of the view which will be used to render this is also sent to the controller to be used in the view/ frontend