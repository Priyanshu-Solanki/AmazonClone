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

var corsOptions = {
  // origin: "https://amazon-clone-priyanshu.netlify.app",
  origin: "http://localhost:3000",
  credentials: true, 
};

app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser(""))
app.use(router)

app.listen(process.env.Port || 4000, () => {
    console.log("Port 4000")
})

DefaultData()