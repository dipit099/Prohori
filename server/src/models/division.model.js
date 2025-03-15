// src/models/division.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Division = sequelize.define('Division', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'divisions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
  });

  return Division;
};