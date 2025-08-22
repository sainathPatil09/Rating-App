import mongoose from "mongoose";


const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  address: {
    type: String,
    required: true,
    maxlength: 400,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Store is linked to store owner
    required: true,
  },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
    },
  ],
});

storeSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  return (sum / this.ratings.length).toFixed(2);
});



export const Store = mongoose.model("Store", storeSchema);
