import React, { useContext, useEffect } from 'react'
import TableComponent from '../component/TableComponent';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import api from '../apiConfig/config';
import { UserContext } from '../contexts/userContext';

const ViewVendorReport = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios.get(`${api.baseUrl}/supplierreports?userId=${user.userId}`)
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
  }, [])

  const columns = [{
    header: 'S. No.',
    render: ({ row }) => <span>{row.sno}</span>,
  }, {
    header: "Supplier Name",
    accessor: "supplierName",
  },
  {
    header: "Total Package",
    accessor: "totalPackage",
  },
  {
    header: "Package Name",
    accessor: "packageNames",
  },
  {
    header: "Destinations",
    accessor: "destinations",
  },
  {
    header: "Package Type",
    accessor: "packageType",
  }
  ];

  const data = [
    {
      sno: 1,
      supplierName: "Anshul",
      totalPackage: 11,
      packageNames: "Most Wanted Kashmir Package, Couples Choice - Allepey Kerala",
      destinations: "Kashmir, Kerala",
      packageType: "Domestic",
    },
    {
      sno: 2,
      supplierName: "Ritik",
      totalPackage: 15,
      packageNames: "",
      destinations: "",
      packageType: "International",
    },
    {
      sno: 3,
      supplierName: "Nilesh",
      totalPackage: 17,
      packageNames: "",
      destinations: "",
      packageType: "",
    },
    {
      sno: 4,
      supplierName: "Alex",
      totalPackage: 25,
      packageNames: "",
      destinations: "",
      packageType: "",
    },
    {
      sno: 5,
      supplierName: "Narender",
      totalPackage: 22,
      packageNames: "",
      destinations: "",
      packageType: "",
    },
  ];

  return (<>

    <div className='m-2'>
      {/* <table className="w-full">
        <thead className='bg-gray-200'>
          <tr className='truncate border-collapse'>
            <th className="py-2 px-4 border"></th>
            <th className="py-2 px-4 border">Destination 1</th>
            <th className="py-2 px-4 border">Destination 1</th>
            <th className="py-2 px-4 border">Destination 1</th>
            <th className="py-2 px-4 border">Destination 1</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-collapse text-center">
            <td className="py-2 px-4 border">data</td>
          </tr>
        </tbody>
      </table> */}

      <div className="p-4">
        <h1 className=" text-xl font-bold mb-6">
          Supplier Package Details
        </h1>

        <hr className="my-4" />
        <div className="w-full overflow-auto">
          <TableComponent columns={columns} data={data} />
        </div>
        {/* <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[#db272e] text-white">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">S. No.</th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Supplier Name
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Total Package
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Package Names
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Destinations
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Package Type
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.sno}
                  className="hover:bg-yellow-100 odd:bg-gray-100 even:bg-white"
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {row.sno}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{row.supplierName}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {row.totalPackage}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.packageNames || "-"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.destinations || "-"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.packageType || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  </>
  )
}

export default ViewVendorReport