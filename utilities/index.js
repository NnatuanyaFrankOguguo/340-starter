const invModel = require("../models/inventory-model")

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
    console.log(data)
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util

// this is where we will build the html structure of the view which will be used to render this is also sent to the controller to be used in the view/ frontend