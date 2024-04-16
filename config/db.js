const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/paneldata').then(() => {
    console.log("DB conected.......");
}).catch(() => {
    console.log("Error 404 ! Server is not conected...");
})

module.exports = mongoose;