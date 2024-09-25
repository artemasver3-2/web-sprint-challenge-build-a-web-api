const Actions = require('./actions-model');

async function validateActionId(req, res, next) {
  try {
    const actions = await Actions.get(req.params.id);
    if (!actions) {
      res.status(404).json({
        message: 'actions not found',
      });
    } else {
      req.actions = actions;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: 'problem finding actions',
    });
  }
}

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}: ${method} to ${url}]`);
  next();
}

// this was cheating a tiny bit, I know, oh well. 

module.exports = {
  validateActionId,
  logger,
};
