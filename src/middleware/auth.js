const User = require('../models/user')
const jwt = require('jsonwebtoken')

//without middleware new request => run routes
//with middleware new request => do something => run routes

//to allow router only after it has valid and unexpired token
const auth = async(req, res, next) => {

    try {
        //replace header
        const token = req.header('Authorization').replace('Bearer ', '')

        //verify token with the same key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //_id was used while generating token , hence extract _id which is 2nd parameter in token
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })
            //console.log(user)


        if (!user) {
            throw new Error()
        }

        //assign to req as then it can be accessed by routes
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth