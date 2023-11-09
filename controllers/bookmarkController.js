import responseHandler from "../handlers/response.js";
import bookmarkModel from "../models/bookmark.js";

const addBookmark = async (req, res) => {
  try {
    const isBookmark = await bookmarkModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    });

    if (isBookmark) return responseHandler.ok(res, isBookmark);

    const bookmark = new bookmarkModel({
      ...req.body,
      user: req.user.id,
    });

    await bookmark.save();

    responseHandler.created(res, bookmark);
  } catch {
    responseHandler.error(res);
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;

    const bookmark = await bookmarkModel.findOne({
      user: req.user.id,
      _id: bookmarkId,
    });

    if (!bookmark) return responseHandler.notfound(res);

    await bookmark.deleteOne();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getBookmarksOfUser = async (req, res) => {
  try {
    const bookmark = await bookmarkModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    responseHandler.ok(res, bookmark);
  } catch {
    responseHandler.error(res);
  }
};

export default { addBookmark, removeBookmark, getBookmarksOfUser };
