import { Conversation, Message } from "../modules/message.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

// Get or create conversation
export const getOrCreateConversation = catchAsync(async (req, res) => {
    const { userId, otherUserId } = req.body;

    if (!userId || !otherUserId) {
        throw new AppError("Both user IDs are required", 400);
    }

    let conversation = await Conversation.findOne({
        participants: {
            $all: [userId, otherUserId]
        }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [userId, otherUserId]
        });
    }

    res.json({
        success: true,
        conversation
    });
});

// Send message
export const sendMessage = catchAsync(async (req, res) => {
    const { conversationId, senderId, receiverId, content, attachments } = req.body;

    if (!content && (!attachments || attachments.length === 0)) {
        throw new AppError("Message content or attachments required", 400);
    }

    const message = await Message.create({
        conversationId,
        senderId,
        receiverId,
        content,
        attachments: attachments || []
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageTime: new Date()
    });

    res.status(201).json({
        success: true,
        message
    });
});

// Get conversation messages
export const getConversationMessages = catchAsync(async (req, res) => {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.find({
        conversationId,
        deletedAt: null
    })
        .populate("senderId", "fullname profilePhoto")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Message.countDocuments({
        conversationId,
        deletedAt: null
    });

    res.json({
        success: true,
        messages: messages.reverse(),
        total,
        pages: Math.ceil(total / limit)
    });
});

// Get user conversations
export const getUserConversations = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const conversations = await Conversation.find({
        participants: userId,
        isActive: true
    })
        .populate("participants", "fullname profilePhoto")
        .populate("lastMessage")
        .sort({ lastMessageTime: -1 });

    res.json({
        success: true,
        conversations
    });
});

// Mark message as read
export const markMessageAsRead = catchAsync(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
        messageId,
        {
            isRead: true,
            readAt: new Date()
        },
        { new: true }
    );

    res.json({
        success: true,
        message
    });
});

// Delete message
export const deleteMessage = catchAsync(async (req, res) => {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, {
        deletedAt: new Date()
    });

    res.json({
        success: true,
        message: "Message deleted"
    });
});
