import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function getMain(app: FastifyInstance) {
    app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.view('main.ejs',  { poll: { title: "Crie sua enquete" } });
    })

}

    
