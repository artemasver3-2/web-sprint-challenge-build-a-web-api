const Projects = require('./projects-model');

async function validateProjectId(req, res, next) {
  try {
    const projects = await Projects.get(req.params.id);
    if (!projects) {
      res.status(404).json({
        message: 'projects not found',
      });
    } else {
    if(projects.id != req.params.id) {
      res.status(404).json({
        message: 'No project matching that id!'
      })
    }
    next()
    }
  } catch (err) {
    res.status(500).json({
      message: 'problem finding projects',
    });
  }
}

// function validateProject(req, res, next) {
//   const { name, description, completed } = req.body;
//   if (!description || !name || !completed) {
//    return res.status(400).json({
//       message: 'missing required fields',
//     });
//   } else {
//     next();
//   }
// }

module.exports = {
  validateProjectId,
  // validateProject,
};
