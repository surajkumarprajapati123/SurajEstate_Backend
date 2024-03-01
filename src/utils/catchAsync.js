// const CatchAsyc = (func) => (req, res, next) =>
//   Promise.resolve(func(req, res, next)).catch((err) => next(err));

// module.exports = CatchAsyc;

const CatchAsyc = (fun) => async (req, res, next) => {
  try {
    await fun(req, res, next);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      // res.status(400).json({ error: "Validation Error", validationErrors });
      res.status(400).json({ validationErrors });
    } else {
      // Forward other types of errors to the global error handler
      next(error);
    }
  }
};

module.exports = CatchAsyc;
