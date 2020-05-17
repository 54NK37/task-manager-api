const app = require('./app')
const port = process.env.PORT
//main()
app.listen(port, () => {
    console.log("Server is up on " + port)
})