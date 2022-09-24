const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (image) => {
        return `${process.env.APP_URL}/${image}`;
      },
    },
  },
  { timeStamps: true, toJSON: { getters: true } }
);

module.exports = new mongoose.model("Product", productSchema);
