import { useEffect, useState } from "react";
import axios from "../api/axios";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [memberId, setMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const role = localStorage.getItem("role");
  const selectedProj = projects.find(p => p._id === selectedProject);
  const members = selectedProj?.members || [];
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");


  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  //Create projects
  const createProject = async () => {
    if (!projectName || !projectDesc) return;

    await axios.post("/projects", {
      name: projectName,
      description: projectDesc,
    });

    setProjectName("");
    setProjectDesc("");

    fetchProjects(); // refresh list
  };

  //delete tasks
  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks(selectedProject); // refresh list
  };


  // Fetch projects
  const fetchProjects = async () => {
    const res = await axios.get("/projects");
    setProjects(res.data);
  };

  // Fetch tasks
  const fetchTasks = async (projectId) => {
    const res = await axios.get(`/tasks/${projectId}`);
    setTasks(res.data);
  };

  // Create task
  const createTask = async () => {
    await axios.post("/tasks", {
      title,
      description,
      projectId: selectedProject,
    });

    fetchTasks(selectedProject);
  };

  //add member
  const addMember = async () => {
    if (!selectedUser || !selectedProject) return;

    await axios.post(`/projects/${selectedProject}/add-member`, {
      userId: selectedUser,
    });

    fetchProjects();
  };

  //remove member
  const removeMember = async (id) => {
    await axios.post(`/projects/${selectedProject}/remove-member`, {
      userId: id,
    });

    fetchProjects(); // refresh UI
  };

  // Update task status
  const updateTask = async (id, status) => {
    await axios.put(`/tasks/${id}`, { status });
    fetchTasks(selectedProject);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Team Task Manager 🚀
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Create Project */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Create Project</h2>

          <input
            placeholder="Project Name"
            className="w-full p-2 border rounded mb-3"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <input
            placeholder="Description"
            className="w-full p-2 border rounded mb-3"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
          />

          <button
            onClick={createProject}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Create Project
          </button>
        </div>
      )}

      {/* Select Project */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Project</h2>

        <select
          className="w-full p-2 border rounded"
          value={selectedProject}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedProject(id);
            if (id) fetchTasks(id);
          }}
        >
          <option value="">Select project</option>
          {projects
            .filter((p) => p.name)
            .map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>

      {/* Selected Project Name */}
      {selectedProject && (
        <h2 className="text-xl font-semibold text-blue-600">
          {projects.find((p) => p._id === selectedProject)?.name}
        </h2>
      )}

      {/* Add Member */}
      {role === "admin" && selectedProject && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Add Member</h2>

          <select
            className="w-full p-2 border rounded mb-3"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select user</option>

            {users
              .filter(u => !members.some(m => m._id === u._id))
              .map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
          </select>

          <button
            onClick={addMember}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Add Member
          </button>
        </div>
      )}

      {/* Members List */}
      {role === "admin" && selectedProject && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Project Members</h2>

          {members.length === 0 && <p>No members</p>}

          {members.map((m) => (
            <div
              key={m._id}
              className="flex justify-between items-center p-2 rounded hover:bg-gray-50"
            >
              <span>{m.name} ({m.email})</span>

              <button
                onClick={() => removeMember(m._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Task */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Create Task</h2>

        {!selectedProject && (
          <p className="text-sm text-red-500 mb-2">
            Please select a project first
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="p-2 border rounded"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="p-2 border rounded"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={createTask}
          disabled={!selectedProject}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Add Task
        </button>
      </div>

      {/* Tasks */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>

        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks yet</p>
        )}

        {tasks.map((t) => (
          <div
            key={t._id}
            className="border border-gray-200 p-4 rounded-xl mb-3 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>

              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  t.status === "done"
                    ? "bg-green-200 text-green-800"
                    : t.status === "in-progress"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {t.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateTask(t._id, "todo")}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Todo
              </button>

              <button
                onClick={() => updateTask(t._id, "in-progress")}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                In Progress
              </button>

              <button
                onClick={() => updateTask(t._id, "done")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Done
              </button>
              <button
                onClick={() => deleteTask(t._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);
}

export default Dashboard;