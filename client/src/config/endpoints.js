const BASE_URL = "http://localhost:3000/api"; // Replace with actual API URL

const ENDPOINTS = {
    // Authentication
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    SEND_OTP: `${BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,

    // Crime Reports
    CRIME_REPORTS: `${BASE_URL}/crime-reports`, // Get all crime reports
    // /users/emergency-contacts/{contact_id}/report
    REPORT_CONTACT: (contact_id) => `${BASE_URL}/users/emergency-contacts/${contact_id}/report`, // Report a contact
   

    
    ///users/{id}/reports
    USER_CRIME_REPORTS: (id) => `${BASE_URL}/users/${id}/reports`, // Get all reports by a user
    CREATE_CRIME_REPORT: `${BASE_URL}/crime-reports`, // Create a new crime report

    UPDATE_CRIME_REPORT: (id) => `${BASE_URL}/crime-reports/${id}`, // Update a crime report
    DELETE_CRIME_REPORT: (id) => `${BASE_URL}/crime-reports/${id}`, // Delete a crime report
    
    CREATE_ANONYMOUS_REPORT: `${BASE_URL}/crime-reports/anonymous`, // Create an anonymous crime report
    FETCH_CAPTION: `${BASE_URL}/crime_reports/fetchCaption`, // Generate caption for images

    // Districts
    GET_DISTRICTS: `${BASE_URL}/districts`, // Get all districts grouped by divisions

    // Posts (Comments & Votes)
    //delete a comment by comment_id
    DELETE_COMMENT: (comment_id) => `${BASE_URL}/posts/comment/${comment_id}/`, // Delete a comment
    COMMENT_ON_POST: `${BASE_URL}/posts/comment`, // Create a comment on a crime report
    VOTE_ON_POST: `${BASE_URL}/posts/vote`, // Vote on a crime report

    // Users
    USERS_BY_ID: (id) => `${BASE_URL}/users/${id}`, // Get user by ID
    UPDATE_USER: (id) => `${BASE_URL}/users/${id}`, // Update user info
    DELETE_USER: (id) => `${BASE_URL}/users/${id}`, // Delete user
    GET_USER_REPORTS: (id) => `${BASE_URL}/users/${id}/reports`, // Get all reports by a user
    GET_ALL_USERS: `${BASE_URL}/users`, // Get all users

    // Admin
    //ban user using /admin/{user_id}/ban
    BAN_USER: (userId) => `${BASE_URL}/admin/${userId}/ban`, // Ban a user
    ANALYSE_REPORT : `${BASE_URL}/crime-reports/analyze`, // Analyse a report
     // /admin/{report_id}/verify
     VERIFY_REPORT: (id) => `${BASE_URL}/admin/${id}/verify`, // Verify a crime report

     ///admin/emergency-contacts/{contact_id}
    UPDATE_CONTACT: (contact_id) => `${BASE_URL}/admin/emergency-contacts/${contact_id}`, // Update a contact
    
    
};

export { BASE_URL, ENDPOINTS };
