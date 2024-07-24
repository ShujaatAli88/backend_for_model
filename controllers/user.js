const express = require("express")
const router = express.Router()
const userService = require("../services/user")

router.post("/register", async (req, res) => {
    const body = req.body
    try {
        const user = await userService.registerUser(body)
        res.status(200).json({ message: "User registered successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
    // const user = userService.registerUser(body)
    // res.send(user)
})

router.post("/verify-code", async (req, res) => {
    const body = req.body
    try {
        const user = await userService.verifyCode(body)
        res.status(200).json({ message: "User verified successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/resend-code", async (req, res) => {
    const body = req.body
    try {
        const user = await userService.resendVerificationCode(body)
        res.status(200).json({ message: "Verification code resent successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/login", async (req, res) => {
    const body = req.body
    try {
        const user = await userService.loginUser(body)
        console.log(user)
        res.status(200).json({ message: user.message, user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router