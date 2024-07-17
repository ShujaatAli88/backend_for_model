const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    trialStateDate: { type: Date, default: Date.now }
},
    {
        timestamps: true
    }
)

const user = mongoose.model("User", userSchema)

export default user