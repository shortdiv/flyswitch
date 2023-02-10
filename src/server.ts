import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
// import env from '@fastify/env'
import * as dotenv from 'dotenv'

dotenv.config()

import { generateToken } from './services/tokenGenerator'
import { getMachine } from './services/machineService'

const options = {
  dotenv: true
}

const server = fastify()

server
  .register(fastifyCookie)
  // .register(env, options)


server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get('/', async (req, reply) => {
  const { flyToken } = req.cookies;
  let token = flyToken
  if (token == undefined) {
    token = generateToken({user: "divid"});
    reply
      .setCookie('flyToken', token, {
        path: '/',
        sameSite: "none",
        secure: true,
        httpOnly: true,
        expires: new Date("2021-01-01")
      })
    console.log("no cookie, setting")
  }
 
  // get a machine
  try {
    const machine = await getMachine("")
    console.log(machine)
  } catch(err) {
    console.log("is there an err", err)
  }


  console.log("cookie set")

  reply
    .send({ hello: 'world' })
})

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
