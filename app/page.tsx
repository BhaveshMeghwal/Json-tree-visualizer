'use client';

import { useState, useEffect } from 'react';
import JsonInput from './components/JsonInput';
import JsonTreeView from './components/JsonTreeView';
import { ReactFlowProvider } from 'reactflow';
import { FiFileText, FiMoon, FiSun } from 'react-icons/fi';

export default function Home() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleJsonSubmit = (data: any) => {
    setIsLoading(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      if (data && data.error) {
        setError('Invalid JSON. Please check your input.');
        setJsonData(null);
      } else {
        setError(null);
        setJsonData(data);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`sticky ${darkMode ? 'dark-bgcolor' : 'light-bgcolor'} top-0 z-50 border-b border-gray-200  backdrop-blur-md shadow-sm transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Left Section — Title + Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold  tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                JSON Tree Visualizer
              </h1>
              <p className="text-sm sm:text-base text-blue-500">
                Visualize and explore your JSON data with an interactive tree view
              </p>
            </div>

            {/* Right Section — Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className=" border border-gray-200 rounded-full p-2 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                {darkMode ? <FiSun /> : <FiMoon />}
              </span>
              <span className="absolute inset-0 rounded-full bg-blue- 500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </header>


      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <JsonInput
              onJsonSubmit={handleJsonSubmit}
              error={error}
              darkMode={darkMode}
            // isLoading={isLoading} 
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full border border-gray-200 dark:border-gray-700">

              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : jsonData ? (
                <ReactFlowProvider>
                  <JsonTreeView
                    json={jsonData}
                    darkMode={darkMode}
                  />
                </ReactFlowProvider>
              ) : (
                <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'dark-bgcolor' : 'light-bgcolor'} text-gray-500 dark:text-gray-400 p-6 text-center`}>
                  <FiFileText className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium mb-2">No JSON Data</h3>
                  <p className="text-sm max-w-xs">
                    Enter your JSON data on the left to visualize it as an interactive tree.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
