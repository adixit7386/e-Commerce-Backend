const Product = require("../../models/products");
const multer = require("multer");
const customErrorHandler = require("../../services/customErrorHandler");
const Joi = require("joi");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const handleMultipartData = multer({
  storage: storage,
  limits: { fileSize: 100000 * 5 },
}).single("image");

const productUpdate = async (req, res, next) => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      return next(customErrorHandler.serverError(err.message));
    }
    let filePath;
    if (req.file) {
      filePath = req.file.path;
    }

    const productSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      size: Joi.string().required(),
    });

    const { error } = productSchema.validate(req.body);
    if (error) {
      //delete the uploaded file
      if (req.file) {
        fs.unlink(appRoot + "\\" + filePath, (e) => {
          if (e) {
            return next(customErrorHandler.serverError(e.message));
          }
        });
      }
      //rootfolder/uploads/filename.png
      return next(error);
    }

    const { name, price, size } = req.body;
    let document;
    try {
      document = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          price,
          size,
          ...(req.file && { image: filePath }),
        }
      );
    } catch (error) {
      return next(error);
    }
    res.status(201).json(document);
  });
};

module.exports = productUpdate;
