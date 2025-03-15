// src/controllers/crimeReportController.js
const {
  createCrimeReport,
  getCrimeReports,
  updateCrimeReport,
  deleteCrimeReport,
  getCrimeReportById,
} = require("../services/crimeReportService");
const { generateCrimeReportCaption } = require("../services/AICaptionService");
const { analyzePost } = require('../services/huggingFaceService');

const { storageService } = require("../config/storage");
const commentsModel = require("../models/comments.model");

const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      district_id,
      crime_time,
      user_id,
      is_anonymous,
      //fileArray,
    } = req.body;

    const report = await createCrimeReport(
      { title, description, district_id, crime_time },
      user_id,
      is_anonymous
    );

    // const modifiedFileArray = fileArray.map((file, index) => ({
    //   fileName: (index + 1).toString(),
    //   file: file,
    // }));

    // const result = await storageService.uploadFile(
    //   "prohori",
    //   modifiedFileArray,
    //   `posts/${report.id}`
    // );

    res.status(201).json({report
      //,result
    });
  } catch (error) {
    next(error);
  }
};

const fetchCaption = async (req, res, next) => {
  try {
    const { user_id, fileArray } = req.body;

    const modifiedFileArray = fileArray.map((file, index) => ({
      fileName: (index + 1).toString(),
      file: file,
    }));

    const result = await storageService.uploadFile(
      "prohori",
      modifiedFileArray,
      `buffer/${user_id}`
    );
    console.log(result);

    function convertToImageUrls(data) {
      return {
        imageUrls: data.map((item) => item.url),
      };
    }

    console.log(convertToImageUrls(result));

    imageUrls = convertToImageUrls(result);

    try {
      if (!imageUrls || !Array.isArray(imageUrls)) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of image URLs",
        });
      }

      const caption = await generateCrimeReportCaption(imageUrls);

      res.json({
        success: true,
        data: caption,
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const reports = await getCrimeReports();

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

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await updateCrimeReport(id, req.body);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCrimeReport(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
const generateCaption = async (req, res, next) => {
  try {
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of image URLs",
      });
    }

    const caption = await generateCrimeReportCaption(imageUrls);

    res.json({
      success: true,
      data: caption,
    });
  } catch (error) {
    next(error);
  }
};



const analyzeContent = async (req, res, next) => {
    try {
        const { text, imageUrls } = req.body;

        if (!imageUrls || !Array.isArray(imageUrls)) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of image URLs"
            });
        }

        const analysis = await analyzePost(text, imageUrls);

        res.json({
            success: true,
            data: {
                confidenceScore: analysis.confidenceScore,
                flagged: analysis.flagged
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_flagged, confidence_score } = req.body;

    // Only update the analysis-related fields
    const updatedReport = await updateCrimeReport(id, {
      is_flagged,
      confidence_score
    });

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  update,
  remove,
  generateCaption,
  fetchCaption,
  analyzeContent,
  updateAnalysis
};
