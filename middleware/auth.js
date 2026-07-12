function requireAuthPage(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

function requireAuthApi(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: '인증이 필요합니다.' });
}

module.exports = { requireAuthPage, requireAuthApi };
