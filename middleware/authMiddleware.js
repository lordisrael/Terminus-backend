const User = require('../model/user')
const jwt = require('jsonwebtoken')
    
const asyncHandler = require('express-async-handler')

const auth = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication Invalid, No token attached to this header')
    }
    const token = authHeader.split(' ')[1]
    try { 
        const payLoad = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payLoad.id)
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: 'Authentication Invalid' });
        return;
    }
})


module.exports = auth