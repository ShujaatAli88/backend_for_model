const mongoose = require("mongoose")

const subscriptionSchema = mongoose.Schema({
    _id: { type: String, required: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaseDate: { type: Date, required: true },
    subscriptionType: { type: String, required: true }
},
    {
        timestamps: true
    }
)

const subscription = mongoose.model("SubscriptionDetail", subscriptionSchema)

module.exports = subscription