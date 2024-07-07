const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()

    if (!users) {
        return res.status(400).json({ message: "No users found" })
    }

    res.json(users)
})

//@desc Create new user
//@route POST /users
//@access Private
const createUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    const hashedPw = await bcrypt.hash(password, 10)
    const userObj = { username, "password": hashedPw }
    const user = await User.create(userObj)

    if (user) {
        res.status(201).json({ message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: "Invalid user data received" })
    }
})

//@desc Update a user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
    //to be created
})

//@desc Delete a user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "User ID required" })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const result = await user.deleteOne()
    const reply = `User ${username} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}

