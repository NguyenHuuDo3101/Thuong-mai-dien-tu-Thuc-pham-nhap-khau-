import express from 'express'
import {getAllUser, registerUser, login, DeleteUser, updateProfile} from '../controllers/UserController.js'
const UserRouter = express.Router()
import {isAuth, isAdmin} from '../untils/until.js'

UserRouter.post('/register', registerUser)
UserRouter.post('/login', login)

UserRouter.get('/', getAllUser)
UserRouter.delete('/delete/:id', DeleteUser)
UserRouter.put('/profile', isAuth, updateProfile);

export default UserRouter
