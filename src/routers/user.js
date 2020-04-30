const User = require('../models/user')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { sendWelcomeEmail, goodByeEmail } = require('../emails/account')

// to upload files
const multer = require('multer')

// to resize/crop image
const sharp = require('sharp')

//middlewware
//use multer to uplaod files 
const upload = multer({
    //folder name
    // if this is mentioned we cannot access req.file in next callback func
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return (cb(new Error('File must be jpg,jpeg or png')))
        }

        cb(undefined, true)
    }
})

//user creating endpoint
//recieve post from postman client
//sign up no middleware
router.post('/users', async(req, res) => {
    const user = new User(req.body)
        //     //saving to db
        // user.save().then(() => {
        //     res.status(201).send(user)
        // }).catch((error) => {
        //     //we get this error at client side
        //     res.status(400).send(error)
        // })

    try {
        // await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})


//login no middleware
router.post('/users/login', async(req, res) => {
    try {
        //includind findByC... method in models for general model
        const user = await User.findByCredentials(req.body.email, req.body.password)

        //including gener... for an instance
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//logout
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//logout all tokens
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

//get from server
router.get('/users/me', auth, async(req, res) => {
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((error) => {
    //     //error at server side
    //     res.status(500).send(error)
    // })


    // try {
    //     // const users = await User.find({})
    //     res.status(200).send(users)
    // } catch (e) {
    //     res.status(500).send(e)
    // }

    res.status(200).send(req.user)

})

// router.get('/users/:id', async(req, res) => {
//     const _id = req.params.id
//         // User.findById(_id).then((user) => {
//         //     if (!user) {
//         //         return res.status(404).send()
//         //     }
//         //     res.status(200).send(user)
//         // }).catch((error) => {
//         //     res.status(500).send(error)
//         // })

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })


router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]

    const isAllowed = updates.every((update) => allowedUpdates.includes(update))

    if (!isAllowed) {
        return res.status(404).send({ error: "Invalid Updates" })
    }

    try {
        //asign updated value to user and also check for validators
        //not works for middleware
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })


        //for middleware
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()


        res.status(200).send(req.user)
    } catch (e) {
        console.log(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        goodByeEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }

})



//single has key name provided by client
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    //error handler function
    // all callback parametres are must
    //to catch errors from middleware multer
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id/avatar', async(req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error
        }
        //set sets header with key and value
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router