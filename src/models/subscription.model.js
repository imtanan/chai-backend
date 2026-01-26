import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
      ref: "User",
      /* Note:❗ channel me User ka _id hi store hota hai
      ❗ Lekin role ke taur par: “jis ko subscribe kiya gaya”
Us waqt kya hota hai? (2 lines)

Logged-in user → subscriber

Jis user ko subscribe kiya → channel

🔧 Code-level example (ONE doc)
// Ali ne Ahmed ko subscribe kiya

{
  subscriber: Ali._id,    // jis ne click kiya
  channel: Ahmed._id      // jis ko subscribe kiya
}


🧠 Isi moment par:

channel ke andar Ahmed ka user._id save hota hai
*/
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
