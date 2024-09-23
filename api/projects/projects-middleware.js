const Projects = require('./projects-model')

async function validateProjectId(req, res, next) {
    try {
      const projects = await Projects.get(req.params.id)
      if (!projects) {
        res.status(404).json({
          message: "projects not found",
        })
      } else {
        req.projects = projects 
        next()
      }
    } catch (err) {
      res.status(500).json({
        message: "problem finding projects",
      })
    }
  }


function validateProject(req, res, next) {
    const { description } = req.body 
    if (!description || !description.trim()) {
      res.status(400).json({
        message: "missing required description field",
      })
    } else {
      req.description = description.trim()
      next()
    }
  }

  
module.exports = {
    validateProjectId,
    validateProject
  }