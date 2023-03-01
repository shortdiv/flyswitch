import fastify, {
  RouteHandlerMethod,
	RequestGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression
} from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyRequestContextPlugin from '@fastify/request-context'
import fastifySensible from '@fastify/sensible'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid';

import { getMachine } from './services/machineService'
import { generateToken, decodeToken, renewToken } from './services/tokenService'
import { retrieveMachineSession } from './services/sessionService'

dotenv.config()

interface Request extends RequestGenericInterface {
	Querystring: { msg?: string }
}

const server = fastify()

server
  .register(fastifyCookie)
  .register(fastifySensible)
  .register(fastifyRequestContextPlugin, {
    defaultStoreValues: () => ({
      user: { id: 'system' }
    })
  })

  // refresh will regenerate
  server.addHook('onRequest', (req, reply, done) => {
    const { flyRefreshToken } = req.cookies
    if (flyRefreshToken != undefined) {
      const accessToken = renewToken(flyRefreshToken)
      req.requestContext.set('user', accessToken);
    } else {
      const id = uuidv4()
      const { accessToken, refreshToken } = generateToken({id});
      req.requestContext.set('user', accessToken);
      reply.setCookie('flyRefreshToken', refreshToken, {
        // domain: 'your.domain',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: true
      })
    }
    done();
  });

// Handlers
const pingHandler: RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	Request
> = async (req, reply) => {
  const { flyRefreshToken } = req.cookies;
  const accessToken = req.requestContext.get('user');
  // get a machine
  try {
    let decodedToken: any
    decodedToken = await decodeToken(accessToken, flyRefreshToken as string)
    const {id} = decodedToken
    const machineID = await retrieveMachineSession(id as string)
    const machine = await getMachine(machineID)
    reply
      .send({ machine })
  } catch(err) {
    reply
      .internalServerError(err as string)
  }
}

server.get('/', pingHandler)

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
