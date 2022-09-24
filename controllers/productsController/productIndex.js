const Product = require("../../models/products");
const multer = require("multer");
const customErrorHandler = require("../../services/customErrorHandler");
const Joi = require("joi");
const fs = require("fs");

const productIndex = async (req, res, next) => {
  let documents;
  try {
    documents = await Product.find();
  } catch (err) {
    return next(error);
  }

  res.json(documents);
};

module.exports = productIndex;
