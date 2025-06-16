import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../../redux/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "react-toastify";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "", // Assuming skills are stored as an array
    file: null,
  });
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileEventHandler = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phonenumber", input.phonenumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true)
      const res = await axios.post(     
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        alert("sucessfull update")
        setOpen(false);
      }
    } catch (error) {
      console.log("Error updating profile:", error);
       toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Update Profile</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="fullname"
                className="text-right col-span-1 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                id="fullname"
                className="col-span-3 border rounded p-2 shadow"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="email"
                className="text-right col-span-1 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                id="email"
                className="col-span-3 border rounded p-2 shadow"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="phonenumber"
                className="text-right col-span-1 font-medium"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phonenumber"
                value={input.phonenumber}
                onChange={changeEventHandler}
                id="phonenumber"
                className="col-span-3 border rounded p-2 shadow"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="bio"
                className="text-right col-span-1 font-medium"
              >
                Bio
              </label>
              <input
                type="text"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                id="bio"
                className="col-span-3 border rounded p-2 shadow"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="skills"
                className="text-right col-span-1 font-medium"
              >
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                id="skills"
                className="col-span-3 border rounded p-2 shadow"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="file"
                className="text-right col-span-1 font-medium"
              >
                Resume
              </label>
              <input
                type="file"
                name="file"
                onChange={fileEventHandler}
                accept="application/pdf"
                id="file"
                className="col-span-3 border rounded p-2 shadow"
              />
              {input.file && (
                <p className="text-sm text-gray-500 col-span-3">
                  File selected: {input.file.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <button
                type="button"
                className="bg-blue-600 text-white rounded-lg w-full h-12 font-medium flex justify-center items-center"
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg w-full h-12 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileDialog;
