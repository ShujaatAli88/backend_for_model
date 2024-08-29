const Subscription = require("../models/subscriptionDetail.model")
const User = require("../models/users.model")

// Function to check the number of days in a month
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

const subscriptionDetailCheck = async (req, res, next) => {
    const userResult = await User.findOne({ email: req.body.email });
    if (!userResult) {
        return res.status(401).send('User not found');
    }
    const subDetail = await Subscription.find({ user: userResult._id });
    if (!subDetail) {
        res.status().send("401").send("User has not subscribed to any plan.")
    }
    const currentDate = new Date()
    const subStartDate = new Date(subDetail.purchaseDate)
    const monthNumber = subStartDate.getMonth() + 1;
    const year = subStartDate.getFullYear()
    const days = getDaysInMonth(year, monthNumber)

    if (subDetail.subscriptionType == "Monthly plan") {
        const diffDays = Math.floor((currentDate - subStartDate) / (1000 * 60 * 60 * 24));
        if (days == 29 || 28) {

        }
        else if (days == 30) {

        }
        else if (days == 31) {

        }
    }
    else if (subDetail.subscriptionType == "Yearly plan") {

    }
}