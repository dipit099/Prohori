// src/docs/schemas/user.schema.js
module.exports = {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        phone_number: { type: 'string' },
        is_verified: { type: 'boolean' },
        is_admin: { type: 'boolean' },
        is_banned: { type: 'boolean' },
        bio: { type: 'string' },
        contact_info: { type: 'string' }
      }
    },
    UserRegistration: {
      type: 'object',
      required: ['email', 'password', 'phone_number'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password', minLength: 6 },
        phone_number: { type: 'string' }
      }
    },
    UserInfoEdit: {
      type: 'object',
      required: [],
      properties: {
        email: { type: 'string', format: 'email' },
        phone_number: { type: 'string' },
        bio: { type: 'string' },
        contact_info: { type: 'string' }
      }
    }
  };