const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const _id = new mongoose.Types.ObjectId()
const userOne ={
    _id,
    name : "Mike",
    email : "mike@example.com",
    password: "Mike@123",
    tokens:[{
        token : jwt.sign({_id},process.env.JWT_SECRET)
    }]
}

const _id2 = new mongoose.Types.ObjectId()
const userTwo ={
    _id : _id2,
    name : "Sanket",
    email : "sanket@example.com",
    password: "Sanket@123",
    tokens:[{
        token : jwt.sign({_id:_id2},process.env.JWT_SECRET)
    }]
}

const taskOne={
    _id :  new mongoose.Types.ObjectId(),
    description: "First Task",
    completed : false,
    owner : userOne._id
}
const taskTwo={
    _id :  new mongoose.Types.ObjectId(),
    description: "Two Task",
    completed : true,
    owner : userOne._id
}
const taskThree={
    _id :  new mongoose.Types.ObjectId(),
    description: "Third Task",
    completed : false,
    owner : userTwo._id
}

const setupDb= async ()=>{
    await Task.deleteMany()
    await User.deleteMany()
await new User(userOne).save()
await new User(userTwo).save()
await new Task(taskOne).save()
await new Task(taskTwo).save()
await new Task(taskThree).save()


}
module.exports={
    _id,userOne,setupDb,taskOne,userTwo
}