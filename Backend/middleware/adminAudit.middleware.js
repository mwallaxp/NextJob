import AuditLog from '../modules/auditLog.model.js';
import catchAsync from '../catchAsync.js';

/**
 * Middleware to log all requests made by an admin to admin-protected routes.
 */
const adminRequestLogger = catchAsync(async (req, res, next) => {
  if (req.role !== 'admin' || !req.id) {
    return next();
  }

  // Avoid logging requests that just fetch audit logs to prevent noise.
  if (req.originalUrl.startsWith('/api/v1/admin/audit-logs')) {
    return next();
  }

  const details = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  // Redact sensitive information before logging.
  if (details.body?.password) details.body.password = '[REDACTED]';

  await AuditLog.create({
    adminId: req.id,
    action: `${req.method} ${req.originalUrl}`,
    details,
    ipAddress: req.ip,
  });

  next();
});

export default adminRequestLogger;
