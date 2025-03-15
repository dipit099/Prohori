const { banUser, verifyReport, getAllReportedEmergencyContacts, updateEmergencyContact } = require("../services/adminService");

const banAUser = async (req, res, next) => {
 try {
   const { user_id } = req.params;
   const bannedUser = await banUser(user_id);

   res.status(200).json({
     success: true,
     message: "User banned successfully",
     data: bannedUser,
   });
 } catch (error) {
   next(error);
 }
};

const verifyAReport = async (req, res, next) => {
 try {
   const { report_id } = req.params;
   const verifiedReport = await verifyReport(report_id);

   res.status(200).json({
     success: true, 
     message: "Report verified successfully",
     data: verifiedReport,
   });
 } catch (error) {
   next(error);
 }
};

const getReportedEmergencyContacts = async (req, res, next) => {
 try {
   const contacts = await getAllReportedEmergencyContacts();
   res.status(200).json({
     success: true,
     data: contacts
   });
 } catch (error) {
   next(error);
 }
};

const updateReportedEmergencyContact = async (req, res, next) => {
 try {
   const { contact_id } = req.params;
   const updatedContact = await updateEmergencyContact(contact_id, req.body);
   res.status(200).json({
     success: true,
     message: "Emergency contact updated successfully",
     data: updatedContact
   });
 } catch (error) {
   next(error);
 }
};

module.exports = {
 banAUser,
 verifyAReport,
 getReportedEmergencyContacts,
 updateReportedEmergencyContact
};