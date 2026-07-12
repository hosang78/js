const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

const attempts = new Map();

function getKey(req) {
  return req.ip;
}

function checkLoginLimit(req, res, next) {
  const record = attempts.get(getKey(req));
  if (record && record.lockedUntil && record.lockedUntil > Date.now()) {
    const waitSec = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `너무 많이 실패했습니다. ${waitSec}초 후 다시 시도하세요.` });
  }
  next();
}

function recordLoginFailure(req) {
  const key = getKey(req);
  const record = attempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_MS;
    record.count = 0;
  }
  attempts.set(key, record);
}

function recordLoginSuccess(req) {
  attempts.delete(getKey(req));
}

module.exports = { checkLoginLimit, recordLoginFailure, recordLoginSuccess };
