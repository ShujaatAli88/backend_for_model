const userSchema = require("../models/users.model.js")
const subsciptionSchema = require("../models/subscriptionDetail.model.js")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const Stripe = require("stripe")
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const sendgrid = require('@sendgrid/mail')
const dotenv = require('dotenv');
// const dashboard = require('../Frontend/')

dotenv.config();

// function to generate the verification code
function generateVerificationCode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Method to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '20m',
    })
}



// function to send the verification code to the user's email
async function sendVerificationCode(email, code) {
    // Code for sending email using sendgrid
    // sendgrid.setApiKey(process.env.API_KEY);
    // const msg = {
    //     to: email,
    //     from: {
    //         name: 'Your Service',
    //         email: process.env.USER_EMAIL
    //     },
    //     subject: 'Your Verification Code',
    //     text: `Your verification code is: ${code}`,
    //     html: `<strong>Your verification code is: ${code}</strong>`
    // }
    // sendgrid.send(msg).
    //     then(res => console.log('Email sent successfully')).
    //     catch(err => console.log(err.message))

    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_FOR_APP
        }
    });

    let info = await transporter.sendMail({
        from: `"Your Service" <${process.env.USER_EMAIL}>`,
        to: email,
        subject: 'Your Validation Code',
        text: `Dear Customer,
               Thank you for using the Genzō program!
               Your validation code is: ${code}
               This is for a 7-day test phase of the program.
               If you have any questions or need further assistance, feel free to contact our support team.
               Best regards,
               Mitsuki SARL-S
               info@mitsukigroup.com`
    });

    console.log('Message sent: %s', info.messageId);
}




// regex to check for the correct email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Function to register a new user
async function registerUser(body) {
    const { firstName, lastName, email, password } = body

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format")
        // console.log("Invalid email format")
    }

    const emailExist = await userSchema.findOne({ email })
    if (emailExist) {
        throw new Error("Email already exists")
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userSchema.find({}).sort({ '_id': -1 }).limit(1)
    const id = user.length === 0 ? "00001" : ("00000" + String(parseInt(user[0]._id) + 1)).slice(-4);

    const verificationCode = generateVerificationCode()
    // trialStartDate: new Date()
    const newUser = new userSchema({ _id: id, firstName, lastName, email, password: hashedPassword, verificationCode })

    await newUser.save()

    await sendVerificationCode(email, verificationCode)
    console.log(newUser)
    // const userLoggedIn = await loginUser({ email, password })
    const token = generateToken(newUser._id)

    return {
        token,
        email,
        firstName,
        message: "User registered successfully"
    }

}


// function to varify the code send to user login
async function verifyCode(body) {
    const { email, code } = body
    console.log(email)
    console.log(code)
    const user = await userSchema.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    if (user.verificationCode !== code) {
        throw new Error("Invalid verification code");
    }

    if (user.codeUsed) {
        throw new Error("Code already used");
    }

    // Mark the code as used
    user.codeUsed = true;
    user.trialStartDate = new Date();
    user.isTrialActive = true;

    // Start the trial period after successful verification
    // if (!user.trialStartDate) {
    // }

    await user.save();

    // Log the user in (you might want to generate a session or token here)
    const token = generateToken(user._id);

    return {
        _id: user._id,
        email: user.email,
        token,
        message: "User verified successfully"
    };
    // return user; // Return user or token
}



// Method to resend verification
async function resendVerificationCode(body) {
    const { email } = body;

    const user = await userSchema.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const newVerificationCode = generateVerificationCode();
    user.verificationCode = newVerificationCode;
    user.codeUsed = false; // Reset the codeUsed flag
    await user.save();

    await sendVerificationCode(email, newVerificationCode);

    return { message: "Verification code resent" };
}



