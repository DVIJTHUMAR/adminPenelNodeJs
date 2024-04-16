const mongoose = require('../config/db');

const typeSchema = new mongoose.Schema({
    categoryName:
    {
        type: String,
        required: true,
        unique: true,
    },

})

const typeModel = mongoose.model("typeCategoryData", typeSchema);

module.exports = typeModel;