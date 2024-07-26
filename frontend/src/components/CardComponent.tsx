import React from "react";

interface Card {
  id: number;
  name: string;
  email: string;
}

// create a card functional component Card is the type
const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return <div className=" bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
    <div className="text-sm text-gray-600">
      ID: {card.id}
    </div>
    <div className="text-lg text-gray-800 font-semibold">
      NAME: {card.name}
    </div>
    <div className="text-md text-gray-700">
      EMAIL: {card.email}
    </div>
  </div>;
};

export default CardComponent;
