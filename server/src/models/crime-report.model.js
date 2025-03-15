// src/models/crime-report.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrimeReport = sequelize.define('CrimeReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
    district_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'districts', 
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,  
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    crime_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    post_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    verification_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_admin_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,  // Use DataTypes.BOOLEAN instead of Boolean
      defaultValue: false      // Use defaultValue instead of default
    },
    is_flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    confidence_score: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0
    }

  }, {
    tableName: 'crime_reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return CrimeReport;
};