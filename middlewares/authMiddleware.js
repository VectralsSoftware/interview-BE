const jwt = require('jsonwebtoken')
const config = require('config')

const secretToken = config.get('jwtSecret')

module.exports = (req, res, next) => {
    // Getting the token from the header
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).json({msg: 'No token available. Authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, secretToken)
        req.user = decoded.user 
        next()
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'})
    }

}