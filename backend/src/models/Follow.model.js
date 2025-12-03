import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
followSchema.clearIndexes({follower:1,person:1},{unique: true}); // if u didnt use unique that only applies indexes which is basically helps us to instead of checking eachnev doc ,pick some cols make it sorted in order of cols use something like binary search
const Follow = mongoose.model("Follow", followSchema);
export { Follow };
