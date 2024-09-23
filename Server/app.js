require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("./Db/connection")
const cookieParser = require("cookie-parser")

const Products = require("./Models/productSchema")
const DefaultData = require("./defaultData")
const cors = require("cors")
const router = require("./routes/router")

app.use(express.json())
app.use(cookieParser(""))
app.use(cors())
app.use(router)

app.listen(4000, () => {
    console.log("Port 4000")
})

DefaultData()