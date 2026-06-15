import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['APPLICATION_STATUS', 'JOB_MATCH', 'PROFILE_VIEW', 'MESSAGE'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String, // e.g., /description/:jobId
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;