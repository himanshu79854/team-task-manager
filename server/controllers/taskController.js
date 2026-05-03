const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo
  });

  res.json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId })
    .populate("assignedTo", "name");

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
};