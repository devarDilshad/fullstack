import React, { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { Product } from '../app/invoice/page'; // Adjust the import path as necessary

interface LiveSearchProps {
    items: Product[];
    setProductId: (id: number) => void;
}

const LiveSearch: React.FC<LiveSearchProps> = ({ items, setProductId }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const results = items.filter((product: Product) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(results);
            setShowResults(true);
        } else {
            setFilteredItems([]);
            setShowResults(false);
        }
        setHighlightedIndex(-1);
    };

    const handleClick = (item: Product) => {
        setSearchTerm(item.name);
        setProductId(item.product_id);
        setShowResults(false);
        inputRef.current?.blur(); // Lose focus
        console.log(`handler ${item.product_id}`);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showResults) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
                    handleClick(filteredItems[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowResults(false);
                inputRef.current?.blur(); // Lose focus
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (showResults && highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
            const activeElement = document.getElementById(`item-${highlightedIndex}`);
            activeElement?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, showResults]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Search..."
            />
            {showResults && (
                <ul className="absolute left-0 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow max-h-60">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item: Product, index: number) => (
                            <li
                                key={item.id}
                                id={`item-${index}`}
                                onClick={() => handleClick(item)}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${index === highlightedIndex ? 'bg-gray-200' : ''
                                    }`}
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
