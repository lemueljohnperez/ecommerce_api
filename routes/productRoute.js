// Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController.js");
const {verify, verifyAdmin} = require("../auth");

//[Routing Component] 
const router = express.Router();

router.post("/", verify, verifyAdmin, productController.addProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.get("/", productController.getAllActiveProducts);

router.get("/:productId", productController.getProduct);

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Add search for products by their names
router.post("/searchByName", productController.searchByName);

/*// Add search for products by price range
router.post("/products/searchByName", productController.searchByPrice);*/

module.exports = router;