import React, { useState } from 'react';
import JobDetailsStep from './JobDetailsStep';
import CompanyDetailsStep from './CompanyDetailsStep';
import ReviewStep from './ReviewStep';
import { frontendJobSchema } from '../schemas/jobSchema';
import { toast } from 'react-toastify';
import axios from 'axios';

const MultiStepJobForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [], // Initialize requirements as an empty array
    salary: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    skills: [], // Initialize skills as an empty array
    currency: 'USD', // Default currency, can be changed by user
    position: '',
    companyId: '',
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      // Final validation of the entire form data before submission
      frontendJobSchema.parse(formData);
      
      // Simulate API call
      console.log('Submitting form data:', formData);
      // In a real application, you would send this to your backend
      // const response = await axios.post('/api/v1/job/post', formData);
      // console.log('Job posted successfully:', response.data);
      toast.success('Job posted successfully!');
      // Reset form or redirect
      setFormData({
        title: '', description: '', requirements: '', salary: '',
        location: '', jobType: '', experienceLevel: '', position: '', requirements: [],
        companyId: '',
        skills: [],
        currency: 'USD',
      });
      setCurrentStep(1);
    } catch (e) {
      console.error('Form submission error:', e);
      toast.error('Please correct all errors before submitting.');
      // Optionally, navigate back to the first step with errors
      setCurrentStep(1); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-surface rounded-xl shadow-lg">
      {currentStep === 1 && <JobDetailsStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
      {currentStep === 2 && <CompanyDetailsStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
      {currentStep === 3 && <ReviewStep formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />}
    </div>
  );
};

export default MultiStepJobForm;