module.exports = {
    options: (request, label, populate, sort) => {
        return {
            page: request.query.page || 1,
            limit: request.query.per_page || 10,
            populate,
            sort: sort || '-createdAt',
            customLabels: {
                docs: label,
                totalDocs: 'total',
                limit: 'per_page'
            }
        }
    }
}