import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobDetailsStepSchema } from '../schemas/jobSchema';
import { X } from 'lucide-react';

const JobDetailsStep = ({ formData, updateFormData, nextStep }) => {
  const [requirementInput, setRequirementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobDetailsStepSchema),
    defaultValues: {
      ...formData,
      skills: formData.skills || [],
      requirements: formData.requirements || [], // Initialize requirements as array
    },
  });

  const skills = watch('skills');

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setValue('skills', [...skills, skillInput.trim()], { shouldValidate: true });
      }
      setSkillInput('');
    }
  };

  const requirements = watch('requirements');

  const addRequirement = (e) => {
    if (e.key === 'Enter' && requirementInput.trim()) {
      e.preventDefault();
      if (!requirements.includes(requirementInput.trim())) {
        setValue('requirements', [...requirements, requirementInput.trim()], { shouldValidate: true });
      }
      setRequirementInput('');
    }
  };

  const removeRequirement = (reqToRemove) => {
    setValue('requirements', requirements.filter(r => r !== reqToRemove), { shouldValidate: true });
  };

  const removeSkill = (skillToRemove) => {
    setValue('skills', skills.filter(s => s !== skillToRemove), { shouldValidate: true });
  };

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <input type="text" id="title" {...register('title')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" {...register('description')}
                  rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500"></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Required Skills</label>
        <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all">
          {skills?.map((skill, index) => (
            <span key={index} className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 text-sm rounded-lg border border-brand-100">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            placeholder={skills?.length === 0 ? "e.g. React, Node (Press Enter)" : ""}
            className="flex-1 outline-none min-w-[120px] text-sm"
          />
        </div>
        {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Requirements</label>
        <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all">
          {requirements?.map((req, index) => (
            <span key={index} className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 text-sm rounded-lg border border-brand-100">
              {req}
              <button type="button" onClick={() => removeRequirement(req)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            onKeyDown={addRequirement}
            placeholder={requirements?.length === 0 ? "e.g. Bachelor's Degree, Problem-solving (Press Enter)" : ""}
            className="flex-1 outline-none min-w-[120px] text-sm"
            // Register the requirements field with react-hook-form, but let the tag logic manage its value
            {...register('requirements')}
            hidden // Hide the actual input as we manage it via state and buttons
          />
        </div>
        {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>}
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
        <input type="number" id="salary" {...register('salary')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>}
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <select id="currency" {...register('currency')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500">
          <option value="USD">USD - United States Dollar</option>
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          {/* Add more currencies as needed */}
        </select>
        {errors.currency && (
          <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input type="text" id="location" {...register('location')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
        <select id="jobType" {...register('jobType')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500">
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
          <option value="Internship">Internship</option>
        </select>
        {errors.jobType && <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>}
      </div>

      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level (Years)</label>
        <input type="number" id="experienceLevel" {...register('experienceLevel')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.experienceLevel && <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>}
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Number of Positions</label>
        <input type="number" id="position" {...register('position')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>}
      </div>

      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">Next</button>
    </form>
  );
};

export default JobDetailsStep;