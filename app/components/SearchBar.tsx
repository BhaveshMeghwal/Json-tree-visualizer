import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="relative btn ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search... (user.name or items[0])"
          className="w-full px-4 py-2 shadow-md rounded-md focus:outline-none focus:ring-0 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Search"
        >
         <FiSearch/>
        </button>
      </div>
    </form>
  );
}
