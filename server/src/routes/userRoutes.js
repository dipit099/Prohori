const express = require('express');
const { getUser, getPostsOfUser, updateUser, deleteUser, getUsers, updateProfilePhoto, reportContact } = require('../controllers/userController');
const { authenticateToken, verifyVerifiedUser } = require('../middleware/authMiddleware');

const router = express.Router();

/**
* @swagger
* /users/{id}:
*   get:
*     summary: Get user by ID
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: User details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.get('/:id', authenticateToken, getUser);

/**
* @swagger
* /users/{id}/reports:
*   get:
*     summary: Get all crime reports by user
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: List of user's crime reports
*/
router.get('/:id/reports', authenticateToken,verifyVerifiedUser, getPostsOfUser);

/**
* @swagger
* /users/{id}:
*   put:
*     summary: Update user
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserInfoEdit'
*     responses:
*       200:
*         description: Updated user details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.put('/:id', authenticateToken, updateUser);

/**
* @swagger
* /users/{id}:
*   delete:
*     summary: Delete user
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       204:
*         description: User deleted successfully
*/
router.delete('/:id', authenticateToken, deleteUser);

/**
* @swagger
* /users:
*   get:
*     summary: Get all users
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     responses:
*       200:
*         description: List of all users
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/User'
*                 success:
*                   type: boolean
*/
router.get('/', authenticateToken, getUsers);

router.post('/:id', authenticateToken, updateProfilePhoto);


/**
* @swagger
* /users/emergency-contacts/{contact_id}/report:
*   post:
*     summary: Report an emergency contact
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: contact_id
*         required: true
*         schema:
*           type: string
*           format: uuid
*     responses:
*       200:
*         description: Emergency contact reported successfully
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
router.post('/emergency-contacts/:contact_id/report', authenticateToken, reportContact);

// Add to existing exports
module.exports = router;