import React from 'react';
import { ChevronRight, Star, TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';

// ============ BUTTON COMPONENTS ============

export const ButtonPrimary = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-soft hover:shadow-medium active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const ButtonSecondary = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-white border-2 border-black-100 text-black-900 font-semibold rounded-xl hover:bg-black-50 transition-all duration-300 shadow-soft ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const ButtonOutline = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const ButtonSmall = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-black-50 hover:bg-black-100 text-black-900',
    outline: 'border border-orange-500 text-orange-500 hover:bg-orange-50',
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ============ CARD COMPONENTS ============

export const Card = ({ children, className = '', hoverable = false }) => (
  <div
    className={`bg-white rounded-2xl border border-black-100 p-6 transition-all duration-300 ${
      hoverable ? 'hover:shadow-medium hover:border-orange-200 hover:-translate-y-1' : 'shadow-soft'
    } ${className}`}
  >
    {children}
  </div>
);

export const CardJob = ({ job, onApply, saved = false }) => (
  <Card hoverable>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-black-900 mb-2">{job.title}</h3>
        <p className="text-sm text-black-600 mb-3">{job.company}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
            {job.type}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold">
            {job.level}
          </span>
        </div>
      </div>
      {saved && <Star className="text-gold-500 fill-gold-500" size={24} />}
    </div>
    <p className="text-sm text-black-600 line-clamp-2 mb-4">{job.description}</p>
    <div className="flex items-center justify-between pt-4 border-t border-black-100">
      <span className="font-bold text-orange-500">${job.budget}</span>
      <ButtonSmall variant="primary" onClick={onApply}>
        Apply Now
      </ButtonSmall>
    </div>
  </Card>
);

// ============ STAT CARDS ============

export const StatCard = ({ icon: Icon, label, value, trend = null, backgroundColor = 'bg-orange-50' }) => (
  <Card className={`${backgroundColor}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-black-600 mb-2">{label}</p>
        <p className="text-3xl font-bold text-black-900">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${backgroundColor.replace('50', '200')}`}>
        <Icon size={24} className="text-orange-600" />
      </div>
    </div>
  </Card>
);

// ============ BADGE COMPONENTS ============

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-orange-100 text-orange-700',
    secondary: 'bg-black-100 text-black-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-yellow-100 text-yellow-700',
    teal: 'bg-teal-50 text-teal-600',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ============ SECTION HEADERS ============

export const SectionHeader = ({ title, subtitle = '', action = null }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-3xl font-bold text-black-900 mb-2">{title}</h2>
        {subtitle && <p className="text-black-600">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  </div>
);

// ============ HERO BANNER ============

export const HeroBanner = ({ title, subtitle, backgroundImage = null }) => (
  <div
    className="relative rounded-3xl overflow-hidden mb-8"
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, rgb(255, 140, 66) 0%, rgb(255, 160, 91) 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-black/30"></div>
    <div className="relative px-8 py-16 sm:px-12 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-white/90 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  </div>
);

// ============ PROGRESS COMPONENTS ============

export const ProgressBar = ({ value, label = '' }) => (
  <div>
    {label && <p className="text-sm font-medium text-black-700 mb-2">{label}</p>}
    <div className="w-full h-3 bg-black-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
    <p className="text-xs text-black-500 mt-1">{value}% Complete</p>
  </div>
);

// ============ FEATURE GRID ============

export const FeatureGrid = ({ features }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((feature, idx) => (
      <div key={idx} className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100">
            {feature.icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black-900">{feature.title}</h3>
          <p className="text-sm text-black-600 mt-1">{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
);

// ============ PRICING CARD ============

export const PricingCard = ({ tier, price, description, features, highlighted = false }) => (
  <Card className={`relative ${highlighted ? 'ring-2 ring-orange-500 md:scale-105' : ''}`}>
    {highlighted && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <Badge variant="primary">Most Popular</Badge>
      </div>
    )}
    <h3 className="text-2xl font-bold text-black-900 mb-2">{tier}</h3>
    <p className="text-black-600 mb-6">{description}</p>
    <div className="mb-6">
      <span className="text-4xl font-bold text-orange-500">${price}</span>
      <span className="text-black-600 ml-2">/month</span>
    </div>
    <button
      className={`w-full py-3 rounded-xl font-semibold mb-6 transition-all ${
        highlighted
          ? 'bg-orange-500 hover:bg-orange-600 text-white'
          : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
      }`}
    >
      Get Started
    </button>
    <ul className="space-y-3">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-black-700">
          <CheckCircle size={18} className="text-orange-500 mr-3" />
          {feature}
        </li>
      ))}
    </ul>
  </Card>
);

// ============ TESTIMONIAL CARD ============

export const TestimonialCard = ({ name, role, image, content, rating = 5 }) => (
  <Card>
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={16} className="fill-gold-500 text-gold-500" />
      ))}
    </div>
    <p className="text-black-700 mb-4 italic">"{content}"</p>
    <div className="flex items-center pt-4 border-t border-black-100">
      <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover mr-3" />
      <div>
        <p className="font-semibold text-black-900">{name}</p>
        <p className="text-xs text-black-600">{role}</p>
      </div>
    </div>
  </Card>
);

// ============ NAVIGATION TABS ============

export const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 border-b border-black-100 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-3 font-semibold border-b-2 transition-all ${
          activeTab === tab.id
            ? 'text-orange-600 border-orange-500'
            : 'text-black-600 border-transparent hover:text-black-900'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ============ EMPTY STATE ============

export const EmptyState = ({ icon: Icon, title, description, action = null }) => (
  <div className="text-center py-12">
    <div className="mb-4 flex justify-center">
      <Icon size={48} className="text-black-300" />
    </div>
    <h3 className="text-xl font-semibold text-black-900 mb-2">{title}</h3>
    <p className="text-black-600 mb-6">{description}</p>
    {action && action}
  </div>
);
