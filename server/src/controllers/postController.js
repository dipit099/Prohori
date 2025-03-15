const { comment, vote, deleteComment } = require("../services/postService");
const { storageService } = require("../config/storage");
const commentOnPost = async (req, res, next) => {
  try {
    const {
      crime_report_id,
      content,
      user_id,
      //, fileArray
    } = req.body;

    const newComment = await comment(user_id, crime_report_id, content);

    // const modifiedFileArray = fileArray.map((file, index) => ({
    //   fileName: (index + 1).toString(),
    //   file: file,
    // }));

    // const result = await storageService.uploadFile(
    //   "prohori",
    //   modifiedFileArray,
    //   `comments/${newComment.id}`
    // );
    res.status(201).json({
      success: true,
      data: newComment,
      //url: result,
    });
  } catch (error) {
    next(error);
  }
};

const votePost = async (req, res, next) => {
  try {
    const { crime_report_id, vote_type, user_id } = req.body;

    const voteResult = await vote(user_id, crime_report_id, vote_type);
    res.status(200).json({
      success: true,
      data: voteResult,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await deleteComment(comment_id);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  commentOnPost,
  votePost,
  deletePostComment,
};
