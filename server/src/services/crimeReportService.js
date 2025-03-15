// src/services/crimeReportService.js
const {
  CrimeReport,
  User,
  District,
  Division,
  Comment,
  Vote,
  EmergencyContact
} = require("../models/index");
const { Op } = require("sequelize");

const createCrimeReport = async (reportData, user_id, is_anonymous = false) => {
  const { title, description, district_id, crime_time } = reportData;

  if (is_anonymous) {
    user_id = "00000000-0000-0000-0000-000000000000"; // user_id of an anonoymous user
  }

  console.log({
    user_id,
    district_id,
    title,
    description, // by default verification_score=0, is_deleted=false, created_at=current, updated_at=current, is_anonymous=false
    crime_time,
    post_time: new Date(),
  });

  const report = await CrimeReport.create({
    user_id,
    district_id,
    title,
    description, // by default verification_score=0, is_deleted=false, created_at=current, updated_at=current, is_anonymous=false
    crime_time,
    post_time: new Date(),
  });

  return report;
};

const getCrimeReports = async () => {
  try {
    const reports = await CrimeReport.findAll({
      where: {
        is_deleted: false,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: District,
          as: "districts",
          include: [
            {
              model: Division,
              as: "divisions",
            },
            {
              model: EmergencyContact,
              as: "emergency_contacts",
              attributes: ["id", "location", "phone_number", "email", "type", "is_reported"]
            }
          ]
        },
        {
          model: Comment,
          as: "comments",
          where: { is_deleted: false },
          required: false,
          include: {
            model: User,
            as: "user",
            attributes: ["id", "email"],
          },
        },
        {
          model: Vote,
          as: "votes",
          include: {
            model: User,
            as: "user",
            attributes: ["id", "email"],
          },
        },
      ],
      order: [["post_time", "DESC"]],
    });
 
    return reports.map(report => report.get({ plain: true }));
  } catch (error) {
    throw new Error(`Error fetching crime reports: ${error.message}`);
  }
 };

const updateCrimeReport = async (reportId, updateData) => {
  try {
    const report = await CrimeReport.findByPk(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await report.update(updateData);
    return report;
  } catch (error) {
    throw new Error(`Error updating report: ${error.message}`);
  }
};

const deleteCrimeReport = async (reportId) => {
  try {
    const report = await CrimeReport.findByPk(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await report.update({ is_deleted: true }); // Soft delete
    return true;
  } catch (error) {
    throw new Error(`Error deleting report: ${error.message}`);
  }
};

const getCrimeReportById = async (reportId) => {
  try {
    const report = await CrimeReport.findOne({
      where: {
        id: reportId,
        is_deleted: false,
      },
      include: [
        {
          model: User,
          as: "user", 
          attributes: ["id", "email", "is_anonymous"],
        },
        {
          model: District,
          as: "districts",
          include: [
            {
              model: Division,
              as: "divisions",
            },
            {
              model: EmergencyContact,
              as: "emergency_contacts",
              attributes: ["id", "location", "phone_number", "email", "type", "is_reported"]
            }
          ]
        },
        {
          model: Comment,
          as: "comments",
          where: { is_deleted: false },
          required: false,
          include: {
            model: User,
            as: "user",
            attributes: ["id"],
          },
        },
        {
          model: Vote,
          as: "votes",
          include: {
            model: User,
            as: "user",
            attributes: ["id"],
          },
        },
      ],
    });
 
    if (!report) throw new Error("Report not found");
    return report;
  } catch (error) {
    throw new Error(`Error fetching report: ${error.message}`);
  }
 };

module.exports = {
  createCrimeReport,
  getCrimeReports,
  updateCrimeReport,
  deleteCrimeReport,
  getCrimeReportById,
};
