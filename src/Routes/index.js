const express = require("express");
const UserRouter = require("./user.routes");
const GoogleRouer = require("./google.routes");
const ListingRouter = require("./listing.routes");

const router = express.Router();

const Allroutes = [
  {
    route: "/users",
    routes: UserRouter,
  },
  {
    route: "/auth",
    routes: GoogleRouer,
  },
  {
    route: "/users/listing",
    routes: ListingRouter,
  },
];

Allroutes.forEach((data) => {
  router.use(data.route, data.routes);
});

module.exports = router;
