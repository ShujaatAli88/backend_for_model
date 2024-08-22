const userSchema = require("../models/users.model.js")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
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
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`
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

    // Start the trial period after successful verification
    // if (!user.trialStartDate) {
    //     user.trialStartDate = new Date();
    //     user.isTrialActive = true;
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
        throw new Error("Invalid email or password");
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


    return {
        _id: user._id,
        email: user.email,
        isVerified: user.codeUsed,
        hasSubscription: user.isTrialActive,
        token,
        firstName: user.firstName,
        message: "Login successful"
    };
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

    user.isTrialActive = true;
    await user.save();

    return { message: "Trial period activated" };
}


// Function for stripe payment
async function checkoutSession(body) {
    // const { productInfo } = body;
    const { productName, productPrice } = body
    console.log(productName, productPrice)
    const lineItem = {
        price_data: {
            currency: 'eur',
            product_data: {
                name: productName,
            },
            unit_amount: Math.round(productPrice * 100),
        },
        quantity: 1,
    }
    console.log(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
            lineItem
            // {
            //     price_data: {
            //         currency: 'usd',
            //         product_data: {
            //             name: productInfo.name,
            //         },
            //         unit_amount: productInfo.price * 100,
            //     },
            //     quantity: 1,
            // },
        ],
        // success_url: `${process.env.CLIENT_URL}/dashboard.html`,
        success_url: "../Frontend/dashboard.html",
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return { id: session.id, message: "Subscription Successful" };
}

// async createSubscription(createSubscriptionRequest) {

//     // create a stripe customer
//     const customer = await this.stripe.customers.create({
//       name: createSubscriptionRequest.name,
//       email: createSubscriptionRequest.email,
//       payment_method: createSubscriptionRequest.paymentMethod,
//       invoice_settings: {
//         default_payment_method: createSubscriptionRequest.paymentMethod,
//       },
//     });


//     // get the price id from the front-end
//     const priceId = createSubscriptionRequest.priceId;

//     // create a stripe subscription
//     const subscription = await this.stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_settings: {
//         payment_method_options: {
//           card: {
//             request_three_d_secure: 'any',
//           },
//         },
//         payment_method_types: ['card'],
//         save_default_payment_method: 'on_subscription',
//       },
//       expand: ['latest_invoice.payment_intent'],
//     });

//     // return the client secret and subscription id
//     return {
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//       subscriptionId: subscription.id,
//     };
//   }


module.exports =
    { registerUser, loginUser, verifyCode, resendVerificationCode, activateTrialPeriod, checkoutSession }