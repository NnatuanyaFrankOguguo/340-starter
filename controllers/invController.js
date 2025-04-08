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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav: await utilities.getNav(),
        messages: req.flash(), // Pass all flash messages
        classificationSelect,
        errors: null, // Placeholder for future use
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
    let classificationList = await utilities.buildClassificationList();
    const classificationSelect = await utilities.buildClassificationList()
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
                messages: req.flash(),
                classificationSelect

            });
        }
       
    } catch (error) {
        req.flash("error", "new inventory added failed. Please try again.");
        return res.status(501).render("./inventory/add-inventory", { 
            title: "Add new inventory",
            nav,
            classificationList,
            errors: [{ msg: error.message }],
            messages: req.flash() // Pass all flash messages
        });
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req, res) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData) // when a option is selected in the classification select the javascript 
        //listens to the event onChange and uses the classification_id to make a request that this controller is handling here
    } else {
        next(new Error("No data found")) //this is being sent to the inventory javascript
    }
}

/* ***************************
 *  Return Inventory by ID As JSON
 * ************************** */
invCont.getEditInventoryView = async (req, res) => {

    const inv_id = parseInt(req.params.inv_id)
    let data = await invModel.getCarsbyId(inv_id)
    let nav = await utilities.getNav()
    console.log(data)
    let classificationList = await utilities.buildClassificationList(data[0].classification_id);
    const carName = data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/edit-inventory", {
        title: "Edit " + carName,
        nav,
        inv_id: data[0].inv_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_year: data[0].inv_year,
        inv_description: data[0].inv_description,
        inv_image: data[0].inv_image,
        inv_thumbnail: data[0].inv_thumbnail,
        inv_price: data[0].inv_price,
        inv_miles: data[0].inv_miles,
        inv_color: data[0].inv_color,
        classification_id: data[0].classification_id,
        classificationList,
        errors: null,
        messages:  req.flash() // Pass all flash messages,,
        
    })
}

invCont.deleteInventoryView = async (req, res) => {

    const inv_id = parseInt(req.params.inv_id)
    let data = await invModel.getCarsbyId(inv_id)
    let nav = await utilities.getNav()
    console.log(data)
    const carName = data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/delete-inventory", {
        title: "Delete " + carName,
        nav,
        inv_id: data[0].inv_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_year: data[0].inv_year,
        inv_description: data[0].inv_description,
        inv_image: data[0].inv_image,
        inv_thumbnail: data[0].inv_thumbnail,
        inv_price: data[0].inv_price,
        inv_miles: data[0].inv_miles,
        inv_color: data[0].inv_color,
        classification_id: data[0].classification_id,
        errors: null,
        messages:  req.flash() // Pass all flash messages,,
        
    }) 
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("success", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("error", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      
      })
    }
  }

invCont.deleteInventory = async (req, res) => {
    const classificationSelect = await utilities.buildClassificationList()
    // Call your delete function or DB query
    const { inv_id } = req.body
    console.log("this is the inv_id OF THE SELECTED DELETED INV",  req.body)

    const inv_ids = parseInt(req.body.inv_id)
    let data = await invModel.getCarsbyId(inv_ids)
    let nav = await utilities.getNav()
    const carName = data[0].inv_make + " " + data[0].inv_model

    const result = await invModel.deleteInventoryById(inv_id)

    if (result) {
        req.flash("success", "Vehicle deleted successfully.")
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav: await utilities.getNav(),
            messages: req.flash(),
            classificationSelect

        });
      } else {
        req.flash("error", "Failed to delete vehicle.")
        res.render("./inventory/delete-inventory", {
            title: "Delete " + carName,
            nav,
            inv_id: data[0].inv_id,
            inv_make: data[0].inv_make,
            inv_model: data[0].inv_model,
            inv_year: data[0].inv_year,
            inv_description: data[0].inv_description,
            inv_image: data[0].inv_image,
            inv_thumbnail: data[0].inv_thumbnail,
            inv_price: data[0].inv_price,
            inv_miles: data[0].inv_miles,
            inv_color: data[0].inv_color,
            classification_id: data[0].classification_id,
            errors: null,
            messages:  req.flash() // Pass all flash messages,,
            
        }) 
    }


}



module.exports = invCont

// after the conroller has been set the logic of how to get the data from the data we create a function of what to do with the data in the UTILITIES folder
// and send to the view/ frontend