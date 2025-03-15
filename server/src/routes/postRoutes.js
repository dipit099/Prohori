const express = require('express');
const { commentOnPost, votePost, deletePostComment } = require('../controllers/postController');
const { authenticateToken, verifyVerifiedUser } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /posts/comment:
 *   post:
 *     summary: Create a new comment on a crime report
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - crime_report_id
 *               - content
 *               - user_id
 *             properties:
 *               crime_report_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the crime report to comment on
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Content of the comment
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user making the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 */
router.post('/comment', authenticateToken, verifyVerifiedUser, commentOnPost);

/**
 * @swagger
 * /posts/vote:
 *   post:
 *     summary: Vote on a crime report
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - crime_report_id
 *               - vote_type
 *               - user_id
 *             properties:
 *               crime_report_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the crime report to vote on
 *               vote_type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: Type of vote
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user voting
 *     responses:
 *       200:
 *         description: Vote processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Vote'
 *                     - type: 'null'
 *                   description: Vote data (null if vote was removed)
 */
router.post('/vote', authenticateToken, verifyVerifiedUser, votePost);

/**
* @swagger
* /posts/comment/{comment_id}:
*   delete:
*     summary: Delete a comment
*     tags: [Posts]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: comment_id
*         required: true
*         schema:
*           type: string
*           format: uuid
*         description: ID of the comment to delete
*     responses:
*       200:
*         description: Comment deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 message:
*                   type: string
*                   example: Comment deleted successfully
*/
router.delete('/comment/:comment_id', authenticateToken, verifyVerifiedUser, deletePostComment);

module.exports = router;