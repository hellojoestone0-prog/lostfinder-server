import rateLimit from 'express-rate-limit';

/** Auth endpoints: prevent brute force (login, register) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

/** Location report: prevent spam (max ~2/min per IP, normal is 1 per 3 min) */
export const locationReportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many location reports. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

/** General API: 200 req/min per IP */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
