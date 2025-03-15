const express = require('express');
const { getDistrictsAndDivisions } = require('../controllers/districtController');

const router = express.Router();

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get all districts grouped by divisions
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: Successfully retrieved districts and divisions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example:
 *                     Dhaka:
 *                       division_id: "123e4567-e89b-12d3-a456-426614174000"
 *                       division_name: "Dhaka"
 *                       districts:
 *                         - id: "123e4567-e89b-12d3-a456-426614174001"
 *                           name: "Mirpur"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/', getDistrictsAndDivisions);

module.exports = router;