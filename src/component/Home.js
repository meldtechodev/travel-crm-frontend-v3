import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col  items-start justify-start w-80 h-full bg-gray-100 p-4 shadow-md"> {/* Container for the Home component */}
      <h1 className="text-2xl font-bold mb-14">Home</h1>
      <div className="flex flex-col items-start mb-4"> {/* Changed to flex-col for vertical stacking */}
        <Link to="/quickstart" className="w-full"> {/* Added full width to Link */}
          <button className="bg-gray-300 p-3 rounded w-[280px] text-center mb-5">Quickstart</button> {/* Set width to 320px */}
        </Link>
        <Link to="/dashboard" className="w-full"> {/* Added full width to Link */}
          <button className="bg-gray-300 p-3 rounded w-[280px] text-center">Dashboard</button> {/* Set width to 320px */}
        </Link>
      </div>
    </div>
  );
};

export default Home;
