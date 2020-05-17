const {userOne,_id,setupDb} = require('./db')
const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')

//runs before each test suites
beforeEach(setupDb)

const userTwo ={
    name : "DJ",
    email : "DJ@example.com",
    password: "DJ@123"
}


test('Should signup a user',async ()=>{
    const response = await request(app).post('/users').send({
        name : "Sanket",
        email :"sanketfarande210@gmail.com",
        password : "Happy@123"
    }).expect(201)

    //assert that the database has changed correctly

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertion about response 

    expect(response.body).toMatchObject({
        user :{
        name : "Sanket",
        email :"sanketfarande210@gmail.com"
    },
    token :user.tokens[0].token
    })

    expect(user.password).not.toBe("Happy@123")
})

test('Should login a user',async ()=>{
    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findById({_id : response.body.user._id})
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexisting user',async()=>{
    await request(app).post('/users/login').send({
email : userTwo.email,
password:userTwo.password
    }).expect(400)
})

test('Should get profile for authorized user',async ()=>{
await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for nonauthorized user',async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
    })

test('Should delete account for authorized user',async ()=>{
   await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user =await User.findById({_id :userOne._id})
    expect(user).toBeNull()
})
  

test('Should not delete account for nonauthorized user',async ()=>{
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('Should upload an user avatar',async ()=>{
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar','./tests/fixtures/profile-pic.jpg')
            .expect(200)

    // for objects toBe() doesnt  work as similar objects have different memory address
    //expect({}).toBe({}) is false
    // expect({}).toEqual({}) is true
    const user = await User.findById({_id :userOne._id})
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user name',async ()=>{
    await request(app)
            .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name : "SanketVF"
        })
        .expect(200)
        const user = await User.findById({_id :userOne._id})
        expect(user.name).toEqual("SanketVF")
            
})

test('Should not update invalid fields',async ()=>{
     await request(app)
            .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : "Pimpri"
        })
        .expect(404)
      
            
})