// @ts-ignore
import { Client } from 'https://deno.land/x/mysql/mod.ts'
// @ts-ignore
import { database } from '../config.ts'
// @ts-ignore
const client = await new Client().connect({
  hostname: database.hostname,
  username: database.user,
  db: database.name,
  poolSize: database.poolsize,
  password: database.password,
})

// @desc  Get all user
// @route GET /users
const getUsers = async ({ response }: { response: any }) => {
  try {
    const result = await client.execute("SELECT * FROM users")
    response.body = {
      success: true,
      message: "Succeed get all data",
      data: result.rows,
    }
  } catch (error) {
    response.status = 422
    response.body = {
      success: false,
      message: "Unprocessable " + error.toString(),
      data: null
    }
  }
}

// @desc  Get single user
// @route GET /user/:id
const getUser = async ({ params, response }: { params: { id: string }, response: any }) => {
  try {
    const result = await client.execute("SELECT * FROM users WHERE ?? = ?", ["id", params.id])
    response.body = {
      success: true,
      data: result.rows,
      message: "Succeed get data"
    }
  } catch (error) {
    response.status = 422
    response.body = {
      success: false,
      message: "Unprocessable " + error.toString(),
      data: null
    }
  }
}

// @desc  Add single user
// @route POST /user
const addUser = async ({ request, response }: { request: any, response: any }) => {
  const body = await request.body()
  const data = body.value

  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      message: 'No data',
      data: null
    }
  } else {
    try {
      await client.execute("INSERT INTO users(name) VALUES(?)", [
        data.name])
      const inserted = await client.execute("SELECT * FROM users ORDER BY id DESC LIMIT 1")
      response.status = 200
      response.body = {
        success: true,
        message: "Succeed insert data",
        data: inserted.rows
      }
    } catch (error) {
      response.status = 422
      response.body = {
        success: false,
        message: "Unprocessable " + error.toString(),
        data: null
      }
    }
  }
}

// @desc  Update single user
// @route PUT /user/:id
const updateUser = async({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
  await getUser({ params: { "id": params.id }, response })

  if (response.status === 404) {
    response.status = 404
    response.body = {
      success: false,
      message: response.body.msg,
      data: false
    }
    return
  } else {
    const body = await request.body()
    const data = body.value

    if (!request.hasBody) {
      response.status = 400
      response.body = {
        success: false,
        message: 'No data',
        data: null
      }
    } else {
      try {
        await client.execute("UPDATE users SET ??=? WHERE ??=?",
          ["name", data.name, "id", params.id])
        const updated = await client.execute("SELECT * FROM users WHERE ?? = ?", ["id", params.id])

        response.status = 200
        response.body = {
          success: true,
          data: updated.rows,
          message: "Succeed update data"
        }
      } catch (error) {
        response.status = 422
        response.body = {
          success: false,
          message: "Unprocessable " + error.toString(),
          data: null
        }
      }
    }
  }
}


// @desc  Delete users
// @route DELETE /user/:id
const deleteUser = async ({ params, response }: { params: { id: string }, response: any }) => {
  await getUser({ params: { "id": params.id }, response })

  if (response.status === 404) {
    response.status = 404
    response.body = {
      success: false,
      message: response.body.msg,
      data: false
    }
    return
  } else {
    try {
      await client.query("DELETE FROM users WHERE ??=?", ["id", params.id])

      response.status = 200
      response.body = {
        success: true,
        data: null,
        message: `Users with id ${params.id} has been deleted`
      }
    } catch (error) {
      response.status = 422
      response.body = {
        success: false,
        message: "Unprocessable " + error.toString(),
        data: null
      }
    }
  }
}

export { getUsers, getUser, addUser, updateUser, deleteUser }