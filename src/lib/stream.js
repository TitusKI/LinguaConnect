import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecretKey = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecretKey) {
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET_KEY are required");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecretKey);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
  } catch (error) {
    console.log(`   Error in upsertStreamUser: ${error.message}`);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const token = streamClient.createToken(userId);
    return token;
  } catch (error) {
    console.log(`   Error in generateStreamToken: ${error.message}`);
  }
};
