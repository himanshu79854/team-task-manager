const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { deleteTask } = require("../controllers/taskController");
const {
  createTask,
  getTasks,
  updateTask
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/:projectId", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;