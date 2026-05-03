const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ msg: "All fields required" });
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: [req.user.id],
  });

  res.json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
  }).populate("members", "name email");

  res.json(projects);
};

exports.addMember = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "User ID required" });
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: userId } }, // 🔥 prevents duplicates
    { new: true }
  ).populate("members", "name email");

  res.json(project);
};

exports.removeMember = async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $pull: { members: userId } },
    { new: true }
  ).populate("members", "name email");

  res.json(project);
};