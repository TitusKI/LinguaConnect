import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId, $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json({ success: true, users: recommendedUsers });
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName nativeLanguge learningLanguage profilePic"
      );
    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.log("Error in getMyFriends controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipentId } = req.params;
    // Don't send friend request to yourself
    if (myId === recipentId) {
      return res
        .status(400)
        .json({ message: "You cannot send friend request to yourself" });
    }

    // check if friendId is valid
    const recipent = await User.findById(recipentId);
    if (!recipent) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are already friends
    if (recipent.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if a friend request has already been sent
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipent: recipentId },
        { sender: recipentId, recipent: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipent: recipentId,
    });
    return res.status(201).json({ success: true, friendRequest });
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: requestId } = req.params;

    // find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.recipent.toString() !== myId) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    // send the req.body as accepted status

    friendRequest.status = "accepted";
    await friendRequest.save();
    const senderId = friendRequest.sender;
    const recipentId = friendRequest.recipent;
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: recipentId },
    });
    await User.findByIdAndUpdate(recipentId, {
      $addToSet: { friends: senderId },
    });

    res.status(200).json({ success: true, friendRequest });

    // add each other to friends list
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getFriendRequests(req, res) {
  try {
    const myId = req.user.id;
    const incomingRequests = await FriendRequest.find({
      recipent: myId,
      status: "pending",
    }).populate("sender", "fullName nativeLanguge learningLanguage profilePic");
    const acceptedRequests = await FriendRequest.find({
      sender: myId,
      status: "accepted",
    }).populate("recipent", "fullName profilePic");
    res.status(200).json({ success: true, incomingRequests, acceptedRequests });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getOutgoingFriendReqs(req, res) {
  try {
    const myId = req.user.id;
    const outgoingRequests = await FriendRequest.find({
      sender: myId,
      status: "pending",
    }).populate(
      "recipent",
      "fullName nativeLanguge learningLanguage profilePic"
    );
    res.status(200).json({ success: true, outgoingRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
