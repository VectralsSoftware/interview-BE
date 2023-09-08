const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const authMiddleware = require('../../middlewares/authMiddleware')
const User = require('../../models/User')
const { loginUser, registerUser } = require('../../controllers/usercontrollers')

// @route   GET api/auth
// @desc    Returns the user decoded from the jwt
// @access  PRIVATE => (You need a token to access this route)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // Thanks to jwt we're getting a payload with a decoded user which contains the id. We want everything except the password.
        res.json(user)
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Internal server error')
    }
})
// @route   POST api/auth/register
// @desc    Register user
// @access  PUBLIC => (You don't need a token to access this route)
router.post('/register', [
    check('name', 'Name is mandatory').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password needs to have 8 characters at least').isLength({ min: 8 })
], registerUser)

// @route   POST api/auth
// @desc    Login user & get token
// @access  PUBLIC => (You don't need a token to access this route)
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is mandatory').notEmpty()
], loginUser)


module.exports = router