const express = require('express');
const router = express.Router();

const Actions = require('./actions-model');

// const {

//  } = require('./actions-middlware')

router.get('/', (req, res, next) => {
  if (!Actions) {
    res.send([]);
  }
  Actions.get()
    .then((actions) => {
      res.json(actions);
      console.log(actions);
    })
    .catch(next);
});

router.use((err, req, res, next) => {
  //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'womp x2',
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
