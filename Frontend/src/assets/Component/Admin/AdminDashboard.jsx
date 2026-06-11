import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';
import { Users, Briefcase, CheckCircle, Search, ChevronLeft, ChevronRight, LogIn, Activity, ArrowUpRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { StatCard } from '../../../components/DesignSystem'; // Corrected import path
import { useAuth } from '../shared/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [limit] = useState(10); // Number of users per page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchAdminStats = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Failed to fetch admin statistics.');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: limit,
        search: searchQuery,
        role: selectedRole,
        status: selectedStatus,
      };
      const response = await api.get('/api/v1/admin/users', { params });
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalUsersCount(response.data.total);
        setTotalPages(Math.ceil(response.data.total / limit));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchQuery, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
      await api.patch(`/api/v1/admin/users/${userId}/status`, { status: newStatus });
      // Refetch users to update the table
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError('Failed to update user status.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchUsers();
  };

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="text-red-500 text-center py-8">Access Denied. You must be an administrator to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-black-900 mb-8">Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<Users size={24} className="text-orange-600" />}
          label="Total Candidates"
          value={stats?.candidates || 0}
          backgroundColor="bg-orange-50"
        />
        <StatCard
          icon={<Users size={24} className="text-teal-600" />}
          label="Total Recruiters"
          value={stats?.recruiters || 0}
          backgroundColor="bg-teal-50"
        />
        <StatCard
          icon={<Briefcase size={24} className="text-gold-500" />}
          label="Total Jobs Posted"
          value={stats?.totalJobs || 0}
          backgroundColor="bg-gold-50"
        />
        <StatCard
          icon={<CheckCircle size={24} className="text-emerald-600" />}
          label="Active Jobs"
          value={stats?.activeJobs || 0}
          backgroundColor="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main User Management Area */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-black-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black-900">User Management</h2>
            <span className="text-sm text-black-500 font-medium">{totalUsersCount} Total Users</span>
          </div>

          {/* Filters and Search */}
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search candidates or recruiters..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-black-100 rounded-xl w-full focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black-400" />
            </div>
            <select
              className="py-2 px-3 bg-gray-50 border border-black-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="candidate">Candidate</option> {/* Changed from 'student' to 'candidate' */}
              <option value="recruiter">Recruiter</option>
            </select>
            <button
              type="submit"
              className="bg-black-900 text-white px-4 py-2 rounded-xl hover:bg-black-800 transition-colors text-sm font-semibold"
            >
              Filter
            </button>
          </form>

          {loading ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
              <p className="text-black-500 text-sm">Syncing records...</p>
            </div>
          ) : (
            /* ... rest of your table logic remains, but wrap in div with rounded-xl ... */
            <div className="overflow-hidden rounded-xl border border-black-50">
               {/* Table Content... */}
            </div>
          )}
        </div>

        {/* Modern Activity Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-black-100 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-black-900 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {stats?.recentActivity?.length > 0 ? (
                stats.recentActivity.map((log) => (
                  <div key={log._id} className="flex gap-3 pb-3 border-b border-black-50 last:border-0">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-black-800 uppercase tracking-tighter">{log.action.replace('_', ' ')}</p>
                      <p className="text-xs text-black-500">By {log.adminId?.fullname || 'System'}</p>
                      <p className="text-[10px] text-black-400 mt-1">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black-400 italic">No recent logs.</p>
              )}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              View All Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;