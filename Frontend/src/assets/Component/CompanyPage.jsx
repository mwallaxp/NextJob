import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from "../../utils/constant";
import { useSelector } from "react-redux";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

const CompanyPage = () => {
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCompany(res.data.company);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setJobs(res.data.jobs.filter((job) => job?.company?._id === id || job?.company?.id === id));
        }
      } catch (error) {
        console.error("Error fetching jobs for company:", error);
      }
    };

    Promise.all([fetchCompany(), fetchJobs()]).finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4">
        <p className="text-slate-500">Loading company details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Company not found</h1>
        <p className="mt-2 text-slate-500">The company details are unavailable at the moment.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Company profile</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{company.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">{company.description || "A trusted company hiring top talent."}</p>
          </div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              <LinkIcon className="h-4 w-4" />
              Visit website
            </a>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Location</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{company.location || "Remote"}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Industry</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{company.industry || "Not specified"}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Open roles</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{jobs?.length || 0}</p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">About the company</h2>
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            {company.about || "This company has not added additional information yet."}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Current openings</h2>
            <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Browse all jobs
            </Link>
          </div>

          {jobs?.length ? (
            <div className="mt-6 space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job._id || job.id}
                  to={`/description/${job._id || job.id}`}
                  className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{job.location || "Remote"}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No active jobs are available for this company right now.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CompanyPage;
