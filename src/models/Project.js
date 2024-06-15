const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definindo Task Schema
const TaskSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
  });

// Definindo Project Schema
const ProjectSchema = new Schema({
    name: { type: String, required: true },
    project_manager: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    tasks: [TaskSchema]
});

// Criando o modelo
const Project = mongoose.model('Project', ProjectSchema);

module.exports = { Project };