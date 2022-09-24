const Product = require("../../models/products");
const multer = require("multer");
const customErrorHandler = require("../../services/customErrorHandler");
const Joi = require("joi");
const fs = require("fs");

const productFind = async (req, res, next) => {
  console.log(req.params.id);
  let document;
  try {
    document = await Product.findOne({ _id: req.params.id });
    console.log(document);
    if (!document) {
      return next(new Error("document not found"));
    }
    const filePath = document._doc.image;
    //image delete
    fs.unlink(appRoot + "\\" + filePath, (e) => {
      if (e) {
        return next(customErrorHandler.serverError(e.message));
      }
    });
  } catch (error) {
    return next(error);
  }
  res.status(201).json(document);
};

module.exports = productFind;
