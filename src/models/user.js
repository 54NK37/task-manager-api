const mongoose = require('mongoose')

//string sanitization
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//defining structure of model
//validation

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot be password    ')

            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            required: true,
            type: String
        }
    }]
}, {
    timestamps: true
})

//not storing in database ,it is for reference of mongoose
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//methods used for an instance
userSchema.methods.generateAuthToken = async function() {
    const user = this
        //generate token for specific user so private routes are accessible only to that user via thia token
        //2nd parameter is secret key based on which token is generated
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//tojson is called for every JSON.tostringify()
//JSON.tostringify() is called vin backend for res.send()
userSchema.methods.toJSON = function() {
        const user = this
        const userObject = user.toObject()

        delete userObject.password
        delete userObject.tokens
        delete userObject.avatar
        return userObject
    }
    //statics used for model
userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}



//setting up middleware which can be called pre or post of event
//pre for save event
//func becoz we want to use this

userSchema.pre('save', async function(next) {
    const user = this

    //it is true if user has created for 1st time or updating
    if (user.isModified('password')) {
        //8 rounds for hashing is optimum for security and speed
        user.password = await bcrypt.hash(user.password, 8)
    }
    //we are done with pre operations of save,and time to proceed
    next()
})


userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User