// src/docs/schemas/posts.schema.js
module.exports = {
    Comment: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the comment'
            },
            user_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID of the user who made the comment'
            },
            crime_report_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID of the crime report being commented on'
            },
            content: {
                type: 'string',
                maxLength: 2000,
                description: 'Content of the comment'
            },
            is_deleted: {
                type: 'boolean',
                description: 'Whether the comment has been deleted'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the comment was created'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the comment was last updated'
            }
        }
    },
    Vote: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the vote'
            },
            user_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID of the user who voted'
            },
            crime_report_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID of the crime report being voted on'
            },
            vote_type: {
                type: 'string',
                enum: ['upvote', 'downvote'],
                description: 'Type of vote'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the vote was created'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the vote was last updated'
            }
        }
    }
};