const mongoose = require('mongoose')
    //connecting to mongodb also providing db name
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})


// const me = new User({
//     name: '    Sanket   ',
//     email: '  SANKET@G.COM  ',
//     password: 'Happy@123'

// })







// task1.save().then(() => {
//     console.log(task1)
// }).catch((error) => {
//     console.log(error)
// })