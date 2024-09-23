// Write your "projects" router here!
const express = require('express');
const router = express.Router();

const Projects = require('./projects-model');

const { 
    validateProjectId,
    validateProject,
 } = require('./projects-middleware')
router.get('/', (req, res, next) => {
  Projects.get()
    .then((projects) => {
      res.json(projects);
      console.log(projects);
    })
    .catch(next);
});

router.get('/:id', validateProjectId, (req, res, next) => {
  const { id } = req.params.id;
  Projects.get(id)
    .then((project) => {
      res.json(project);
    })
    .catch(next)
});

router.post('/', async (req, res, next) => {
  const project = {
    name: req.body.name,
    description: req.body.description,
  };
  if (!project.name || !project.description) {
    res.status(400).json({
      message: 'Missing required fields.',
    });
  }
  try {
    const result = await Projects.insert(project);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
    const changes = { name: req.body.name, description: req.body.description }
    Projects.update(req.params.id, changes)
    .then(() => {
      return Projects.get(req.params.id);
    })
    .then((updatedProject) => {
      res.json(updatedProject);
    })
    .catch(next);
});

router.delete('/', (req, res, next) => {});
router.get('/', (req, res, next) => {});

router.use((err, req, res, next) => {
  //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'womp x2',
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
