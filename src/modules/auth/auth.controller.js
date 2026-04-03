import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { registerService } from "./auth.service.js";


const register = asyncHandler(async (req, res) => {
  const { companyName, email, password } = req.body;
  console.log("email: ", email);

  if ([companyName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const { user, token } = await registerService({
    companyName,
    email,
    password,
  });

  // send cookie
  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(201)
    .cookie("token", token, option)
    .json(new ApiResponse(201, { user }, "User created successfully"));
});


export { register };
