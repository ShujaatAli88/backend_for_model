const Subscription = require("../models/subscriptionDetail.model")
const User = require("../models/users.model")

const subscriptionDetailCheck = async (req, res, next) => {
    const userResult = await User.findOne({ email: req.body.email });
    if (!userResult) {
        return res.status(401).send('User not found');
    }
    const subDetail = await Subscription.find({ user: userResult._id });
    if (!subDetail) {
        res.status().send("401").send("User has not subscribed to any plan.")
    }
    if (subDetail.subscriptionType == "Monthly plan") {

    }
    else if (subDetail.subscriptionType == "Yearly plan") {

    }
}