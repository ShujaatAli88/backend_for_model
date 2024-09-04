const express = require("express")
const app = express()
const router = express.Router()
const userService = require("../services/user")
const checkTrialPeriod = require("../middleware/trialPeriodCheckMiddleware")
const { protect } = require("../middleware/authMiddleware")
const path = require("path")

app.use(express.static(path.join(__dirname, "../Frontend")))
// const filename = path.dirname("../Frontend")

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

// checkTrialPeriod,
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

router.patch("/activate-trial", protect, checkTrialPeriod, async (req, res) => {
    const body = req.body
    try {
        const user = await userService.activateTrialPeriod(body)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/payment-checkout", async (req, res) => {
    const body = req.body
    // console.log(body)
    try {
        const session = await userService.checkoutSession(body)
        res.status(200).json({ message: "Subscription successful", session })
    }
    catch (err) {
        // res.status(500).json({ message: err.message })
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while creating the subscription.' });
    }
})

// Test api

router.get("/cancel", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "../Frontend", "subError.html"))
})

router.get("/success/:email", (req, res) => {
    console.log(req.params.email)
    res.status(200).sendFile(path.resolve(__dirname, "../Frontend", "dashboard.html"))
})

router.get("/subscription", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "../Frontend", "subscription.html"))
})

router.get("/style", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "../Frontend", "style.css"))
})


// app.post('/create-subscription', async (req, res) => {
//     try {
//         const { paymentMethod, name, email, priceId } = req.body;

//         const customer = await stripe.customers.create({
//             name,
//             email,
//             payment_method: paymentMethod,
//             invoice_settings: {
//                 default_payment_method: paymentMethod,
//             },
//         });

//         const subscription = await stripe.subscriptions.create({
//             customer: customer.id,
//             items: [{ price: priceId }],
//             payment_settings: {
//                 payment_method_options: {
//                     card: {
//                         request_three_d_secure: 'any',
//                     },
//                 },
//                 payment_method_types: ['card'],
//                 save_default_payment_method: 'on_subscription',
//             },
//             expand: ['latest_invoice.payment_intent'],
//         });

//         res.json({
//             clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//             subscriptionId: subscription.id,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while creating the subscription.' });
//     }
// });

module.exports = router