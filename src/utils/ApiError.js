class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;   //Access the errors array ([])
    this.success = false;
    this.data = null; // Initialize data to null

    // Capture stack trace if provided
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export {ApiError};






//? const errorInstance = new ApiError(400, "Invalid request", ["Email is required"]);
//when you create the instance of the ApiError class like the above the returning value or object inside the errorInstance will be like this:

// console.log(errorInstance);
// {
//   message: "Invalid request",
//   statusCode: 400,
//   errors: ["Email is required"],
//   success: false,
//   data: null
// }

// console.log(errorInstance.sCode); // 400 
// console.log(errorInstance.message); // "Invalid request"
// console.log(errorInstance.errors); // ["Email is required"]

//* we can throw like this also:
// throw new ApiError(400, "Invalid request", ["Email is required"]);




// You don't need to pass success and data explicitly when calling the constructor because they are initialized by default in the constructor. These are default values that apply to all instances of ApiError. You can always modify them later if needed.