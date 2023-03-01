const mongoose = require('mongoose') //imports mongoose
const autoIncrement = require('mongoose-sequence')(mongoose) //imports auto-increment

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    title: {
      type: String,
      require: true,
    },
    text: [
      {
        type: String,
        require: true,
      },
    ],
    completed: [
      {
        type: Boolean,
        default: true,
      },
    ],
  },
  {
    timestamps: true, //adds createdAt and updatedAt
  },
)

noteSchema.plugin(autoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500, //starts at 500
}) //adds auto-increment to the noteId field

module.exports = mongoose.model('User', noteSchema) //exports the model
