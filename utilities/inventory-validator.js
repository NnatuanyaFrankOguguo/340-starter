const { body, validationResult } = require('express-validator');
const utilities = require('.');

const validate = {};

validate.classificationRules = () => {
    return [
        // classification_name is required and must be string
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z0-9]+$/)
            .isLength({ min: 2 })
            .withMessage('Classification name must not contain spaces or special characters.'),
    ];
}

validate.inventoryRules = () => {
    return [
        // vehicle_make is required and must be string
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage('Make is required.'),
        // vehicle_model is required and must be string
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage('Model is required.'),
        // vehicle_price is required and must be a number
        body('inv_price')
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage('Price must be a number and is required.'),
        // vehicle_year is required and must be a number
        body('inv_year')
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage('Year must be a number and is required.'),
        // vehicle_mileage is required and must be a number
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage('Miles must be a number and is required.'),
        // vehicle_color is required and must be string
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage('Color is required.'),
        // vehicle_description is required and must be string
        body('inv_description')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 }),
            // vehicle_classification_id is required and must be a number
        
    ]
}

validate.checkClassificationData = async(req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            classification_name,
            nav
        })
        return
    }
    next()
}

validate.checkInvData = async(req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            inv_image,
            inv_thumbnail,
            nav
        })
        return
    }
    next()
}

module.exports = validate;