import React from 'react'

const ViewVendorReport = () => {

  // const supplier = {
  //   "Ritik": {
  //     "Delhi": 4,
  //     "Mumbai": 6,
  //     "Goa": 4
  //   },
  //   "Nilesh": {
  //     "Delhi": 5,
  //     "Mumbai": 3,
  //     "Goa": 7
  //   },
  //   "Vishal": {
  //     "Delhi": 8,
  //     "Mumbai": 2,
  //     "Goa": 3
  //   }
  // }
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

      <div className="p-6 font-sans">
        <h1 className="text-center text-2xl font-bold text-[#db272e] mb-6">
          Supplier Package Details
        </h1>
        <div className="overflow-x-auto">
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
        </div>
      </div>
    </div>
  </>
  )
}

export default ViewVendorReport