require('./db/mongoose')
const express = require('express')
const app = express()
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


//REST API for task-manager

//parse incoming json
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const main = async() => {
//     //relationship between two collections

//     //to get all task details virtually without saving in db
//     const user = await User.findById('5ea304fda9733787413dbf77')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

//     //to get all owner details 
//     const task = await Task.findById('5ea53b4410eda1e2545ba07e')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)
// }

module.exports=app
