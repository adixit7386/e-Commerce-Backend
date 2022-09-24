const Product = require("../../models/products");
const multer = require("multer");
const customErrorHandler = require("../../services/customErrorHandler");
const Joi = require("joi");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 100000 * 5 },
}).single("image");

const productStore = async (req, res, next) => {
  //multipart form data
  handleMultipartData(req, res, async (err) => {
    if (err) {
      return next(customErrorHandler.serverError(err.message));
    }

    const filePath = req.file.path;
    console.log(req.file);

    const productSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      size: Joi.string().required(),
    });

    const { error } = productSchema.validate(req.body);
    if (error) {
      //delete the uploaded file

      fs.unlink(appRoot + "/" + filePath, (e) => {
        if (e) {
          return next(customErrorHandler.serverError(e.message));
        }
      });
      //rootfolder/uploads/filename.png
      return next(error);
    }

    const { name, price, size } = req.body;
    let document;
    try {
      document = await Product.create({ name, price, size, image: filePath });
    } catch (error) {
      return next(error);
    }
    res.status(201).json(document);
  });
};

module.exports = productStore;
