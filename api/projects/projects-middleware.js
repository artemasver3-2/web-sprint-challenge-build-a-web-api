// add middlewares here related to projects
const Projects = require('./projects-model0')

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


  
module.exports = {
    validateProjectId,
  }