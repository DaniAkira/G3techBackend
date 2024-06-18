const express = require('express');
const router = express.Router();
const { Project } = require('../models/Project');

//Rota para cadastrar novos projetos.
router.post('/', async (req, res) => {
    const {
        name,
        project_manager,
        description,
        start_date,
        end_date,
        tasks,
    } = req.body;

    if (!name || !project_manager || !description || !start_date || !end_date) {
        return res.status(404).json({ error: 'Todos os campos são obrigatórios.' });
    };

    const newProject = {
        name,
        project_manager,
        description,
        start_date,
        end_date,
        tasks,
    };

    try {
        await Project.create(newProject);
        res.status(201).json({ message: 'Projeto criado com sucesso.' });
    } catch (err) {
        console.error('Erro ao criar projeto:', err);
        res.status(500).json({ error: err.message });
    };
});

//Rota para buscar todos os projetos.
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();

        if(!projects) {
            res.status(404).json({ message: 'Não foram encontrados projetos cadastrados.' });    
            return
        };

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error });
    };
});

//Rota para buscar um projeto.
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const project = await Project.findOne({_id: id});

        if(!project) {
            res.status(404).json({ message: 'Projeto não encontrado.' });    
            return
        };

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error });
    };
});

//Rota para atualizar um projeto.
router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    const {
        name,
        project_manager,
        description,
        start_date,
        end_date,
    } = req.body;

    const project = {
        name,
        project_manager,
        description,
        start_date,
        end_date,
    };

    try {
        const updatedProject = await Project.updateOne({_id:id}, project);

        if(updatedProject.matchedCount === 0) {
            res.status(404).json({ message: 'Projeto não encontrado.' });   
            return
        };

        res.status(200).json({ message: 'Projeto alterado com sucesso.', projeto: project });
    } catch (error) {
        res.status(500).json({ message: error });
    };
});

//Rota para deletar um projeto.
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const project = await Project.findOne({_id:id});

    if(!project) {
        res.status(404).json({ message: 'Projeto não encontrado.' });    
        return
    };

    try {
        await Project.deleteOne({_id: id});

        res.status(200).json({ message: 'Projeto deletado com sucesso.' })
    } catch (error) {
        res.status(500).json({ message: error });
    };
});

// Rota para adicionar uma nova tarefa a um projeto existente
router.post('/:projectId/tasks', async (req, res) => {
    const { projectId } = req.params;
    const { task } = req.body;
    const { name, description } = task;
    console.log(name, description);
    if (!name || !description) {
        return res.status(422).json({ error: 'Os campos nome e descrição são obrigatórios.' });
    };

    try {
        const project = await Project.findOne({_id:projectId});

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        };

        const newTask = { name, description };

        project.tasks.push(newTask);

        await project.save();

        res.status(201).json({ message: 'Tarefa adicionada com sucesso.', task: newTask });
    } catch (err) {
        console.error('Erro ao adicionar tarefa:', err);
        res.status(500).json({ error: 'Erro ao adicionar tarefa.' });
    };
});

// Rota para deletar uma tarefa específica de um projeto
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const project = await Project.findOne({_id:projectId});

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        };

        const taskIndex = project.tasks.findIndex(task => task._id.toString() === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        };

        project.tasks.splice(taskIndex, 1);

        await project.save();

        res.status(200).json({ message: 'Tarefa removida com sucesso.' });
    } catch (err) {
        console.error('Erro ao remover tarefa:', err);
        res.status(500).json({ error: 'Erro ao remover tarefa.' });
    };
});

module.exports = router;