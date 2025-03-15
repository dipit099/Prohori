const {
    getAllDistrictsAndDivisions
  } = require("../services/districtService");
  
  const getDistrictsAndDivisions = async (req, res, next) => {
    try {
      const districtsAndDivisions = await getAllDistrictsAndDivisions();
      
      return res.status(200).json({
        success: true,
        data: districtsAndDivisions
      });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getDistrictsAndDivisions
  };