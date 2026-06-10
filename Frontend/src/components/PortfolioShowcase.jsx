import React, { useState } from 'react';
import { Upload, Trash2, Link as LinkIcon, ExternalLink, Award, Users } from 'lucide-react';
import { Card, Badge, ButtonSmall, SectionHeader } from '../../components/DesignSystem';

const PortfolioShowcase = ({ freelancerId }) => {
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include product catalog, shopping cart, payment integration, and admin dashboard.',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=400&h=300&fit=crop',
      link: 'https://ecommerce-demo.com',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      skills: ['Full Stack Development', 'Payment Integration', 'Database Design'],
      completedDate: 'December 2023',
      clientName: 'TechStart Inc',
      budget: '$5,000',
    },
    {
      id: 2,
      title: 'Mobile App Design System',
      description: 'Comprehensive design system for a mobile fitness app. Includes component library, design tokens, and extensive documentation.',
      category: 'UI/UX Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      link: 'https://dribbble.com/portfolio',
      technologies: ['Figma', 'Prototyping', 'User Testing'],
      skills: ['UI Design', 'UX Research', 'Design Systems'],
      completedDate: 'November 2023',
      clientName: 'FitnessPro',
      budget: '$3,500',
    },
  ]);

  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    link: '',
    technologies: '',
    clientName: '',
  });

  const handleAddPortfolio = () => {
    if (newPortfolio.title && newPortfolio.description) {
      const item = {
        id: portfolioItems.length + 1,
        ...newPortfolio,
        image: 'https://via.placeholder.com/400x300',
        skills: newPortfolio.technologies.split(',').map(s => s.trim()),
        technologies: newPortfolio.technologies.split(',').map(s => s.trim()),
        completedDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        budget: 'Custom',
      };
      setPortfolioItems([item, ...portfolioItems]);
      setNewPortfolio({ title: '', description: '', category: 'Web Development', link: '', technologies: '', clientName: '' });
      setShowAddPortfolio(false);
    }
  };

  const handleDeletePortfolio = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const categories = ['Web Development', 'UI/UX Design', 'Mobile App', 'Branding', 'Content Writing', 'Other'];

  const stats = [
    { label: 'Portfolio Items', value: portfolioItems.length },
    { label: 'Projects Completed', value: '24' },
    { label: 'Avg. Rating', value: '4.9' },
    { label: 'Total Earnings', value: '$45K+' },
  ];

  return (
    <div className="min-h-screen bg-black-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black-900 mb-2">My Portfolio</h1>
          <p className="text-black-600">Showcase your best work and attract premium clients</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="text-center bg-gradient-to-br from-orange-50 to-white">
              <p className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</p>
              <p className="text-sm text-black-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Add Portfolio Button */}
        <div className="mb-8">
          {showAddPortfolio ? (
            <Card className="bg-white">
              <h3 className="text-xl font-bold text-black-900 mb-6">Add Portfolio Item</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-black-900 mb-2">Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g., E-Commerce Platform"
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black-900 mb-2">Category</label>
                  <select
                    value={newPortfolio.category}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-black-900 mb-2">Description</label>
                <textarea
                  placeholder="Describe your project, what you did, and the results..."
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-black-900 mb-2">Project Link</label>
                  <input
                    type="url"
                    placeholder="https://project-link.com"
                    value={newPortfolio.link}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black-900 mb-2">Client Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., TechStart Inc"
                    value={newPortfolio.clientName}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, clientName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-black-900 mb-2">Technologies Used (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., React, Node.js, MongoDB, Stripe"
                  value={newPortfolio.technologies}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, technologies: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddPortfolio}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                >
                  Add to Portfolio
                </button>
                <button
                  onClick={() => setShowAddPortfolio(false)}
                  className="flex-1 py-3 border-2 border-black-100 text-black-900 font-semibold rounded-lg hover:bg-black-50 transition"
                >
                  Cancel
                </button>
              </div>
            </Card>
          ) : (
            <Card>
              <button
                onClick={() => setShowAddPortfolio(true)}
                className="w-full py-4 border-2 border-dashed border-orange-500 rounded-lg text-orange-600 font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                Add Portfolio Item
              </button>
            </Card>
          )}
        </div>

        {/* Portfolio Grid */}
        <div>
          <h2 className="text-2xl font-bold text-black-900 mb-6">
            My Projects ({portfolioItems.length})
          </h2>

          {portfolioItems.length === 0 ? (
            <Card className="text-center py-12">
              <Award size={48} className="mx-auto text-black-300 mb-4" />
              <p className="text-lg font-semibold text-black-900 mb-2">No portfolio items yet</p>
              <p className="text-black-600 mb-6">Add your best work to showcase your skills to potential clients</p>
              <button
                onClick={() => setShowAddPortfolio(true)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                Start Adding Projects
              </button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition" hoverable>
                  {/* Image */}
                  <div className="relative h-48 mb-4 -m-6 mb-4 overflow-hidden rounded-t-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="primary">{item.category}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-black-900 mb-2">{item.title}</h3>

                  {item.clientName && (
                    <p className="text-sm text-black-600 mb-2">
                      <span className="font-semibold">Client:</span> {item.clientName}
                    </p>
                  )}

                  <p className="text-black-700 line-clamp-2 mb-4">{item.description}</p>

                  {/* Technologies */}
                  <div className="mb-4 pb-4 border-b border-black-100">
                    <p className="text-xs font-semibold text-black-600 mb-2">TECHNOLOGIES</p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-black-600">{item.completedDate}</p>
                    <p className="text-sm font-semibold text-orange-600">{item.budget}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-lg border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={16} />
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioShowcase;
