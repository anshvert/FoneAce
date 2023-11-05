import { Router } from "express"
import postController from "../controllers/postController.ts"
import auth from "../middlewares/auth.ts"
import { upload } from "../database/mongoConfig.ts"

const postRouter: Router = Router()

postRouter.get('/get',auth,postController.getPosts)
postRouter.get('/getImage/:imageId',postController.getImage)
postRouter.post('/create', upload.single('file'),auth,postController.createPost)
postRouter.post('/search',auth,postController.searchPosts)
postRouter.delete('/delete',postController.deletePost)

export default postRouter