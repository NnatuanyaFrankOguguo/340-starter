const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */

const getClassifications = async() => {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */

const getInventoryByClassificationId = async(classification_id) => {
    try {

        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )

        return data.rows;
    } catch (error) {
        console.error('Error in getInventoryByClassificationId', error);
        
        
    }
}

/* ***************************
 *  get all inventory details for a single car
 * ************************** */

const getCarsbyId = async(inv_id) => {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        
        return data.rows;
    } catch (error) {
        console.error('Error in getCarsbyId', error);    
    }

}

/* ***************************
 *  Add a new classification
 * ************************** */

const addClassification = async (classification_name) => {
    // logic to add a new classification goes here
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])


        return result.rows[0]; // Return the newly created classification
    } catch (error) {
        return error.message
    }

}


/* ***************************
 *  Add a new inventory item
 * ************************** */

const addInventory = async (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) => {
    // logic to add a new inventory item goes here
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id ])

        return result.rows[0]; // Return the newly created inventory item
    } catch (error) {
        return error.message
    }

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }

const deleteInventoryById = async (inv_id) => {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *"
        const result = await pool.query(sql, [inv_id])
        return result.rows[0]; // Return the whatever result in the deleted inventory item
        console.log("results from the deleted query", result)
    } catch (error) {
        console.log("delete error", error)
    }

}

module.exports = {getClassifications, getInventoryByClassificationId, getCarsbyId, addClassification, addInventory, updateInventory, deleteInventoryById}

// this is where what will be queried from the database is defined and exported to the controller to be used in the view/ frontend