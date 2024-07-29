const User = require("../models/users.model")

const checkTrialPeriod = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(401).send('User not found');
    }

    const currentDate = new Date();
    const trialStartDate = new Date(user.trialStartDate);
    const diffDays = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        user.isTrialActive = false;
        await user.save();
        return res.status(403).send('Your trial period has expired.');
    }

    next();
};

module.exports = checkTrialPeriod;
