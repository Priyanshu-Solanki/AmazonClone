const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secretKey = process.env.KEY

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not a valid email  address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlenth: 6
    },
    repassword: {
        type: String,
        required: true,
        minlenth: 6
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    carts: Array
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.repassword = await bcrypt.hash(this.repassword, 12);
    }

    next();
})

//generate token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, secretKey)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token
    } catch (e) {
        console.log("error: " + e)
    }
}

userSchema.methods.addCartData = async function (cart) {
    try {
        this.carts = this.carts.concat(cart)
        await this.save()
        return this.carts
    } catch (e) {
        console.log("error: " + e)
    }
}


const USER = new mongoose.model("USER", userSchema)

module.exports = USER