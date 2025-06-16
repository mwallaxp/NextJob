import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../../../utils/constant'

const shortListingStatus = ['Accepted', 'Rejected']

const ApplicantTable = () => {
  const { Application } = useSelector(store => store.Application)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)

  const statusHandler = async (status, id) => {
    try {
      setIsUpdating(true)
      
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`, 
        { status }, 
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      )

      if (res.data.success) {
        console.log('Status update successful')
        // Here you would typically update your local state or trigger a refresh
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
      setSelectedApplicant(null)
    }
  }

  const togglePopover = (applicantId) => {
    if (selectedApplicant === applicantId) {
      setSelectedApplicant(null)
    } else {
      setSelectedApplicant(applicantId)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Full Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Contact</th>
            <th className="py-2 px-4 border-b text-left">Resume</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {Application && Application.map((item, index) => (
            <tr key={item?._id || index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item?.Applicants?.fullname}</td>
              <td className="py-2 px-4 border-b">{item?.Applicants?.email}</td>
              <td className="py-2 px-4 border-b">{item?.Applicants?.phonenumber}</td>
              <td className="py-2 px-4 border-b">
                {item?.Applicants?.profile?.resume ? (
                  <a 
                    href={item?.Applicants?.profile?.resume} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    {item?.Applicants?.profile?.resumeOriginalName}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {item?.Applicants?.createdAt ? item.Applicants.createdAt.split(',')[0] : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b text-right relative">
                <button 
                  onClick={() => togglePopover(item?._id)}
                  className="p-1 rounded hover:bg-gray-200"
                  disabled={isUpdating}
                >
                  {/* Three dots menu icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                  </svg>
                </button>
                
                {selectedApplicant === item?._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {shortListingStatus.map((status, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => statusHandler(status, item?._id)} 
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Show message when no applications */}
      {(!Application || Application.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No applications found
        </div>
      )}
    </div>
  )
}

export default ApplicantTable