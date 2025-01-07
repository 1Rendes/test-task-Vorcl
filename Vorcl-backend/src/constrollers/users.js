export const usersController = async (req, reply) => {
  const { email } = req.body;
  if (!email) reply.status(201).send("email is required");

  try {
    const user = await registerUser(email);
  } catch (error) {}
};
