const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        // to use user details also in task
        ref: 'User'
    }
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task