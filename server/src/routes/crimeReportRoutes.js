// // src/routes/crimeReportRoutes.js
// const express = require('express');
// const { create, list, update, remove } = require('../controllers/crimeReportController');
// const { authenticateToken, verifyVerifiedUser } = require('../middleware/authMiddleware');

// const router = express.Router();



// router.get('/', list);
// router.post('/',  authenticateToken, verifyVerifiedUser, create);
// router.put('/:id', authenticateToken, verifyVerifiedUser, update);
// router.delete('/:id', authenticateToken, verifyVerifiedUser, remove);

// router.post('/anonymous', create);

// module.exports = router;


const express = require('express');
const { create, list, update, remove,  fetchCaption } = require('../controllers/crimeReportController');
const { authenticateToken, verifyVerifiedUser } = require('../middleware/authMiddleware');
const { generateCaption } = require('../controllers/crimeReportController');
const {analyzeContent,updateAnalysis}= require("../controllers/crimeReportController")

const router = express.Router();

/**
 * @swagger
 * /crime-reports:
 *   get:
 *     summary: Get all crime reports
 *     tags: [Crime Reports]
 *     responses:
 *       200:
 *         description: List of crime reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CrimeReport'
 *                 success:
 *                   type: boolean
 */
router.get('/', list);

/**
 * @swagger
 * /crime-reports:
 *   post:
 *     summary: Create a new crime report
 *     tags: [Crime Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrimeReportInput'
 *     responses:
 *       201:
 *         description: Created crime report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CrimeReport'
 */
router.post('/', authenticateToken, verifyVerifiedUser, create);

/**
 * @swagger
 * /crime-reports/{id}:
 *   put:
 *     summary: Update a crime report
 *     tags: [Crime Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrimeReportUpdateInput'
 *     responses:
 *       200:
 *         description: Updated crime report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CrimeReport'
 */
router.put('/:id', authenticateToken, verifyVerifiedUser, update);

/**
 * @swagger
 * /crime-reports/{id}:
 *   delete:
 *     summary: Delete a crime report
 *     tags: [Crime Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Report deleted successfully
 */
router.delete('/:id', authenticateToken, verifyVerifiedUser, remove);

/**
 * @swagger
 * /crime-reports/anonymous:
 *   post:
 *     summary: Create an anonymous crime report
 *     tags: [Crime Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrimeReportAnonymousInput'
 *     responses:
 *       201:
 *         description: Created anonymous crime report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CrimeReport'
 */
router.post('/anonymous', create);

/**
 * @swagger
 * /crime-reports/generateCaption:
 *   post:
 *     summary: Generate a caption for crime report images
 *     tags: [Crime Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrls
 *             properties:
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       200:
 *         description: Generated caption
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 */
router.post('/generateCaption', generateCaption);

/**
 * @swagger
 * /crime_reports/fetchCaption:
 *   post:
 *     summary: Generate a caption for crime report images
 *     tags: [Crime Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - fileArray
 *             properties:
 *               user_id:
 *                 type: string
 *               fileArray:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Successfully generated caption
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 *       400:
 *         description: Invalid input or missing image URLs
 *       500:
 *         description: Internal server error
 */
router.post('/fetchCaption', fetchCaption);

/**
 * @swagger
 * /crime-reports/analyze:
 *   post:
 *     summary: Analyze content and get confidence score
 *     tags: [Crime Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrls
 *               - text
 *             properties:
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     confidenceScore:
 *                       type: number
 *                     flagged:
 *                       type: boolean
 */
router.post('/analyze', analyzeContent);

/**
 * @swagger
 * /crime-reports/{id}/analysis:
 *   put:
 *     summary: Update analysis fields (is_flagged and confidence_score) of a crime report
 *     tags: [Crime Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_flagged:
 *                 type: boolean
 *               confidence_score:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Updated crime report analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CrimeReport'
 */
router.put('/:id/analysis', updateAnalysis);

module.exports = router;