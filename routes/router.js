const express = require("express");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const refreshController = require("../controllers/refreshController");
const logoutController = require("../controllers/logoutController");
const productStore = require("../controllers/productsController/productStore");
const productUpdate = require("../controllers/productsController/productUpdate");
const productDelete = require("../controllers/productsController/productDelete");
const productIndex = require("../controllers/productsController/productIndex");
const productFind = require("../controllers/productsController/findOne");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", auth, userController);
router.post("/refresh", refreshController);
router.post("/logout", auth, logoutController);

router.post("/products", [auth, admin], productStore);
router.put("/products/:id", [auth, admin], productUpdate);
router.delete("/products/:id", [auth, admin], productDelete);
router.get("/products", [auth, admin], productIndex);
router.get("/products/:id", [auth, admin], productFind);
module.exports = router;
