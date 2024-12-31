export async function root(fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });
}
