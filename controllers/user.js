const express = require("express")
const router = express.Router()
const userService = require("../services/user")

router.post("/register", (req, res) => {
    const body = req.body
    try {
        const user = userService.registerUser(body)
        res.status(200).json({ message: "User registered successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
    // const user = userService.registerUser(body)
    // res.send(user)
})

router.post("/verify-code", (req, res) => {
    const body = req.body
    try {
        const user = userService.verifyCode(body)
        res.status(200).json({ message: "User verified successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/resend-code", (req, res) => {
    const body = req.body
    try {
        const user = userService.resendVerificationCode(body)
        res.status(200).json({ message: "Verification code resent successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/login", (req, res) => {
    const body = req.body
    try {
        const user = userService.loginUser(body)
        res.status(200).json({ message: "User logged in successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router