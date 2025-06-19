const Task = require('../../../../../models/task')
const {present} = require("../../../../../formatters/result_formatter");
const httpErrors = require('../../../../../formatters/errors/custom_errors');
const pagination = require('../../../../../formatters/pagination')

module.exports = {
    create: async(request, response) => {
        const task = new Task({
            ...request.body,
            owner: request.user._id
        })

        await task.save()
        response.send(task)
    },
    detail: async(request, response, next) => {
        const task = await Task.findOne({_id: request.params.id, owner: request.user._id})
        if(!task) return next(new httpErrors.NotFoundError('Task not found'))
        present(response, {task})
    },
    update: async(request, response, next) => {
        const task = await Task.findOneAndUpdate({_id: request.params.id}, {$set: request.body})
        if(!task) return next(new httpErrors.NotFoundError('Task not found'))
        present(response, {task})
    },
    user_tasks: async(request, response, next) => {
        const tasks = await Task.paginate(Task.buildFilter(request), pagination.options(request, 'tasks'))
        present(response, tasks)
    }
}