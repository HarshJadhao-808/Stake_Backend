import express from 'express'
import { GetUsers } from '../Controller/Admincontroller.js'
import protect from '../middleware/Authmiddleware.js'
import { rolecheck } from '../middleware/rolecheck.js'

const adminRouter = express.Router()

adminRouter.get("/getusers",protect,rolecheck("admin"),GetUsers)

export default adminRouter

