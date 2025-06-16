import { all } from "axios";
import {
    Badge,
  LucideTableCellsMerge,
  Table,

  TableOfContents
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
{
    const tabler =["Data", "Job Role", "Company", "Status"]
}
export const ApplicationJobTable = () => {
  const {allAppliedJobs} =useSelector(store=>store.job)
  return (
    <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
            
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Job</th>
                    <th className="border border-gray-300 px-4 py-2">Company</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Status</th>
                </tr>
            
              
                
                    {
                        allAppliedJobs?.length < 0 ?<span>You Have'nt Applied Any Job </span> : allAppliedJobs?.map((appliedJob)=>{
                            return(
                            <tr key={appliedJob._id}>

                                <td className="border border-gray-300 px-4 py-2">{appliedJob?.createdAt.split('T')[0]}</td>
                                <td className="border border-gray-300 px-4 py-2">{appliedJob?.job?.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{appliedJob?.job?.name}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right"><p className={`${appliedJob.status== "Rejected"?  'bg-red-600': appliedJob.status=="pending"? 'bg-gray-400': 'bg-green-400'}`}>{appliedJob?.status}</p></td>

                            </tr>
                        )})
                    }
                
            

        </table>


      {/* <Table>
        <TableOfContents>
          <LucideTableCellsMerge>table</LucideTableCellsMerge>
        </TableOfContents>
      </Table>
      <table className="p-3">
        <caption>Recent applied job</caption>

        <th>
          <td>Data</td>
          <td>Job Role</td>
          <td>Company</td>
          <td className="text-right">Status</td>
        </th>
        <tr>
          {[1, 2, 3].map((item, index) => (
            <td key={index}>
              <>15-12-2024</>
            </td>
          ))}
          <td></td>
          <td></td>
        </tr>
      </table>*/}
    </div> 
  );
};
export default ApplicationJobTable;
