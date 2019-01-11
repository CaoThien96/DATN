const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
/* connect to your database here */
autoIncrement.initialize(mongoose.connection);
module.exports = autoIncrement;
