"use client";

import { useState } from "react";
import { searchByKeyword } from "../../lib/firestoreUtils";

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<{
        id: string;
        name: string;
        gender: string;
        age: number;
        middleInitial: string;
        phoneNumber: string;
        dateOfBirth: string;
       }[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        gender: '',
        id: '',
    });

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (searchTerm.trim() === "") return;

        setLoading(true);
        const data = await searchByKeyword(searchTerm);
        setResults(data);
        setLoading(false);
    };

    const filteredResults = results.filter(user => {
        if (filters.gender && user.gender !== filters.gender) return false;
        if (filters.id && !user.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="w-full max-w-md p-4 border rounded-md shadow-md">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a name..."
                    className="flex-1 p-2 border rounded-md"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                    Search
                </button>
            </form>

            <div className="mt-4 mb-4">
                <select 
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value,})}
                    className="p-2 border rounded-md"
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <div>
                <input
                    type="text"
                    value={filters.id}
                    onChange={(e) => setFilters({...filters, id: e.target.value,})}
                    placeholder="Filter by ID..."
                    className="p-2 border rounded-md"
                />
            </div>

            {loading && <p className="mt-2 text-gray-500">Searching...</p>}

            <ul className="mt-4">
                {filteredResults.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {filteredResults.map((user) => (
                            <div key={user.id} className="p-4 border rounded-md shadow-sm w-80">
                    <div className="space-y-2">
                        <div>
                            <strong>Name:</strong>{" "}
                            <a href={`/clients/${user.id}`} className="text-blue-500 hover:text-blue-700 underline">
                                {`${user.name}`}
                            </a>
                        </div>
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Gender:</strong> {user.gender}</div>
                        <div><strong>Middle Initial:</strong> {user.middleInitial}</div>
                        <div><strong>Phone:</strong> {user.phoneNumber}</div>
                        <div><strong>DOB:</strong> {user.dateOfBirth}</div>
                        <div><strong>Age:</strong> {user.age}</div>
                    </div>
                    </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p className="text-gray-500">No results found.</p>
                )}
            </ul>
        </div>
    );
};

export default SearchComponent;
