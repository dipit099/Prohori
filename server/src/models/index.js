// src/models/index.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

///----------------------------------------------------------------------------------------------------
// Import only needed models
const User = require("./user");
const AuthToken = require("./authToken");
const Division = require("./division.model.js")(sequelize);
const District = require("./district.model.js")(sequelize);
const CrimeReport = require("./crime-report.model.js")(sequelize);
const Comment = require("./comments.model.js")(sequelize);
const Vote = require("./votes.model.js")(sequelize);
const EmergencyContact = require("./emergency_contact.model.js")(sequelize);

// Define only auth-related associations
const defineAssociations = () => {
  // authtoken and user
  AuthToken.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(AuthToken, {
    foreignKey: "user_id",
    as: "authTokens",
  });

  // districts and divisions
  District.belongsTo(Division, {
    foreignKey: "division_id",
    as: "divisions",
  });

  Division.hasMany(District, {
    foreignKey: "division_id",
    as: "districts",
  });

  // Crime Report and districts
  CrimeReport.belongsTo(District, {
    foreignKey: "district_id",
    as: "districts",
  });

  District.hasMany(CrimeReport, {
    foreignKey: "district_id",
    as: "crime_reports",
  });

  // Crime Report and users
  CrimeReport.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(CrimeReport, {
    foreignKey: "user_id",
    as: "crime_reports",
  });

  // comments and crime reports
  Comment.belongsTo(CrimeReport, {
    foreignKey: "crime_report_id",
    as: "crime_reports",
  });

  CrimeReport.hasMany(Comment, {
    foreignKey: "crime_report_id",
    as: "comments",
  });

  // coments and users
  Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comments",
  });

  // votes and crime_reports
  Vote.belongsTo(CrimeReport, {
    foreignKey: "crime_report_id",
    as: "crime_reports",
  });

  CrimeReport.hasMany(Vote, {
    foreignKey: "crime_report_id",
    as: "votes",
  });

  // votes and crime_reports
  Vote.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Vote, {
    foreignKey: "user_id",
    as: "votes",
  });

  // Add to defineAssociations():
  EmergencyContact.belongsTo(District, {
    foreignKey: "district_id",
    as: "districts",
  });

  District.hasMany(EmergencyContact, {
    foreignKey: "district_id",
    as: "emergency_contacts",
  });

  EmergencyContact.belongsTo(User, {
    foreignKey: "reporting_user_id",
    as: "user",
  });

  User.hasMany(EmergencyContact, {
    foreignKey: "reporting_user_id",
    as: "emergency_contacts",
  });
};

// Initialize associations
defineAssociations();
///----------------------------------------------------------------------------------------------------

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
  sequelize,
  User,
  AuthToken,
  CrimeReport,
  Division,
  District,
  Vote,
  Comment,
  EmergencyContact
};
