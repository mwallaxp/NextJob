import Notification from '../modules/notification.model.js';
import catchAsync from '../catchAsync.js';

/**
 * Get all notifications for the logged-in user, with pagination.
 */
export const getNotifications = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { recipient: req.id };

    const notifications = await Notification.find(query)
        .populate('sender', 'fullname profile.avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        notifications,
        total,
        pages: Math.ceil(total / limit),
    });
});

/**
 * Mark notifications as read.
 */
export const markNotificationsAsRead = catchAsync(async (req, res, next) => {
    // Mark all notifications for the user as read
    await Notification.updateMany(
        { recipient: req.id, isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
    });
});

/**
 * Clear all notifications for the logged-in user.
 */
export const clearNotifications = catchAsync(async (req, res, next) => {
    await Notification.deleteMany({ recipient: req.id });

    res.status(200).json({
        success: true,
        message: 'All notifications cleared.',
    });
});
