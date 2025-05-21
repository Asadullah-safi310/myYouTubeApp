import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber : {
        type: mongoose.Schema.Types.ObjectId,  // one who is subscribing  Ex: "assadullah"
        ref: "User"
    }, 
    channel: {
        type: mongoose.Schema.Types.ObjectId,  // one to whom the 'subscriber' is subscribing  Ex: "hiteshchoudhary"
        ref: "User"
    }
}, {
    timestamps: true
}
)

export const Subscription = mongoose.model("subscription", subscriptionSchema)











//"subscription" → this is the table (collection) name in MongoDB (Mongoose automatically pluralizes it to "subscriptions").

/*
Subscription → this is the model name used in Mongoose to interact with the "subscriptions" collection in MongoDB,
and gives you access to methods like:
sub.find()
sub.findById()
sub.create()
sub.updateOne()
sub.deleteOne()
etc.
*/

