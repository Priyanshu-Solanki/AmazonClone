const express = require("express")

const router = new express.Router()
const Products = require("../Models/productSchema")
const USER = require("../Models/userSchema")
const bcrypt = require("bcryptjs")
const { http } = require("follow-redirects")
const products = require("../Constant/productdata")
const authenticate = require("../Middleware/authenticate")

router.get("/getproducts", async (req, res) => {
    try {
        const productdata = await Products.find()
        console.log("**************************" + productdata)
        res.status(201).json(productdata)
    } catch (e) {
        console.log("error: " + e)
    }
})

router.get("/getproduct/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Products.findOne({ id: id })

        res.status(201).json(data)
    } catch (e) {
        res.status(400).json(data)
        console.log("error: " + e.message)
    }
})

router.post("/register", async (req, res) => {

    const { name, email, password, repassword } = req.body;

    if (!name || !email || !password || !repassword) {
        res.status(422).json({ error: "Fill every field" })
        console.log("No data available")
    }

    try {
        const preUser = await USER.findOne({ email: email });
        if (preUser) {
            res.status(422).json({ error: "User already exists" })
        } else if (password != repassword) {
            res.status(422).json({ error: "Password & Re-password not matched" })
        } else {
            const finalUser = new USER({
                name, email, password, repassword
            })

            const storeData = await finalUser.save();
            // console.log(storeData);
            res.status(201).json(storeData);
        }
    } catch (e) {
        console.log("error: " + e.message)
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    if (!email || !password) {
        res.status(400).json({ error: "Fill every field" })
    }

    try {
        const userLogin = await USER.findOne({ email: email })
        if (userLogin) {
            const isMatched = await bcrypt.compare(password, userLogin.password)
            // console.log(isMatched)

            if (!isMatched) {
                res.status(400).json({ error: "Invalid User" })
            } else {
                const token = await userLogin.generateAuthToken()
                console.log(token)

                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    httpOnly: true
                })
                res.status(201).json(userLogin)
            }
        }
        else {
            res.status(400).json({ error: "Invalid User" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details" })
    }

})


router.post('/addtocart/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const UserContact = await USER.findOne({ _id: req.userID })
        console.log(UserContact)

        if (UserContact) {
            const cartdata = await UserContact.addCartData(cart)

            await UserContact.save()
            console.log(cartdata)

            res.status(201).json(UserContact)
        }
        else {
            res.status(401).json({ error: "Invalid User" })
        }

    } catch (e) {
        res.status(401).json({ error: "Invalid User" })
    }
})

router.get('/cartdetails', authenticate, async (req, res) => {
    try {
        const buyUser = await USER.findOne({ _id: req.userID })
        res.status(201).json(buyUser)
    } catch (e) {
        console.log(e)
    }
})

router.get('/validUser', authenticate, async (req, res) => {
    try {
        const valid = await USER.findOne({ _id: req.userID })
        res.status(201).json(valid)
    } catch (e) {
        console.log(e)
    }
})

router.delete('/remove/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curr) => {
            return curr._id != id;
        })
        console.log("Deleted")

        req.rootUser.save()

        res.status(201).json(req.rootUser)
        console.log("delete")
    } catch (e) {
        console.log("error" + e)
        res.status(400).json(req.rootUser)
    }
})

router.get('/logout', authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter(currElement => {
            return currElement.token !== req.token;
        })

        res.clearCookie("Amazonweb", { path: '/' })

        req.rootUser.save()

        res.status(201).json(req.rootUser.tokens)
    } catch (e) {
        res.status(400).json(req.rootUser.tokens)
    }
})

module.exports = router