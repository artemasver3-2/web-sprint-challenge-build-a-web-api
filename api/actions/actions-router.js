const express = require('express');
const router = express.Router();
const db = require('../../data/dbConfig')
const Actions = require('./actions-model');
const { validateActionId, logger } = require('./actions-middlware');

router.use(logger)

router.get('/', (req, res, next) => {
  if (!Actions) {
    res.send([]);
  }
  Actions.get()
    .then((actions) => {
      res.json(actions);
    })
    .catch(next);
});

router.get('/:id', validateActionId, (req, res, next) => {
  const { id } = req.params.id;
  Actions.get(id)
    .then((action) => {
      res.json(action);
    })
    .catch(next);
});

router.post('/', async (req, res, next) => {
const { description, notes, project_id } = req.body;
  if (!description || !notes || !project_id) {
    return res.status(400).json({
      message: 'Missing required fields: description/notes/project_id',
    });
  }
  try {
    // you suck aaaaaaaaaaaa and by you, i mean, myself, and I 
    const projectExists = await db('projects').where({ id: project_id }).first();
    //i gotta be real, this is like an hour of my life i will never get back 
    if (!projectExists) {
      return res.status(404).json({
        message: 'The provided project_id does not belong to an existing project.',
      });
    }
    const result = await Actions.insert({ description, notes, project_id });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});
// literally the worst time I have had on bd so far 

router.put('/:id', validateActionId, (req, res, next) => {
    const changes = { description: req.body.description, notes: req.body.notes }
    Actions.update(req.params.id, changes)
    .then(() => {
      return Actions.get(req.params.id);
    })
    .then((updatedAction) => {
      res.json(updatedAction);
    })
    .catch(next);
});

router.delete('/:id', validateActionId, async (req, res, next) => {
    try {
        const id = req.params.id
        console.log(id)
        if (!id) {
            return res.status(404).json({
              message: 'Cannot find action by that id!',
            });
          }
        await Actions.remove(req.params.id);
      } catch (err) {
        next(err);
      }
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
