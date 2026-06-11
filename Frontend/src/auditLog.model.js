import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String, // e.g., 'USER_DEACTIVATED', 'USER_DELETED', 'JOB_REMOVED'
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetModel: {
    type: String,
    required: true // 'User' or 'Job'
  },
  details: Object,
  ipAddress: String
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);