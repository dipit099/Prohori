module.exports = {
  CrimeReport: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the crime report'
      },
      title: {
        type: 'string',
        description: 'Title of the crime report'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the crime'
      },
      district_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the district where crime occurred'
      },
      crime_time: {
        type: 'string',
        format: 'date-time',
        description: 'Time when the crime occurred'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the user creating the report'
      },
      verification_score: {
        type: 'integer',
        description: 'Verification score of the report'
      },
      is_deleted: {
        type: 'boolean',
        description: 'Whether the report is deleted'
      },
      is_admin_verified: {
        type: 'boolean',
        description: 'Whether the report is verified'
      },
      is_anonymous: {
        type: 'boolean',
        description: 'Whether the report is anonymous'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    }
  },
  CrimeReportInput: {
    type: 'object',
    required: ['user_id', 'district_id', 'title', 'description', 'crime_time', 'is_anonymous'],
    properties: {
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the user creating the report'
      },
      district_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the district where crime occurred'
      },
      title: {
        type: 'string',
        description: 'Title of the crime report'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the crime'
      },
      crime_time: {
        type: 'string',
        format: 'date-time',
        description: 'Time when the crime occurred'
      },
      is_anonymous: {
        type: 'boolean',
        description: 'Whether to post anonymously'
      }
    }
  },
  CrimeReportUpdateInput: {
    type: 'object',
    required: ['district_id', 'title', 'description', 'crime_time'],
    properties: {
      district_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the district where crime occurred'
      },
      title: {
        type: 'string',
        description: 'Title of the crime report'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the crime'
      },
      crime_time: {
        type: 'string',
        format: 'date-time',
        description: 'Time when the crime occurred'  
      },
    }
  },
  CrimeReportAnonymousInput: {
    type: 'object',
    required: ['district_id', 'title', 'description', 'crime_time', 'is_anonymous'],
    properties: {
      district_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the district where crime occurred'
      },
      title: {
        type: 'string',
        description: 'Title of the crime report'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the crime'
      },
      crime_time: {
        type: 'string',
        format: 'date-time',
        description: 'Time when the crime occurred'
      },
      is_anonymous: {
        type: 'boolean',
        description: 'Whether to post anonymously'
      }
    }
  },
};