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
        console.log("Query result:", data.rows); // ✅ Debugging log
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
        console.log(`Fetching inventory details for inv_id: ${inv_id}`);
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        console.log("Query result:", data.rows); // ✅ Debugging log
        return data.rows;
    } catch (error) {
        console.error('Error in getCarsbyId', error);    
    }

}

module.exports = {getClassifications, getInventoryByClassificationId, getCarsbyId}

// this is where what will be queried from the database is defined and exported to the controller to be used in the view/ frontend