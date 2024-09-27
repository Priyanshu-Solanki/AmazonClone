const Products = require("./Models/productSchema")
const productsdata = require("./Constant/productdata")

const DefaultData = async () => {
    try {
        // await Products.deleteMany({})
        const storeData = await Products.insertMany(productsdata)
        //console.log(storeData)
    } catch (error) {
        console.log("error: " + error.message)
    }
}

module.exports = DefaultData