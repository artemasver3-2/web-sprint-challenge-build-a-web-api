// Write your "projects" router here!
const express = require('express');
const router = express.Router();

const Projects = require('./projects-model');

const { validateProjectId, validateProject } = require('./projects-middleware');

router.get('/', (req, res, next) => {
  if (!Projects) {
    res.send([]);
  }
  Projects.get()
    .then((projects) => {
      res.json(projects);
    })
    .catch(next);
});

router.get('/:id', validateProjectId, async (req, res, next) => {
  try {
    const projects = await Projects.get(req.params.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const completed = req.body.completed;

  if (!name || !description || !completed) {
    res.status(400).json({
      message: 'Missing required fields.',
    });
  }

  const completedValue = completed === undefined ? false : Boolean(completed);

  try {
    const result = await Projects.insert({
      name: name,
      description: description,
      completed: Boolean(completedValue),
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:id',
  validateProjectId,
  validateProject,
  async (req, res, next) => {
    const id = req.params.id;


      const changes = {
        name: req.body.name,
        description: req.body.description,
        completed: Boolean(req.body.completed)
      };



      console.log(changes)

    try {
      const result = await Projects.update(id, changes);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
  // i lied, this was the worst, honestly. Like, once I understood what I was doing wrong, easy, but until then, literal days of confusion. PUT reqs are something else, you should really explain that to people a little more in depth. Like, a whole thing on just them alone would be awesome cause I really did spend two to three days on this req alone. 

  // probably just I am dumb, but ya know.... food for thought. 
);



   

router.delete('/:id', validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.json(req.project);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/actions', validateProjectId, (req, res, next) => {
  Projects.getProjectActions(req.params.id)
    .then((actions) => {
      res.status(200).json(actions);
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
