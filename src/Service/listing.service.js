const { ListingModel } = require("../Models");

const CreateListing = async (listingdata) => {
  const data = await ListingModel.create(listingdata);
  return data;
};

const GetListingById = async (id) => {
  const data = await ListingModel.findById(id);
  // console.log(data);
  if (!data) {
    return { message: "No data found" };
  }
  return data;
};
// GetListingById("65d988f454d2cc8180c788ea");

const DeleteListing = async (id) => {
  const data = await ListingModel.findByIdAndDelete(id);
  return data;
};

const UpdateListing = async (id, listingdata) => {
  const data = await ListingModel.findByIdAndUpdate(id, listingdata, {
    new: true,
  });
  if (!data) {
    return { message: "No data found" };
  }
  return data;
};

const GetallListing = async () => {
  const date = await ListingModel.find();

  if (!date) {
    return { message: "No data found" };
  }
  return date;
};

module.exports = {
  CreateListing,
  // GetListing,
  GetListingById,
  DeleteListing,
  UpdateListing,
  GetallListing,
};
