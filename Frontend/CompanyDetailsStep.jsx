import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyDetailsStepSchema } from '../schemas/jobSchema';

const CompanyDetailsStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyDetailsStepSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Company Details</h2>

      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">Company ID</label>
        <input type="text" id="companyId" {...register('companyId')}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>}
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={prevStep} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">Previous</button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">Next</button>
      </div>
    </form>
  );
};

export default CompanyDetailsStep;