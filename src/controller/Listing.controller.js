const { ListingModel } = require("../Models");
const { ListingService } = require("../Service");
const ApiError = require("../utils/ApiError");
const ApiResponce = require("../utils/ApiResponce");
const CatchAsyc = require("../utils/catchAsync");

const CreateListing = CatchAsyc(async (req, res) => {
  const responce = await ListingService.CreateListing(req.body);

  res.status(200).json(responce);
});

const GetListingByIdother = CatchAsyc(async (req, res) => {
  const data = await ListingService.GetListingById(req.params.id);
  res.json(data);
});
const Getlistbyid = CatchAsyc(async (req, res) => {
  const responce = await ListingService.GetListing(req.params.id);
  console.log(responce);

  res.status(200).json(responce);
});

const DeleteListing = CatchAsyc(async (req, res) => {
  const responce = await ListingService.DeleteListing(req.params.id);
  if (!responce) {
    throw new ApiError(404, "Listing not found");
  }
  if (req.user.id !== responce.userRef) {
    throw new ApiError(404, "You can delete only own listing ");
  } else {
    res.status(200).json(responce);
  }
});

const updateListing = CatchAsyc(async (req, res) => {
  const data = await ListingService.UpdateListing(req.params.id, req.body);

  if (req.user.id !== data.userRef) {
    throw new ApiError(404, "You can update only own listing ");
  }
  res.json(data);
});

const GetAllListing = CatchAsyc(async (req, res) => {
  const data = await ListingService.GetallListing();
  res.json(data);
});

const SearchPage = CatchAsyc(async (req, res) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;

  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;

  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;

  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;

  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent", "Apartment"] };
  }

  const searchTerm = req.query.searchTerm || "";

  const sort = req.query.sort || "createdAt";

  const order = req.query.order || "desc";

  const listings = await ListingModel.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);
  // const count = listings.length;
  // console.log(count);
  res.json(listings);
});

module.exports = {
  CreateListing,
  Getlistbyid,
  DeleteListing,
  updateListing,
  GetListingByIdother,
  SearchPage,
  GetAllListing,
};
