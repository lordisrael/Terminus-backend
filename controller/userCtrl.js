const expressAsyncHandler = require("express-async-handler")
const { generateToken, createRefreshJWT } = require("../config/jwt")
const { successResponse, errorResponse } = require("../util/response");

const User = require("../model/user")


const registeruser = expressAsyncHandler(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json(errorResponse("Email already registered"));

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user);
        res.status(201).json(successResponse("User registered", { user, token }));
    } catch (error) {
        next(error);
    }

})

const loginuser = expressAsyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json(errorResponse("Invalid credentials"));
        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json(errorResponse("Invalid credentials"));
        const token = generateToken(user);
        const refreshToken = await createRefreshJWT(user._id);
        const newUser = await User.findByIdAndUpdate(
            user._id,
            { refreshToken: refreshToken },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        });
        res.json(successResponse("Login successful", { newUser, token }));
    } catch (error) {
        next(error);
    }
})

const logoutuser = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        
        // Clear refresh token from database
        await User.findByIdAndUpdate(userId, { refreshToken: "" });
        
        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.json(successResponse("Logout successful"));
    } catch (error) {
        next(error);
    }
})

module.exports = {
    registeruser,
    loginuser,
    logoutuser
}