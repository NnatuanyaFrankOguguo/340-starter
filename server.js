/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoutes")
const accountRoute = require("./routes/accountRoutes")
const utilities = require("./utilities/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const session = require("express-session")
const pool = require('./database')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))  // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sessionId'
}))


// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(cookieParser())


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
//index route
// app.get("/", function(req, res) {
//   res.render("index", { title: "Home Page" })
// })
app.get("/", utilities.handleErrors(baseController.buildHome))

// about route

app.use(static)
app.use("/inv", utilities.handleErrors(inventoryRoute))

app.use('/account', accountRoute)


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// JWT MIDDLEWARE 
app.use(utilities.checkJWTToken)



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl} ": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav  })
})




const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

