const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
const registerAccount = async (account_firstname, account_lastname, account_email, hashedPassword) => {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword, 'Admin']);
        
        return result.rows[0]; // Return the newly created account
    } catch (error) {
        return error.message
    }

}

/* *****************************
*   Get account by email
* *************************** */
const getUserByEmail = async (account_email) => {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        console.log("result from the user gotten by email", result)
        return result.rows[0] // Return the user object
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Get User by id
* *************************** */

const getUserbyId = async (account_id) => {
    try {
        const sql = "SELECT * FROM account WHERE account_id = $1"
        const result = await pool.query(sql, [account_id])
        console.log("result from the user gotten by ID", result.rows[0])
        return result.rows // Return the user object
    } catch (error) {
        console.error(error)
        
    }
}

const accountUpdate = async (account_id, account_email, account_firstname, account_lastname, account_type) => {
    try {
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_type = $4 WHERE account_id = $5 RETURNING *"
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_type, account_id ])
        console.log("this is the data gotten afert the update of user account", data)
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

const passwordUpdate = async (hashedPassword, account_id) => {
    try {
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        return await pool.query(sql, [hashedPassword, account_id])
    } catch (error) {
        console.error("model error: ", error)
    }
}

const deleteAccount = async (account_id) => {
    try {
        const sql = "DELETE FROM public.account WHERE account_id = $1 RETURNING *"
        return await pool.query(sql, [account_id])
    } catch (error) {
        console.error("model error: ", error)
        return false
    }
}

module.exports = { registerAccount, getUserByEmail, getUserbyId, accountUpdate, passwordUpdate, deleteAccount }