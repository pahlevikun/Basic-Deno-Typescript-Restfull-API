// @ts-ignore
import { Application } from 'https://deno.land/x/oak/mod.ts'
// @ts-ignore
import router from './routes.ts'
// @ts-ignore
const port =  Deno.env.get("PORT") || 5000
const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Listening on port ${port}`)
// @ts-ignore
await app.listen({ port : +port})