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

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (searchTerm.trim() === "") return;

        setLoading(true);
        const data = await searchByKeyword(searchTerm);
        // console.log("Search results:", data);
        setResults(data);
        setLoading(false);
    };

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

            {loading && <p className="mt-2 text-gray-500">Searching...</p>}

            <ul className="mt-4">
                {results.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {results.map((user) => (
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
