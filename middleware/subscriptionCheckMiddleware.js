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

    if (subDetail.subscriptionType == "Monthly Plan") {
        const diffDays = Math.floor((currentDate - subStartDate) / (1000 * 60 * 60 * 24));
        if (days == 28 || diffDays > 28) {
            subDetail.subscriptionStatus = false
            subDetail.save()
            return res.status(403).send('Your subscription period has expired.')
        }
        else if (days == 29 || diffDays > 29) {
            subDetail.subscriptionStatus = false
            subDetail.save()
            return res.status(403).send('Your subscription period has expired.')
        }
        else if (days == 30 || diffDays > 30) {
            subDetail.subscriptionStatus = false
            subDetail.save()
            return res.status(403).send('Your subscription period has expired.')
        }
        else if (days == 31 || diffDays > 31) {
            subDetail.subscriptionStatus = false
            subDetail.save()
            return res.status(403).send('Your subscription period has expired.')
        }
    }
    else if (subDetail.subscriptionType == "Yearly Plan") {

    }
    next()
}

module.exports = subscriptionDetailCheck