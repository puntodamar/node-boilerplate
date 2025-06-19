const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose')
const {BadRequestError, NotFoundError, UnprocessableError} = require('../formatters/errors/custom_errors');

const taskSchema = new mongoose.Schema({
    owner: {
        ref: 'User',
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// taskSchema.pre('init', function(){
//     console.log("\n");
// })

taskSchema.plugin(mongoosePaginate)

taskSchema.statics.buildFilter = (request) => {
    const filter = {}
    if (request.query.completed !== undefined) filter.completed = request.query.completed
    if(request.user._id) filter.owner = request.user._id
    if(request.query.start_date) filter.createdAt = {
        $gte: request.query.start_date,
        $lte: request.query.end_date
    }

    return filter
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
