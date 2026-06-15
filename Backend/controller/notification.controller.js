import Notification from '../modules/notification.model.js';
import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';

export const getNotifications = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate('sender', 'fullname profilePhoto');

    res.status(200).json({
        success: true,
        notifications
    });
});

export const markAsRead = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    
    if (!notification) return next(new AppError("Notification not found", 404));

    res.status(200).json({ success: true, message: "Marked as read" });
});

export const clearAllNotifications = catchAsync(async (req, res, next) => {
    const userId = req.id;
    await Notification.deleteMany({ recipient: userId });
    
    res.status(200).json({ success: true, message: "Notifications cleared" });
});