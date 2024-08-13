const express = require("express")
const router = express.Router()
const userService = require("../services/user")
const checkTrialPeriod = require("../middleware/trialPeriodCheckMiddleware")
const { protect } = require("../middleware/authMiddleware")



router.post("/register", async (req, res) => {
    const body = req.body
    try {
        const user = await userService.registerUser(body)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
    // const user = userService.registerUser(body)
    // res.send(user)
})

router.post("/verify-code", protect, async (req, res) => {
    const body = req.body
    try {
        const user = await userService.verifyCode(body)
        res.status(200).json(user)
    }
    catch (err) {
        // console.log(err.message)
        res.status(500).json({ message: err.message })
    }
})

// I will come late to correct it
router.post("/resend-code", protect, async (req, res) => {
    const body = req.body
    try {
        const user = await userService.resendVerificationCode(body)
        res.status(200).json({ message: "Verification code resent successfully", user })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/login", checkTrialPeriod, async (req, res) => {
    const body = req.body
    try {
        const user = await userService.loginUser(body)
        console.log(user)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch("/activate-trial", protect, async (req, res) => {
    const body = req.body
    try {
        const user = await userService.activateTrialPeriod(body)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/payment-checkout", protect, async (req, res) => {
    const body = req.body
    try {
        const session = await userService.checkoutSession(body)
        res.status(200).json({ id: session.id })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router