import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function getMain(app: FastifyInstance) {
    app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        // Aqui você pode retornar uma resposta diretamente ou renderizar uma visualização
        // Neste exemplo, estamos renderizando a visualização 'index.ejs' com o título 'Hello, World!'
        return reply.view('src/http/views/main.ejs');
    })

}

    