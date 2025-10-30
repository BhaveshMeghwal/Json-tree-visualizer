'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiCheck, FiAlertCircle, FiInfo, FiFile } from 'react-icons/fi';

type JsonInputProps = {
  onJsonSubmit: (json: any) => void;
  error: string | null;
  className?: string;
  darkMode?: boolean;
};

export default function JsonInput({ onJsonSubmit, error,darkMode, className = '' }: JsonInputProps) {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      {
        name: 'Bhavesh',
        value: 23,
        isActive: true,
        nested: {
          key: 'value'
        },
        items: [1, 2, 3]
      }
    )
  );
  const [isValid, setIsValid] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  }, [jsonInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      setIsValid(true);
      onJsonSubmit(parsed);
    } catch (err) {
      setIsValid(false);
      onJsonSubmit({ error: 'Invalid JSON' });
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setIsValid(true);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-200 ${className}`}>
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 ${darkMode ? 'dark-bgcolor' : 'light-bgcolor'}`} >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <FiFile className="w-5 h-5 mr-2 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              JSON Input
            </span>
          </h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleFormat}
              className='cursor-pointer'
              disabled={!jsonInput.trim()}
            >
              Format
            </button>
            <button
              type="button"
              onClick={handleClear}
              className='cursor-pointer'
              disabled={!jsonInput.trim()}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={` ${darkMode ? 'dark-bgcolor' : 'light-bgcolor'}`}>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    try {
                      JSON.parse(e.target.value);
                      setIsValid(true);
                    } catch (err) {
                      setIsValid(false);
                    }
                  }}
                  className={`w-full p-4 font-mono ${darkMode ? 'input' : 'light-bgcolor'} text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${!isValid ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                  spellCheck="false"
                  rows={12}
                  style={{
                    minHeight: '50vh',
                    maxHeight: '55vh',
                    lineHeight: '1.5',
                    tabSize: 2,
                  }}
                  placeholder="Enter or paste your JSON here..."
                />
              </div>

              {!isValid && (
                <div className="flex items-start p-3 text-sm text-red-700 bg-red-50 rounded-md">
                  <FiAlertCircle className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-medium">Invalid JSON</p>
                    <p>Please check your JSON syntax.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className={`px-6 py-2 text-sm font-medium btn ${!jsonInput.trim() || !isValid ? 'cursor-not-allowed' : ''}`}
                    disabled={!jsonInput.trim() || !isValid}
                  >
                    Visualize JSON
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
