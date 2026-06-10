import express from "express";
import {
    getOrCreateConversation,
    sendMessage,
    getConversationMessages,
    getUserConversations,
    markMessageAsRead,
    deleteMessage
} from "../controller/message.controller.js";

const router = express.Router();

// Conversation routes
router.post("/conversation/create", getOrCreateConversation);
router.get("/conversations/:userId", getUserConversations);

// Message routes
router.post("/send", sendMessage);
router.get("/:conversationId/messages", getConversationMessages);
router.put("/:messageId/read", markMessageAsRead);
router.delete("/:messageId", deleteMessage);

export default router;
