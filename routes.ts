// @ts-ignore
import { Router } from 'https://deno.land/x/oak/mod.ts'
// @ts-ignore
import { getUsers, getUser, addUser, updateUser, deleteUser } from './controllers/user_controller.ts'

const router = new Router({
  prefix: "/api/v1"
})

router
  .get('/users', getUsers)
  .get('/user/:id', getUser)
  .post('/user', addUser)
  .put('/user/:id', updateUser)
  .delete('/user/:id', deleteUser)

export default router