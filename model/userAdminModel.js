const mongoose = require('../config/db');

const userAdminSchema = new mongoose.Schema({
    username:
    {
        type: String,
        required: true,
        unique: true,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
        unique: true,
    },
    bio:
    {
        type: String,
        required: false,
    }

})

const adminModel = mongoose.model("adminPanelData", userAdminSchema);

module.exports = adminModel;