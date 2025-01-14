import { registerUser } from "../services/mongo.js";

const usersController = async (req, reply) => {
  const { email } = req.body;
  if (!email) reply.status(201).send("Email is required.");
  try {
    const user = await registerUser(email);
    reply.status(201).send({
      status: 201,
      message: "User succesfully created.",
      data: user,
    });
  } catch ({ status, message }) {
    reply.status(status).send({ status, message });
  }
};

export default usersController;
