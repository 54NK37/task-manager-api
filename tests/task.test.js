const {userOne,_id,setupDb,taskOne,userTwo} = require('./db')
const request =require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')

//runs before each test cases
beforeEach(setupDb)

test('Should create task of user',async ()=>{
const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description : "From my test"
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task.completed).toEqual(false)
})

test('Should get user tasks',async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toBe(2) 
})

test('Should not delete other user tasks',async ()=>{
    const response = request(app)
                        .delete(`/tasks/${taskOne._id}`)
                        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                        .send()
                        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})