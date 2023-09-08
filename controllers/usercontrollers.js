const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('config')
const secretToken = config.get('jwtSecret')

const registerUser = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ errors: [{ msg: `El usuario ${email} ya existe` }] })
        } else {  

            // 1- We create the user instance
            user = new User({
                name,
                email,
                password
            })

            // 2- Encrypt the password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            // 3- Save the user in DB
            await user.save()

            // 4- Return a JWT
            const payload = {
                user: {
                    id: user.id // Since user.save() returns a promise we can extract the user id or _id (with mongoose it works either way)
                }
            }

            jwt.sign(payload, secretToken, { expiresIn: 360000 }, (error, token) => {
                if (error) {
                    throw error
                } else {
                    res.json({ token }) 
                }
            }) 
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }


}

const loginUser = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })


        if (!user) {
            return res.status(400).json({ errors: [{ msg: `Usuario o contraseña incorrectos` }] })
        } else {  

            // 1- We check that user and password match
            const passwordAndUserMatch = await bcrypt.compare(password, user.password) 
            if (!passwordAndUserMatch) {
                return res.status(400).json({ errors: [{ msg: `Usuario o contraseña incorrectos` }] })
            }

            // 2- Return a JWT
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, secretToken, { expiresIn: 360000 }, (error, token) => {
                if (error) {
                    throw error
                } else {
                    res.json({ token }) 
                }
            }) 
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }


}





module.exports = {
    registerUser,
    loginUser
}