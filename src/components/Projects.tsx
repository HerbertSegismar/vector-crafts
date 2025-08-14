import { motion } from "motion/react";
import { FiGithub, FiExternalLink } from "react-icons/fi";

const projects = [
  {
    title: "Vector Editor",
    description:
      "A responsive vector graphics editor with real-time collaboration features. Built with React and Fabric.js.",
    tags: ["React", "TypeScript", "Fabric.js", "WebSockets"],
    github: "https://github.com/username/vector-editor",
    demo: "https://vector-editor-demo.com",
    image: "/vector-editor-preview.jpg",
  },
  {
    title: "E-commerce Dashboard",
    description:
      "Analytics dashboard for e-commerce stores with sales tracking, customer insights, and inventory management.",
    tags: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    github: "https://github.com/username/ecom-dashboard",
    demo: "https://ecom-dashboard-demo.com",
    image: "/ecom-dashboard-preview.jpg",
  },
  {
    title: "AI Image Generator",
    description:
      "Web application that generates images from text prompts using Stable Diffusion API.",
    tags: ["React", "Python", "Stable Diffusion", "Flask"],
    github: "https://github.com/username/ai-image-generator",
    demo: "https://ai-image-generator-demo.com",
    image: "/ai-image-preview.jpg",
  },
  {
    title: "Task Management App",
    description:
      "Collaborative task management application with drag-and-drop functionality and team features.",
    tags: ["React", "Firebase", "DnD Kit", "Tailwind CSS"],
    github: "https://github.com/username/task-manager",
    demo: "https://task-manager-demo.com",
    image: "/task-manager-preview.jpg",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            My Projects
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Here are some of my recent projects. Each one was built to solve
            specific problems and showcase different technical skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-700 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <FiGithub className="mr-2" /> Code
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <FiExternalLink className="mr-2" /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">Want to see more of my work?</p>
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors"
          >
            <FiGithub className="mr-2" /> View All on GitHub
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
