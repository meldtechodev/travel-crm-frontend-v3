import React from 'react';

const TableComponent = ({ columns, data }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className='bg-gray-200'>
        <tr className='truncate border-collapse'>
          {columns.map((column, index) => (
            <th key={index} className="py-2 px-4 border">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-collapse text-center">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="py-2 px-4 border">
                {typeof column.render === 'function'
                  ? column.render({ value: row[column.accessor], row })
                  : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
