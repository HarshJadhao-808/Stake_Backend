import express from 'express'
import { getData, Login, rewardClaim, Signup, StakeHC, UpdateState, Withdraw } from '../Controller/Usercontroller.js'
import protect from '../middleware/Authmiddleware.js'

const userRouter = express.Router()

userRouter.post("/signup",Signup)

userRouter.post("/login",Login)

userRouter.post("/stake/:id",protect,StakeHC)

userRouter.put("/claim/:id",protect,rewardClaim)

userRouter.put("/withdraw/:id",protect,Withdraw)

userRouter.get("/getData/:id",protect,getData)

userRouter.get("/statusUpdate/:id",protect,UpdateState)

export default userRouter