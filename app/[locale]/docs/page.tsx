'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const DocumentationPage = () => {
  const params = useParams();
  const locale = params.locale as string;

  const sections = [
    'Overview',
    'Tech Stack',
    'Getting Started',
    'Components',
    'Styling',
    'Routing',
    'Deployment'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#00E599]">Project Documentation</h1>
        
        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <nav>
            <ul className="space-y-2">
              {sections.map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${locale}/docs#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-[#00E599] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            This is a modern web application built with Next.js 13+, featuring a responsive design 
            with a dark theme. The application uses various modern technologies and best practices 
            to ensure maintainability and scalability.
          </p>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Framework', value: 'Next.js 13+ (App Router)' },
              { name: 'Language', value: 'TypeScript' },
              { name: 'Styling', value: 'Tailwind CSS' },
              { name: 'Animation', value: 'Framer Motion' },
              { name: 'Icons', value: 'React Icons' },
              { name: 'State Management', value: 'Zustand' },
            ].map((tech) => (
              <div key={tech.name} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-medium text-[#00E599]">{tech.name}</h3>
                <p className="text-gray-300">{tech.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="font-medium text-[#00E599] mb-2">Installation</h3>
              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  git clone https://github.com/your-repo-url.git{'\n'}
                  cd your-repo-name{'\n'}
                  npm install{'\n'}
                  npm run dev
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section id="components" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Components</h2>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="font-medium text-[#00E599] mb-2">NavigationBar</h3>
            <p className="text-gray-300 mb-4">
              A responsive bottom navigation component with smooth animations and accessibility features.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Responsive design across all devices</li>
              <li>Dark theme support</li>
              <li>Framer Motion animations</li>
              <li>Accessibility compliant</li>
            </ul>
          </div>
        </section>

        {/* Styling Section */}
        <section id="styling" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Styling</h2>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              The application uses Tailwind CSS for styling, providing:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Utility-first CSS framework</li>
              <li>Dark theme configuration</li>
              <li>Responsive design utilities</li>
              <li>Custom color scheme</li>
            </ul>
          </div>
        </section>

        {/* Routing Section */}
        <section id="routing" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Routing</h2>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              Next.js uses a file-based routing system. Each file in the `app` directory corresponds to a route in the application.
            </p>
            <p className="text-gray-300 mb-4">
              For dynamic routes, you can use square brackets in the file name. For example, the file structure:
            </p>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code className="text-sm">
                /app{'\n'}
                ├── /[locale]{'\n'}
                │   ├── /docs{'\n'}
                │   │   └── page.tsx{'\n'}
                │   ├── /login{'\n'}
                │   │   └── page.tsx{'\n'}
                │   ├── /signup{'\n'}
                │   │   └── page.tsx{'\n'}
                │   └── /other-routes{'\n'}
                └── /index.tsx
              </code>
            </pre>
            <p className="text-gray-300">
              This structure allows you to access the documentation page at `/en/docs`, the login page at `/en/login`, and the signup page at `/en/signup`, depending on the locale.
            </p>
          </div>
        </section>

        {/* Deployment Section */}
        <section id="deployment" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Deployment</h2>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-300">
              The application can be deployed using Vercel or any other hosting service that supports Next.js.
              Follow the respective documentation for deployment instructions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage; 