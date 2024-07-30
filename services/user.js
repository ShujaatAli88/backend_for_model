const userSchema = require("../models/users.model.js")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

// function to generate the verification code
function generateVerificationCode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Method to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

// function to send the verification code to the user's email
async function sendVerificationCode(email, code) {
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

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userSchema.find({}).sort({ '_id': -1 }).limit(1)
    const id = user.length === 0 ? "00001" : ("00000" + String(parseInt(user[0]._id) + 1)).slice(-4);

    const verificationCode = generateVerificationCode()
    // trialStartDate: new Date()
    const newUser = new userSchema({ _id: id, firstName, lastName, email, password: hashedPassword, verificationCode })

    await newUser.save()

    await sendVerificationCode(email, verificationCode)
    console.log(newUser)
    return newUser
}

// function to varify the code send to user login
async function verifyCode(body) {
    const { email, code } = body
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
    if (!user.trialStartDate) {
        user.trialStartDate = new Date();
        user.isTrialActive = true;
    }

    await user.save();

    // Log the user in (you might want to generate a session or token here)
    const token = generateToken(user._id);

    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
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
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token,
        };
    }


    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
        message: "Login successful"
    };
}

module.exports = { registerUser, loginUser, verifyCode, resendVerificationCode }