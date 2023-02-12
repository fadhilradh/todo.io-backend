const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

const handleError = (res, err) => {
  console.error(err);
  return res.status(400).json({ error: err.message || err.stack });
};

module.exports = {
  sendError,
  handleError,
};
