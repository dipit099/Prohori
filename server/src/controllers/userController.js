const {
  getUserById,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
  getUserCrimeReports,
  getAllUsers,
  reportEmergencyContact
} = require("../services/userService");

const { storageService } = require("../config/storage");

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    let url;
    try {
      url = await storageService.getAllFilesInDirectory(
        "prohori",
        `users/${id}`
      );
    } catch (err) {
      console.log(err);
    }

    res.json({ ...user, url });
  } catch (error) {
    next(error);
  }
};

const getPostsOfUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reports = await getUserCrimeReports(id);

    // Add URLs to each report
    const reportsWithUrls = await Promise.all(
      reports.map(async (report) => {
        try {
          const url = await storageService.getAllFilesInDirectory(
            "prohori",
            `posts/${report.id}`
          );

          const commentsUrls = await Promise.all(
            report.comments.map(async (comment) => {
              try {
                const commentUrl = await storageService.getAllFilesInDirectory(
                  "prohori",
                  `comments/${comment.id}`
                );
                const phototUrl = await storageService.getAllFilesInDirectory(
                  "prohori",
                  `users/${comment.user.id}`
                );
                return {
                  ...comment,
                  commentUrl,
                  user: {
                    ...comment.user,
                    phototUrl,
                  },
                };
              } catch (err) {
                return {
                  ...comment,
                  commentUrl: null,
                  user: {
                    ...comment.user,
                    phototUrl: null,
                  },
                };
              }
            })
          );
          return { ...report, url, comments: commentsUrls };
        } catch (err) {
          console.log(err);
          return { ...report, url: null, comments: commentsUrls };
        }
      })
    );

    res.json({
      data: reportsWithUrls,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatedUser = await updateUserService(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const updateProfilePhoto = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.body.photo;

  try {
    const photo = req.body.photo;

    const result = await storageService.uploadFile(
      "prohori",
      [{ fileName: `${id}`, file: photo }],
      `users/${id}`
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    try {
      const res = await storageService.deleteFile("prohori", [`users/${id}`]);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    // Add profile photo URLs
    const usersWithUrls = await Promise.all(
      users.map(async (user) => {
        try {
          const url = await storageService.getAllFilesInDirectory(
            "prohori",
            `users/${user.id}`
          );
          return { ...user.dataValues, url };
        } catch (err) {
          console.log(err);
          return { ...user.dataValues, url: null };
        }
      })
    );

    res.json({
      data: usersWithUrls,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const reportContact = async (req, res, next) => {
  try {
    const { contact_id } = req.params;
    const user_id = req.user.id;
 
    const updatedContact = await reportEmergencyContact(contact_id, user_id);
 
    res.status(200).json({
      success: true,
      message: "Emergency contact reported successfully",
      data: updatedContact
    });
  } catch (error) {
    next(error);
  }
 };

module.exports = {
  getUser,
  getPostsOfUser,
  updateUser,
  deleteUser,
  getUsers,
  updateProfilePhoto,
  reportContact
};
