const jwt = require("jsonwebtoken")
const user = require("../Models/userSchema")
const { cond } = require("lodash")
const secretKey = process.env.KEY

const authenticate = async function (req, res, next) {
    try {
        const token = req.cookies.Amazonweb

        const verifytoken = jwt.verify(token, secretKey)
        console.log(verifytoken)

        const rootUser = await user.findOne({ _id: verifytoken._id, "tokens.token": token })
        console.log(rootUser)

        if (!rootUser) {
            throw new error("User not found")
        }

        req.token = token
        req.rootUser = rootUser
        req.userID = rootUser._id

        next()
    } catch (e) {
        res.status(401).send("Unauthorized : No token provided")
        console.log(e)
    }
}


module.exports = authenticate
