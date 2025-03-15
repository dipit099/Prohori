const { District, Division } = require('../models/index');

const getAllDistrictsAndDivisions = async () => {
  try {
    const divisions = await Division.findAll({
      include: [{
        model: District,
        as: 'districts',
        attributes: ['id', 'name']
      }],
      attributes: ['id', 'name']
    });

    const formattedData = divisions.reduce((acc, division) => {
      acc[division.name] = {
        division_id: division.id,
        division_name: division.name,
        districts: division.districts
      };
      return acc;
    }, {});

    return formattedData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllDistrictsAndDivisions
};