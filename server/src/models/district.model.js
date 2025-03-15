// src/models/district.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const District = sequelize.define('District', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // division_id: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'divisions', 
    //     key: 'id'
    //   }
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'districts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
  });

  return District;
};