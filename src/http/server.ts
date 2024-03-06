import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import fastifyWebsocket from '@fastify/websocket'
import { pollResults } from './ws/poll-results'
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import path from 'path';
import { getMain } from './routes/main'
import { fastifyFavicon } from 'fastify-favicon'

const app = fastify()

const root =   path.join(__dirname, 'public')
console.log(root)

app.register(cookie, {
    secret: "password123", 
    hook: 'onRequest',    
})

app.register(fastifyView, {
    engine: {
        ejs: require("ejs"),
      },
      templates: path.join(__dirname, 'views'),  
})

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
  })

app.register(fastifyWebsocket)
app.register(fastifyFavicon, { path: path.join(__dirname, 'public'), name: 'favicon.png', maxAge: 3600 })

app.register(getMain);
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({ port: 3333 }).then((address) => {
console.log(`Server running in ${address}.`)
})
