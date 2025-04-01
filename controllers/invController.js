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

/* ***************************
 *  Build management by make view
 * ************************** */

invCont.managementView = async (req, res) => {
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav: await utilities.getNav(),
        messages: req.flash() // Pass all flash messages
    })
}

// Display add-classification form
invCont.getAddClassificationView = async (req, res) => {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add new classification",
        nav,
        errors: null,
        messages: req.flash() // Pass all flash messages, 
        
    })
}


// Handle classification form submission
invCont.addClassification = async (req, res) => {
    const { classification_name } = req.body
    try {
        const addClass = await invModel.addClassification(classification_name)
        if (addClass) {
            req.flash("success", "Classification added successfully");
            res.render("./inventory/management", {
                title: "Vehicle Management",
                nav: await utilities.getNav(),
                messages: req.flash() // Pass all flash messages
            });

        }
    } catch (error) {
        req.flash("error", "new classification added failed. Please try again.") 
        return res.status(501).render("./inventory/add-classification", { 
            title: "Add new classification",
            nav,
            errors: error.errors,
            messages: req.flash() // Pass all flash messages
        });
    }


}

// Display add-inventory form
invCont.getAddInventoryView = async (req, res) => {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add new inventory",
        nav,
        classificationList,
        errors: null,
        messages:  req.flash() // Pass all flash messages,,
        
    })
}

invCont.getAddInventory = async (req, res) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id} = req.body;
    console.log(req.body)
    try {
        const addResult = await invModel.addInventory(
            inv_make, inv_model, String(inv_year), inv_description, parseInt(inv_price), parseInt(inv_miles), inv_color, inv_image, inv_thumbnail, parseInt(classification_id)
        )
        if (addResult) {
            req.flash("success", "Inventory added successfully");
            res.render("./inventory/management", {
                title: "Vehicle Management",
                nav: await utilities.getNav(),
                messages: req.flash()
            });
        }
       
    } catch (error) {
        req.flash("error", "new inventory added failed. Please try again.");
        return res.status(501).render("./inventory/add-inventory", { 
            title: "Add new inventory",
            nav,
            errors: [{ msg: error.message }],
            messages: req.flash() // Pass all flash messages
        });
    }
}


module.exports = invCont

// after the conroller has been set the logic of how to get the data from the data we create a function of what to do with the data in the UTILITIES folder
// and send to the view/ frontend