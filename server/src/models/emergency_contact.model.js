const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 const EmergencyContact = sequelize.define('EmergencyContact', {
   id: {
     type: DataTypes.UUID,
     defaultValue: DataTypes.UUIDV4,
     primaryKey: true
   },
   district_id: {
     type: DataTypes.UUID,
     allowNull: false,
     references: {
       model: 'districts',
       key: 'id'
     }
   },
   location: {
     type: DataTypes.TEXT,
     allowNull: false
   },
   phone_number: {
     type: DataTypes.STRING(20),
     allowNull: false
   },
   email: {
     type: DataTypes.STRING(255),
     allowNull: true
   },
   is_reported: {
     type: DataTypes.BOOLEAN,
     defaultValue: false
   },
   reporting_user_id: {
     type: DataTypes.UUID,
     allowNull: true,
     references: {
       model: 'users',
       key: 'id'
     }
   },
   type: {
     type: DataTypes.ENUM('local_police', 'hospital', 'fire_service', 'ambulance'),
     allowNull: false
   }
 }, {
   tableName: 'emergency_contacts',
   timestamps: true,
   createdAt: 'created_at',
   updatedAt: 'updated_at',
   underscored: true
 });

 return EmergencyContact;
};