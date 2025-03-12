import { useState } from "react";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = {
    overview: {
      title: "Project Overview",
      content: (
        <div>
          <p className="mb-4">
            LMS (Learning Management System) is a comprehensive platform designed to facilitate online learning and course management. It provides a robust environment for both educators and students to interact, share resources, and manage educational content effectively.
          </p>
          <h3 className="text-xl font-semibold mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Course creation and management</li>
            <li>Student enrollment and progress tracking</li>
            <li>Assignment submission and grading</li>
            <li>Interactive content sharing</li>
            <li>Real-time announcements</li>
            <li>User role management</li>
          </ul>
        </div>
      ),
    },
    teacher: {
      title: "Teacher's Guide",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-2">Course Management</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Create and customize course sites</li>
            <li>Manage course content and materials</li>
            <li>Create and grade assignments</li>
            <li>Monitor student progress</li>
            <li>Make announcements</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Best Practices</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Regularly update course content</li>
            <li>Provide clear instructions for assignments</li>
            <li>Maintain consistent communication with students</li>
            <li>Use a variety of content types</li>
          </ul>
        </div>
      ),
    },
    student: {
      title: "Student's Guide",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Join courses using enrollment codes</li>
            <li>Access course materials and resources</li>
            <li>Submit assignments and view grades</li>
            <li>Participate in discussions</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Tips for Success</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Regularly check for announcements</li>
            <li>Submit assignments before deadlines</li>
            <li>Engage actively in course activities</li>
            <li>Reach out for help when needed</li>
          </ul>
        </div>
      ),
    },
    technical: {
      title: "Technical Documentation",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-2">System Requirements</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Modern web browser (Chrome, Firefox, Safari)</li>
            <li>Stable internet connection</li>
            <li>JavaScript enabled</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Technology Stack</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Frontend: React.js with Tailwind CSS</li>
            <li>Backend: Node.js with Express</li>
            <li>Database: MongoDB</li>
            <li>Authentication: Firebase</li>
          </ul>
        </div>
      ),
    },
    support: {
      title: "Support & Troubleshooting",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-2">Common Issues</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Login problems</li>
            <li>Course access issues</li>
            <li>Assignment submission errors</li>
            <li>Content loading problems</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Getting Help</h3>
          <p className="mb-2">
            For technical support or assistance, please contact our support team:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Email: support@lms-moodle.com</li>
            <li>Support Hours: Monday-Friday, 9 AM - 5 PM</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Documentation</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <nav className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <ul className="space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === key ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Content Area */}
        <main className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">{sections[activeSection].title}</h2>
            {sections[activeSection].content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;