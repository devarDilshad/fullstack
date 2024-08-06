import React, { useState, ChangeEvent } from 'react';

const LiveSearch = ({ items, setProducId }: any) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<{ id: number, name: string }[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const results = items.filter((product: any) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(results);
            setShowResults(true);
        } else {
            setFilteredItems([]);
            setShowResults(false);
        }
    };

    const handleClick = (item: any) => {
        setSearchTerm(item.name);
        setProducId(item.product_id)
        setShowResults(false);
        console.log(`handler ${item.product_id}`);
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Search..."
            />
            {showResults && (
                <ul className="absolute left-0 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow max-h-60">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item: any) => (
                            <li
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                            >
                                {item.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default LiveSearch;
