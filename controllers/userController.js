import userModel from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const signup = async (req, res) => {
  try {
    const { avatar, username, password, displayName } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser)
      return responseHandler.badrequest(res, "username already used");

    const avatarUrl = await cloudinary.uploader.upload(avatar, {
      upload_preset: "unsigned_upload",
      public_id: `${username}-avatar`,
      allowed_formats: [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "svg",
        "ico",
        "jfif",
        "webp",
      ],
      transformation: ["crop"],
    });
    const user = new userModel();

    user.avatar = avatarUrl.url;
    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel
      .findOne({ username })
      .select("avatar username password salt id displayName");

    if (!user) return responseHandler.badrequest(res, "User does not exist");

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("avatar id username");

    if (!user) return responseHandler.unauthorize(res);

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0]; // Extract public_id from URL
      await cloudinary.uploader.destroy(publicId);
    }

    const avatarUrl = await cloudinary.uploader.upload(avatar, {
      upload_preset: "unsigned_upload",
      public_id: `${user.username}-avatar`,
      allowed_formats: [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "svg",
        "ico",
        "jfif",
        "webp",
      ],
      transformation: ["crop"],
    });

    user.avatar = avatarUrl.url;

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  updateAvatar,
};
