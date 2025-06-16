import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '../../../redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const JobRoleCarousel = () => {
  const roles = [
    'Frontend Developer',
    'Backend Developer', 
    'Data Science',
    'Graphic Designer',
    'Full Stack Developer',
    'cybersecurity'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch =useDispatch()
  const navigate =useNavigate()

  const searchHandeler =(query)=>{
    dispatch(setSearchedQuery(query))
    navigate('/Browse')

  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % roles.length
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? roles.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <button 
        variant="outline" 
        size="icon" 
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div className="text-center min-w-[200px]">
        <button variant="secondary" className="w-full" onClick={()=>searchHandeler()}>
          {roles[currentIndex]}
        </button>
      </div>
      
      <button 
        variant="outline" 
        size="icon" 
        onClick={handleNext}
        
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default JobRoleCarousel;