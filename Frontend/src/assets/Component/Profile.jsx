import React, { useState } from "react";
import NavBar from "./shared/NavBar";
import {
  MailIcon,
  Pen,
  Contact2Icon,
} from "lucide-react";
import { ApplicationJobTable } from "./ApplicationJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import { use } from "react";
import useGetAppliedJobs from "./Hooks/useGetAppliedjobs";

const skill = ["HTML", "Java", "JavaScript", "Python", "Kotlin", "Pascal"];
const isResume = true;

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false);
  const {user} =useSelector(store=>store.auth)


  return (
    <div>
      <NavBar />
      {/* Profile Section */}
      <section className="max-w-7xl mx-auto bg-gray-50 border border-gray-200 shadow-md rounded-xl my-6 p-8">
        <div className="flex justify-between items-center">
          {/* Profile Info */}
          <div className="flex items-center gap-6">
            <div className="h-28 w-28">
              <img
                src={'../image/overprotocol.jpg'}
                alt="Profile"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-2xl text-gray-800">{user?.fullname}</h1>
              <p className="text-sm text-gray-600">
                {user?.profile?.bio}
             
              </p>
            </div>
          </div>
          {/* Edit Profile */}
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(true)}
          >
            <Pen className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <MailIcon className="w-6 h-6 text-gray-500" />
            <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
              {user?.email}
              
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Contact2Icon className="w-6 h-6 text-gray-500" />
            <span className="text-gray-700">{user?.phonenumber}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="font-semibold text-xl text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            {user?.profile?.skills?.length != 0 ? (
              user?.profile?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-600">No skills listed.</p>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <h2 className="font-semibold text-xl text-gray-800">Resume</h2>
          <div className="mt-2">
            {isResume ? (
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {user?.profile?.resumeOriginalName}
              </a>
            ) : (
              <p className="text-sm text-gray-600">No resume uploaded.</p>
            )}
          </div>
        </div>
      </section>

      {/* Applied Jobs Section */}
      <section className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applied Jobs</h2>
        <ApplicationJobTable />
      </section>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
