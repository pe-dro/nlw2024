import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'
import { z } from 'zod'
import axios from 'axios'

export async function getPoll(app: FastifyInstance) {
    app.get('/polls/:pollId', async (request, reply) => {
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })
     
        const { pollId } = getPollParams.parse(request.params)
    
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId,
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true 
                    }
                }
            }
        })
    
        if(!poll){
            return reply.status(400).send({ message: 'Enquete não encontrada.' })

        }

        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES' )

        const votes = result.reduce((object, line, index) =>{
            if(index % 2 === 0) {
                const score = result[index + 1]

                Object.assign(object, { [line]: Number(score) })
            }

            return object
        }, {} as Record<string, number>)
        
        return reply.send({ 
            poll: {
                id: poll.id,
                title: poll.title,
                options: poll.options.map(option => {
                    return {
                        id: option.id,
                        title: option.title,
                        score: (option.id in votes) ? votes[option.id] : 0,
                    }
                }) 
            }
         })
    })  

    app.get('/id/:pollId', async (request, reply) => {
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })
        const { pollId } = getPollParams.parse(request.params)

        try {
            // Fazendo solicitação à rota que retorna o JSON
            const response = await axios.get(`${process.env.API_URL}/${pollId}`);
            const poll = response.data.poll;

            // Renderizando a visualização com os dados da pesquisa
            return reply.view("src/http/views/vote-on-poll.ejs", { poll });
        } catch (error) {
            console.error('Erro ao obter dados da pesquisa:', error);
            return reply.status(500).send('Erro ao obter dados da pesquisa');
        }

    })
}