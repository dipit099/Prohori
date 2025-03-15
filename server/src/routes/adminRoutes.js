const express = require("express");
const {
  banAUser,
  verifyAReport,
  getReportedEmergencyContacts,
  updateReportedEmergencyContact,
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /admin/{user_id}/ban:
 *   put:
 *     summary: Ban a user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User banned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.put("/:user_id/ban", authenticateToken, banAUser);

/**
 * @swagger
 * /admin/{report_id}/verify:
 *   put:
 *     summary: Verify a report
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Report verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CrimeReport'
 */
router.put("/:report_id/verify", authenticateToken, verifyAReport);

// In adminRoutes.js, add these new routes:

/**
 * @swagger
 * /admin/emergency-contacts/reported:
 *   get:
 *     summary: Get all reported emergency contacts
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reported emergency contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmergencyContact'
 */
router.get(
  "/emergency-contacts/reported",
  authenticateToken,
  getReportedEmergencyContacts
);

/**
 * @swagger
 * /admin/emergency-contacts/{contact_id}:
 *   put:
 *     summary: Update a reported emergency contact
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmergencyContactUpdate'
 *     responses:
 *       200:
 *         description: Emergency contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmergencyContact'
 */
router.put(
  "/emergency-contacts/:contact_id",
  authenticateToken,
  updateReportedEmergencyContact
);

module.exports = router;
