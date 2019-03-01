const mongoose = require('mongoose');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;
const ConfigurationSchema = new Schema(
  {
    name: {
      type: String,
    },
    value: {
      type: Schema.Types.Mixed,
    },
    type: Number,
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);

module.exports = mongoose.model('Configuration', ConfigurationSchema);
