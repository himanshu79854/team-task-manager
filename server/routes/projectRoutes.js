const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { removeMember } = require("../controllers/projectController");
const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

router.post("/", auth, role("admin"), createProject);
router.get("/", auth, getProjects);
router.post("/:id/add-member", auth, role("admin"), addMember);
router.post("/:id/remove-member", auth, role("admin"), removeMember);
router.post("/:id/remove-member", auth, role("admin"), removeMember);
module.exports = router;