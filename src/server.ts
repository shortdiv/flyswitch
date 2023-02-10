import fastify from 'fastify'
import cookie from '@fastify/cookie'

const server = fastify()

server.register(cookie, {
  secret: "my-secret",
  hook: 'onRequest',
  parseOptions: {}
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get('/', async (req, reply) => {
  reply
    .cookie('bar', 'baz')
    .setCookie('fly', 'bar', {
      path: '/',
      signed: true,
      expires: new Date("2021-01-22")
    })
    .send({ hello: 'world' })
})

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
