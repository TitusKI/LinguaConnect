import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user._id;
    const token = await generateStreamToken(userId);
    if (!token) {
      return res.status(500).json({ message: "Could not generate token" });
    }
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
