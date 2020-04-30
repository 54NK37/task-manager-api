// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID =mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

// connect to url which async hence has callback
MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {

    if (error) {
        return console.log('Unable to connect to mongodb')
    }

    console.log("Connected successfully!")

    //create and connect to db
    const db = client.db(databaseName)

    //it also  has callback 
    // db.collection('users').insertOne({
    //     name: 'sanketvf',
    //     age: '21'
    // }, (error, result) => {

    //     if (error) {
    //         return console.log('unable to insert the doc')
    //     }
    //     console.log(result.ops)
    // })


    //insert many
    // db.collection('tasks').insertMany([{
    //         task: "Study",
    //         completed: false
    //     },
    //     {

    //         task: "Sleep",
    //         completed: true
    //     }, {
    //         task: "Games",
    //         completed: true
    //     }

    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert these docs')

    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').find({}).toArray((error, user) => {
    //     console.log(user)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     console.log(tasks)

    // })


    //promise
    // db.collection('users').updateOne({ _id: new ObjectID('5e99a7aeea35ed0954872a37') }, {
    //     $set: {
    //         name: "sanketvf"
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)

    // })

    db.collection('tasks').updateMany({ completed: false }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    })
})