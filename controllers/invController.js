const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async (req, res, next) => {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
        return res.status(404).render("errors/error", {
            title: "Classification Not Found",
            message: "The classification you are looking for does not exist.",
            nav: await utilities.getNav(),
        });
    }


    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

/* ***************************
 *  Build inventory by single car detail
 * ************************** */
invCont.buildCarDetail = async (req, res, next) => {
    console.log("Request params:", req.params); // ✅ Debug log
    const inv_id = req.params.inv_id
    const data = await invModel.getCarsbyId(inv_id)

    if (!data || data.length === 0) {
        return res.status(404).render("errors/error", {
            title: "Car Not Found",
            message: "The vehicle you are looking for does not exist.",
            nav: await utilities.getNav(),
        });
    }

    const grid = await utilities.buildCarDetailsGrid(data)
    let nav = await utilities.getNav()
    const carName = data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/detail", {
        title: carName,
        nav,
        grid,
        message: "", // placeholder for future use
    })

}


module.exports = invCont

// after the conroller has been set the logic of how to get the data from the data we create a function of what to do with the data in the UTILITIES folder
// and send to the view/ frontend