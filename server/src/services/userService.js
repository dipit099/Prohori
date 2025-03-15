const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, CrimeReport, District, Division, Comment, Vote, EmergencyContact } = require('../models/index');
const config = require('../config/config');

const getUserById = async (user_id) => {
 try {
   const user = await User.findByPk(user_id, {
     attributes: { exclude: ['password_hash'] }
   });
   if (!user) throw new Error('User not found');
   return user;
 } catch (error) {
   throw new Error(`Error fetching user: ${error.message}`);
 }
};

const updateUser = async (user_id, updateData) => {
 try {
   const user = await User.findByPk(user_id);
   if (!user) throw new Error('User not found');
   
  //  if (updateData.password) {
  //    const salt = await bcrypt.genSalt(10);
  //    updateData.password_hash = await bcrypt.hash(updateData.password, salt);
  //    delete updateData.password;
  //  }
   
   await user.update(updateData);
   return user;
 } catch (error) {
   throw new Error(`Error updating user: ${error.message}`);
 }
};

const deleteUser = async (user_id) => {
 try {
   const user = await User.findByPk(user_id);
   if (!user) throw new Error('User not found');
   await user.destroy();
   return true;
 } catch (error) {
   throw new Error(`Error deleting user: ${error.message}`);
 }
};

// const getUserCrimeReports = async (user_id) => {
//  try {
//    const reports = await CrimeReport.findAll({
//      where: { 
//        user_id: user_id,
//        is_deleted: false
//      },
//      order: [['post_time', 'DESC']]
//    });
//    return reports;
//  } catch (error) {
//    throw new Error(`Error fetching user reports: ${error.message}`);
//  }
// };

const getUserCrimeReports = async (user_id) => {
  try {
    const reports = await CrimeReport.findAll({
      where: { 
        user_id: user_id,
        is_deleted: false
      },
      include: [
        {
          model: District,
          as: 'districts',
          include: [
            {
              model: Division,
              as: 'divisions',
              attributes: ['id', 'name']
            },
            {
              model: EmergencyContact,
              as: 'emergency_contacts',
              attributes: ['id', 'location', 'phone_number', 'email', 'type', 'is_reported']
            }
          ],
          attributes: ['id', 'name']
        },
        {
          model: Comment,
          as: 'comments',
          where: { is_deleted: false },
          required: false,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'is_anonymous']
          }]
        },
        {
          model: Vote,
          as: 'votes',
          attributes: ['id', 'vote_type'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'is_anonymous']
          }]
        }
      ],
      order: [
        ['post_time', 'DESC'],
        ['comments', 'created_at', 'DESC']
      ]
    });
    
    return reports.map(report => report.get({ plain: true }));
  } catch (error) {
    throw new Error(`Error fetching user reports: ${error.message}`);
  }
 };


const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['id', 'ASC']]
    });
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const reportEmergencyContact = async (contactId, userId) => {
  try {
    const contact = await EmergencyContact.findByPk(contactId);
    if (!contact) throw new Error("Emergency contact not found");
    
    await contact.update({ is_reported: true, reporting_user_id: userId });
    return contact;
  } catch (error) {
    throw new Error(`Error reporting emergency contact: ${error.message}`);
  }
 };


module.exports = {
  getUserById,
  updateUser,
  deleteUser,
  getUserCrimeReports,
  getAllUsers,
  reportEmergencyContact
};