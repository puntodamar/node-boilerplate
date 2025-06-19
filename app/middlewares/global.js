require('colors')

const ErrorMiddleware = (request, response, next) => {
    const status = response.statusCode || 500
    let success = false
    if([200, 201].includes(status)) success = true
    response.on("finish", function() {
        console.log(`\nCompleted`.green)
    });
    if(!success) response.send({code: status, message: response.message})
}

const LoggerMiddleware = async(request,response,next) => {
    console.log(`[${request.method}] ${request.baseUrl}${request.path}`)
    console.log(`[PARAMS] ${JSON.stringify(request.query)}`)
    if(request.body !== {}) console.log(`[BODY] ${JSON.stringify(request.body) }`)
    console.log(`[HEADERS] ${JSON.stringify(request.headers)}\n\n`)
    next(ErrorMiddleware(request, response, next))
}
module.exports = {
    LoggerMiddleware,
}