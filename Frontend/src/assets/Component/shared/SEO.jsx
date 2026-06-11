import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = title ? `${title} | NextJob` : 'NextJob - Land the Right Projects';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'NextJob is the premier marketplace for freelancers and recruiters.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'jobs, freelance, recruitment, portfolio, career');
    }
  }, [title, description, keywords]);

  return null;
};

export default SEO;