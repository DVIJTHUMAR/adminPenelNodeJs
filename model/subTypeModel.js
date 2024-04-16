const mongoose = require('../config/db');

const subTypeSchema = new mongoose.Schema({
    subCategoryName:
    {
        type: String,
        required: true,
        unique: true,
    },

})

const subTypeModel = mongoose.model("subTypeCategoryData", subTypeSchema);

module.exports = subTypeModel;