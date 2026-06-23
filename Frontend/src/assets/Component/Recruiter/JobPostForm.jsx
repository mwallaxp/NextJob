import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  ButtonPrimary,
  SectionHeader,
  Input, // Assuming these are available in DesignSystem or will be styled
  Textarea,
  Select,
} from "../../../components/DesignSystem";
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';
import { createJob } from '../../../services/jobService';
import { getRecruiterCompanies } from '../../../services/companyService';

const schema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  salary: z.string().min(1, "Salary range is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Please select a job type"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  position: z.coerce.number().min(1, "At least 1 position required"),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  skills: z.string().min(1, "At least one skill is required"),
  requirements: z.string().min(1, "At least one requirement is required"),
}).refine(data => data.companyId || data.companyName, {
  message: "Company details are required",
  path: ["companyId"],
});

const JobPostForm = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { position: 1 }
  });

  const selectedCompanyId = watch("companyId");

  // Redirect if not a recruiter
  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Fetch recruiter's companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getRecruiterCompanies();
        if (res.data.success) {
          setCompanies(res.data.companies);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load your companies.");
      }
    };

    if (user?.role === 'recruiter') {
      fetchCompanies();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Job title is required.';
    if (!formData.description) errors.description = 'Job description is required.';
    if (!formData.salary) errors.salary = 'Salary is required (e.g., 50000-70000).';
    if (!formData.location) errors.location = 'Location is required.';
    if (!formData.jobType) errors.jobType = 'Job type is required.';
    if (!formData.experienceLevel) errors.experienceLevel = 'Experience level is required.';
    if (!formData.position || formData.position < 1) errors.position = 'Position must be at least 1.';
    if (!formData.skills) errors.skills = 'Skills are required (comma-separated).';
    if (!formData.requirements) errors.requirements = 'Requirements are required (comma-separated).';
    if (!formData.companyId && !formData.companyName) errors.company = 'Please select an existing company or enter a new company name.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      // Ensure only one of companyId or companyName is sent if both are present
      if (payload.companyId && payload.companyName) {
        delete payload.companyName;
      } else if (!payload.companyId && payload.companyName) {
        delete payload.companyId; // Ensure companyId is not empty string if companyName is used
      }

      const res = await createJob(payload);
      if (res.data.success) {
        toast.success("Job posted successfully!");
        navigate(ROUTES.RECRUITER_JOBS);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <main className="min-h-screen bg-black-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black-600 hover:text-orange-600 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <SectionHeader
          title="Post a New Job"
          subtitle="Fill out the details below to create a new job posting."
        />

        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              error={formErrors.title}
            />
            <Textarea
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the job role, responsibilities, and expectations."
              rows={6}
              error={formErrors.description}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Salary Range (USD)"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., 50000-70000"
                error={formErrors.salary}
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, New York, London"
                error={formErrors.location}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Job Type' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                  { value: 'Project', label: 'Project' },
                ]}
                error={formErrors.jobType}
              />
              <Select
                label="Experience Level"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Experience Level' },
                  { value: 'Entry', label: 'Entry' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Expert', label: 'Expert' },
                  { value: 'Senior', label: 'Senior' },
                ]}
                error={formErrors.experienceLevel}
              />
            </div>
            <Input
              label="Number of Positions"
              name="position"
              type="number"
              value={formData.position}
              onChange={handleChange}
              min="1"
              error={formErrors.position}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Existing Company"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select a Company' },
                  ...companies.map(comp => ({ value: comp._id, label: comp.name }))
                ]}
                error={formErrors.company}
              />
              <Input
                label="Or Enter New Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Tech Solutions Inc."
                disabled={!!formData.companyId} // Disable if companyId is selected
                error={formErrors.company}
              />
            </div>
            <Input
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, JavaScript"
              error={formErrors.skills}
            />
            <Input
              label="Requirements (comma-separated)"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g., 3+ years experience, Bachelor's degree"
              error={formErrors.requirements}
            />

            <ButtonPrimary type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting Job...' : 'Post Job'}
            </ButtonPrimary>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default JobPostForm;
