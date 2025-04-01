const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
const registerAccount = async (account_firstname, account_lastname, account_email, account_password) => {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
        

        return result.rows[0]; // Return the newly created account
    } catch (error) {
        return error.message
    }

}

module.exports = { registerAccount }