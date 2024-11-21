import React, { useState } from 'react'




const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-4">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer text-gray-700 hover:text-blue-500"
      >
        {node.children && (
          <span className="mr-2">{isExpanded ? "▼" : "▶"}</span>
        )}
        {node.name}
      </div>
      {isExpanded &&
        node.children &&
        node.children.map((child) => <TreeNode key={child.id} node={child} />)}
    </div>

  );
};

const CompanyHierarchy = () => {

  const data = [
    {
      id: 1,
      name: "Parent 1",
      children: [
        {
          id: 2,
          name: "Child 1.1",
          children: [
            { id: 3, name: "Grandchild 1.1.1" },
            { id: 4, name: "Grandchild 1.1.2" },
          ],
        },
        { id: 5, name: "Child 1.2" },
      ],
    },
    {
      id: 6,
      name: "Parent 2",
      children: [
        { id: 7, name: "Child 2.1" },
        { id: 8, name: "Child 2.2" },
      ],
    },
  ];
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Hierarchical Data</h2>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};


export default CompanyHierarchy