import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ChevronDown, LogOut, User, Settings, Bell } from 'lucide-react';
import { setAuthUser } from '../../../redux/authSlice';
import { toast } from 'react-toastify';
import { useSocket } from '../hooks/useSocket';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useSocket(user?._id);

  const handleLogout = () => {
    dispatch(setAuthUser(null));
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (socket && user?.role === 'candidate') {
      socket.on('notification', (data) => {
        toast.info(data.message);
        setNotificationCount((prev) => prev + 1);
      });
    }
  }, [socket, user]);

  return (
    <nav className="sticky top-0 z-50 border-b-2 shadow-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:shadow-medium transition-all">
              <span className="font-bold text-lg">NJ</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">NextJob</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/browse" className="font-semibold transition hover:opacity-90">
                  Browse Jobs
                </Link>
                <Link to="/saved" className="font-semibold transition hover:opacity-90">
                  Saved
                </Link>
                <Link to="/dashboard" className="font-semibold transition hover:opacity-90">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/browse" className="font-semibold transition hover:opacity-90">
                  Browse
                </Link>
                <Link to="/login" className="font-semibold transition hover:opacity-90">
                  For Clients
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user && (
              <Link 
                to="/notifications"
                className="relative p-2 transition hover:opacity-90 block"
                onClick={() => setNotificationCount(0)}
              >
                <Bell size={24} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm">
                    {notificationCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:opacity-90"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.fullname?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 border-2 rounded-xl shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:opacity-90 transition border-b"
                    >
                      <User size={18} />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-3 hover:opacity-90 transition"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:opacity-90 transition border-t"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 font-semibold hover:opacity-90 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 font-semibold rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition hover:opacity-90"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t-2">
            <Link to="/browse" className="block px-4 py-2 rounded transition hover:opacity-90">
              Browse Jobs
            </Link>
            {user && (
              <>
                <Link to="/saved" className="block px-4 py-2 rounded transition hover:opacity-90">
                  Saved Jobs
                </Link>
                <Link to="/dashboard" className="block px-4 py-2 rounded transition hover:opacity-90">
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-4 py-2 rounded transition hover:opacity-90">
                  Profile
                </Link>
              </>
            )}
            {!user && (
              <Link to="/login" className="block px-4 py-2 rounded transition hover:opacity-90">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
