// src/pages/Projects.jsx
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import ProjectTimeline from "../components/projects/ProjectTimeline";
import ProjectOverviewDonut from "../components/projects/ProjectOverviewDonut";
import UpcomingDeadlines from "../components/projects/UpcomingDeadlines";
import ProjectActivityFeed from "../components/projects/ProjectActivityFeed";
import ProjectModal from "../components/projects/ProjectModal";

import { mockProjects, mockActivity } from "../data/mockProjects.example";

export default function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const q = searchTerm.toLowerCase();
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
    );
  }, [projects, searchTerm]);

  function handleOpenCreate() {
    setEditingProject(null);
    setIsModalOpen(true);
  }

  function handleProjectMenuClick(project) {
    setEditingProject(project);
    setIsModalOpen(true);
  }

  // Swap this for projectService.create/update once ProjectModal's onSubmit
  // is wired to real API calls — keeping local state update here so the
  // page works before that's connected.
  function handleModalSubmit(data) {
    setProjects((prev) => {
      if (editingProject) {
        return prev.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p));
      }
      return [...prev, { ...data, id: Date.now() }];
    });
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Toolbar: search / filter / new project — page title comes from the shared layout Header, not repeated here */}
      <div className="flex justify-end gap-2">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} />
          Filter
        </button>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Main grid: timeline (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <ProjectTimeline projects={filteredProjects} onProjectMenuClick={handleProjectMenuClick} />
        </div>

        <div className="space-y-6 lg:col-span-1">
          <ProjectOverviewDonut projects={projects} />
          <UpcomingDeadlines projects={projects} />
          <ProjectActivityFeed activities={mockActivity} />
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          project={editingProject}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}