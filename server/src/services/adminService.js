const { User, CrimeReport, District, Division, EmergencyContact } = require("../models/index");

const banUser = async (user_id) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    await user.update({ is_banned: true });
    return user;
  } catch (error) {
    throw new Error(`Error banning user: ${error.message}`);
  }
};

const verifyReport = async (reportId) => {
  try {
    const report = await CrimeReport.findByPk(reportId);
    if (!report) {
      throw new Error("Report not found");
    }
    await report.update({ is_admin_verified: true });
    return report;
  } catch (error) {
    throw new Error(`Error verifying report: ${error.message}`);
  }
};

const getAllReportedEmergencyContacts = async () => {
  try {
    const contacts = await EmergencyContact.findAll({
      where: { is_reported: true },
      include: [
        {
          model: District,
          as: 'districts',
          include: {
            model: Division,
            as: 'divisions'
          }
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email']
        }
      ]
    });
    return contacts;
  } catch (error) {
    throw new Error(`Error fetching reported emergency contacts: ${error.message}`);
  }
 };
 
 const updateEmergencyContact = async (contactId, updateData) => {
  try {
    const contact = await EmergencyContact.findByPk(contactId);
    if (!contact) throw new Error("Emergency contact not found");
    
    await contact.update({...updateData, is_reported: false, reporting_user_id: null});
    return contact;
  } catch (error) {
    throw new Error(`Error updating emergency contact: ${error.message}`);
  }
 };


 
 module.exports = {
  banUser,
  verifyReport,
  getAllReportedEmergencyContacts,
  updateEmergencyContact,
 };