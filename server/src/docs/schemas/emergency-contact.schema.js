module.exports = {
  EmergencyContact: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      district_id: { type: "string", format: "uuid" },
      location: { type: "string" },
      phone_number: { type: "string" },
      email: { type: "string", format: "email" },
      is_reported: { type: "boolean" },
      reporting_user_id: { type: "string", format: "uuid" },
      type: {
        type: "string",
        enum: ["local_police", "hospital", "fire_service", "ambulance"],
      },
    },
  },

  EmergencyContactCreate: {
    type: "object",
    required: ["district_id", "location", "phone_number", "type"],
    properties: {
      district_id: { type: "string", format: "uuid" },
      location: { type: "string" },
      phone_number: { type: "string" },
      email: { type: "string", format: "email" },
      type: {
        type: "string",
        enum: ["local_police", "hospital", "fire_service", "ambulance"],
      },
    },
  },

  EmergencyContactUpdate: {
    type: "object",
    properties: {
      district_id: { type: "string", format: "uuid" },
      location: { type: "string" },
      phone_number: { type: "string" },
      email: { type: "string", format: "email" },
    },
  },
  EmergencyContactReport: {
    type: "object",
    properties: {
      is_reported: { type: "boolean" },
    },
  },
};
