const jwt = require('jsonwebtoken')
const {User} = require('../models/user')

const auth = async(request, response, next) => {
    try{
        const authorization = request.header('Authorization')
        if(!authorization) return response.status(401).send({message: "Invalid access", error: "Unauthorized"})
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, 'secretkey')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(user === null) return response.status(401).send({message: "Invalid access", error: "Unauthorized"})
        request.token = token
        request.user = user
        next()
    }
    catch(e) {
        switch(e) {
            case e.err === jwt.JsonWebTokenError:
                response.status(401).send({message: "Invalid access", error: "Unauthorized"})
                break
            default: next(e)
        }
    }
}

module.exports = {
    auth
}