// Function for user login
async function loginUser(body) {
    const { email, password } = body


    const user = await userSchema.findOne({ email });

    if (!user) {
        throw new Error("User Not found. Please register an account.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }



    // Generate a token
    const token = generateToken(user._id);

    if (!user.codeUsed) {
        const newVerificationCode = generateVerificationCode();
        user.verificationCode = newVerificationCode;
        user.codeUsed = false; // Reset the codeUsed flag
        await user.save();

        await sendVerificationCode(email, newVerificationCode);

        return {
            message: "Login successful, Verification code resent",
            email: user.email,
            userId: user._id,
            isVerified: user.codeUsed,
            token,
            firstName: user.firstName
        };
    }


    const subscription = await subsciptionSchema.findOne({ userId: user._id }).populate('userId')
    console.log(subscription, "Subscription")
    if (!subscription) {
        return {
            _id: user._id,
            email: user.email,
            isVerified: user.codeUsed,
            hasSubscription: user.isTrialActive,
            token,
            firstName: user.firstName,
            // subStatus: subscription.subscriptionStatus,
            message: "Login successful"
        };
    }
    else if (subscription) {
        return {
            _id: user._id,
            email: user.email,
            isVerified: user.codeUsed,
            hasSubscription: user.isTrialActive,
            token,
            firstName: user.firstName,
            subStatus: subscription.subscriptionStatus,
            message: "Login successful"
        };
    }
}


// Function to activate the trial period
async function activateTrialPeriod(body) {
    const { email } = body;
    const user = await userSchema.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.codeUsed) {
        throw new Error("Verification code not used");
    }
    if (user.isTrialActive) {
        throw new Error("Trial period already activated");
    }

    user.trialStartDate = new Date()
    user.isTrialActive = true;
    await user.save();

    return { message: "Trial period activated" };
}

// Function to create a subscription detail for the user in database
async function createSubscription(body) {
    const { email, priceId } = body
    const user = await userSchema.findOne({ email })
    console.log(user, user._id, "mango")
    if (!user) {
        throw new Error("User Not found. Please register an account.")
    }

    const subscription = await subsciptionSchema.find({}).sort({ '_id': -1 }).limit(1)
    const id = subscription.length === 0 ? "00001" : ("00000" + String(parseInt(subscription[0]._id) + 1)).slice(-4);

    if (priceId == 'price_1PuHu3GQqr36Qs460fS9Pvc0') {
        const newSubscription = new subsciptionSchema({
            _id: id,
            userId: user._id,
            purchaseDate: new Date(),
            subscriptionType: 'Monthly Plan',
            subscriptionStatus: true
        })
        await newSubscription.save()
        return "You have successfully subscribed for Monthly Plan."
    }

    else if (priceId == 'price_1PuHucGQqr36Qs46UXec6dUw') {
        const newSubscription = new subsciptionSchema({
            _id: id,
            userId: user._id,
            purchaseDate: new Date(),
            subscriptionType: 'Yearly Plan',
            subscriptionStatus: true
        })
        await newSubscription.save()
        return "You have successfully subscribed for Yearly Plan."
    }
}

async function checkoutSession(body) {
    const { priceId, email } = body
    console.log(typeof (priceId), email)
    // console.log(process.env.STRIPE_SECRET_KEY)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `http://localhost:3000/api/success/${email}/${priceId}`,
        cancel_url: `http://localhost:3000/api/cancel`,
        client_reference_id: email,
    });
    // console.log(session)
    return { url: session.url }
}
// Function for stripe payment
// async function checkoutSession(body) {
//     // const { productInfo } = body;
//     const { productName, productPrice, email, name } = body
//     const customer = await this.stripe.customers.create({
//         name: name,
//         email: email,
//         payment_method: 'card',
//         invoice_settings: {
//             default_payment_method: 'card',
//         },
//     });


//     // get the price id from the front-end
//     const priceId = productPrice;

//     // create a stripe subscription
//     const subscription = await this.stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: priceId }],
//         payment_settings: {
//             payment_method_options: {
//                 card: {
//                     request_three_d_secure: 'any',
//                 },
//             },
//             payment_method_types: ['card'],
//             save_default_payment_method: 'on_subscription',
//         },
//         expand: ['latest_invoice.payment_intent'],
//     });

//     // return the client secret and subscription id
//     return {
//         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//         subscriptionId: subscription.id,
//     }

// console.log(productName, productPrice)
// const lineItem = {
//     price_data: {
//         currency: 'eur',
//         product_data: {
//             name: productName,
//         },
//         unit_amount: Math.round(productPrice * 100),
//     },
//     quantity: 1,
// }
// console.log(process.env.STRIPE_SECRET_KEY)
// const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     mode: 'subscription',
//     line_items: [
//         lineItem
//         // {
//         //     price_data: {
//         //         currency: 'usd',
//         //         product_data: {
//         //             name: productInfo.name,
//         //         },
//         //         unit_amount: productInfo.price * 100,
//         //     },
//         //     quantity: 1,
//         // },
//     ],
//     // success_url: `${process.env.CLIENT_URL}/dashboard.html`,
//     success_url: "../Frontend/dashboard.html",
//     cancel_url: "../Frontend/subError.html",
// });

// return { id: session.id, message: "Subscription Successful" };
// create a stripe customer
// }

// async function checkoutSession(body) {
//     const { paymentMethod, name, email, priceId } = body;

//     const customer = await stripe.customers.create({
//         name,
//         email,
//         payment_method: paymentMethod,
//         invoice_settings: {
//             default_payment_method: paymentMethod,
//         },
//     });

//     const subscription = await stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: priceId }],
//         payment_settings: {
//             payment_method_options: {
//                 card: {
//                     request_three_d_secure: 'any',
//                 },
//             },
//             payment_method_types: ['card'],
//             save_default_payment_method: 'on_subscription',
//         },
//         expand: ['latest_invoice.payment_intent'],
//     });
//     return {
//         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//         subscriptionId: subscription.id,
//     }
// }

module.exports =
    { registerUser, loginUser, verifyCode, resendVerificationCode, activateTrialPeriod, checkoutSession, createSubscription }