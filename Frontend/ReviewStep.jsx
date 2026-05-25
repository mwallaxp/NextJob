import React from 'react';

const ReviewStep = ({ formData, prevStep, handleSubmit }) => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Job Post</h2>
      
      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-100">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">Previous</button>
        <button onClick={handleSubmit} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Submit Job</button>
      </div>
    </div>
  );
};

export default ReviewStep;