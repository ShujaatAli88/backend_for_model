const userSchema = require("../models/users.model.js")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');

// function to generate the verification code
function generateVerificationCode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// function to send the verification code to the user's email
async function sendVerificationCode(email, code) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let info = await transporter.sendMail({
        from: '"Your Service" <your-email@gmail.com>',
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
    const { firstName, lastname, email, password } = body

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format")
    }

    const emailExist = await userSchema.findOne({ email })
    if (emailExist) {
        throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userSchema.find({}).sort({ '_id': -1 }).limit(1)
    const id = user.length === 0 ? "00001" : ("00000" + String(parseInt(user[0]._id) + 1)).slice(-4);

    const verificationCode = generateVerificationCode()
    const newUser = new userSchema({ _id: id, firstName, lastname, email, password: hashedPassword, verificationCode })

    await newUser.save()

    await sendVerificationCode(email, verificationCode)

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
    await user.save();

    // Log the user in (you might want to generate a session or token here)
    return user; // Return user or token
}

async function loginUser(body) {
    const { email, password } = body
}

module.exports = { registerUser, loginUser, verifyCode }