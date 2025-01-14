import usersController from "../constrollers/users.js";
import userSchema from "../validation/users.js";

const form = async (fastify) => {
  fastify.post("/register", {
    schema: { body: userSchema },
    handler: usersController,
  });
};

export default form;
