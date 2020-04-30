const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
router.post('/tasks', auth, async(req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch(error => {
    //     res.status(400).send(error)
    // })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//GET /tasks?completed=true

router.get('/tasks', auth, async(req, res) => {
    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks)
    // }).catch(error => {
    //     res.status(500).send(error)
    // })

    //FILTERING DATA
    const match = {}
    const sort = {}
        //to retrive only completed value tasks
    if (req.query.completed) {
        //console.log(req.query.completed)
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    //limit and skip

    try {
        //const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
        // Task.findById(_id).then((task) => {
        //     if (!task)
        //         return res.status(404).send()

    //     res.status(200).send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)

    // })

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) { return res.status(404).send() }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowed = updates.every((update) => allowedUpdates.includes(update))
    if (!isAllowed) {
        return res.status(404).send({ error: "Invalid update" })
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })


        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)

    }
})


router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router