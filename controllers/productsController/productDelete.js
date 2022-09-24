const Product = require("../../models/products");
const multer = require("multer");
const customErrorHandler = require("../../services/customErrorHandler");
const Joi = require("joi");
const fs = require("fs");

const productDelete = async (req, res, next) => {
  console.log(req.params.id);
  let document;
  try {
    document = await Product.findOneAndRemove({ _id: req.params.id });
    console.log(document);
    if (!document) {
      return next(new Error("nothing to delete"));
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

module.exports = productDelete;
