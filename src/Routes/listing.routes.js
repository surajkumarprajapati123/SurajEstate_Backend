const express = require("express");
const { ListingController } = require("../controller");
const auth = require("../Middleware/Auth");

const router = express.Router();
router.route("/all").get(ListingController.GetAllListing);
router.route("/create").post(auth, ListingController.CreateListing);
router.route("/delete/:id").delete(auth, ListingController.DeleteListing);
router.route("/update/:id").patch(auth, ListingController.updateListing);
router.route("/get/:id").get(ListingController.GetListingByIdother);
router.route("/search").get(ListingController.SearchPage);

module.exports = router;
