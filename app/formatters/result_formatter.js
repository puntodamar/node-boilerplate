const present = (response,  data = {}) => {
    return response.send({message: "Success", code: response.statusCode, ...data})
}

const error = (response, message = undefined, code = undefined, data = {}) => {
    code = code || 500
    return response.status(code).send({message: message || "Error", code: code, ...data})
}

module.exports = {
    present,
    error
}