import axios from "axios";

const webRTC = async (fastify) => {
  fastify.get("/webrtc", async (req, res) => {
    const params = {
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1",
      },
      data: {
        model: "gpt-4o-realtime-preview-2024-12-17",
        modalities: ["text"],
        instructions: "You are a friendly assistant.",
      },
    };
    const { data } = await axios.post(
      "https://api.openai.com/v1/realtime/sessions",
      params
    );
    console.log(data);
  });
};

export default webRTC;

// {
//       headers: {
//         Authorization: "Bearer " + process.env.OPENAI_API_KEY,
//         "OpenAI-Beta": "realtime=v1",
//       },
//     }
