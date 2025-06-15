import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { DatasetCard } from './DatasetCard';

const mockDatasets = [
  {
    id: '1',
    title: 'Computer Vision Dataset - Street Scenes',
    description: 'High-quality street scene images with detailed annotations for object detection and semantic segmentation. Perfect for autonomous vehicle training.',
    creator: 'VisionLab AI',
    price: 2.5,
    downloads: 1247,
    rating: 4.8,
    size: '15.2 GB',
    format: 'COCO JSON',
    category: 'Computer Vision',
    uploadDate: '2024-01-15',
    tags: ['object-detection', 'autonomous-vehicles', 'street-scenes', 'annotations']
  },
  {
    id: '2',
    title: 'Natural Language Processing - Sentiment Analysis',
    description: 'Comprehensive sentiment analysis dataset with over 100K labeled reviews across multiple domains including e-commerce, movies, and social media.',
    creator: 'TextMining Corp',
    price: 1.8,
    downloads: 892,
    rating: 4.6,
    size: '2.1 GB',
    format: 'CSV/JSON',
    category: 'NLP',
    uploadDate: '2024-01-10',
    tags: ['sentiment-analysis', 'reviews', 'classification', 'text-mining']
  },
  {
    id: '3',
    title: 'Robotics Manipulation Dataset',
    description: 'Robot arm manipulation trajectories with force/torque data for learning dexterous manipulation tasks. Includes both simulation and real-world data.',
    creator: 'RoboTech Labs',
    price: 3.2,
    downloads: 634,
    rating: 4.9,
    size: '8.7 GB',
    format: 'HDF5',
    category: 'Robotics',
    uploadDate: '2024-01-08',
    tags: ['manipulation', 'robotics', 'trajectories', 'force-data']
  },
  {
    id: '4',
    title: 'Medical Imaging - X-Ray Classification',
    description: 'Chest X-ray images with expert annotations for pneumonia detection. Anonymized and HIPAA-compliant dataset for medical AI research.',
    creator: 'MedAI Research',
    price: 4.1,
    downloads: 1156,
    rating: 4.7,
    size: '12.4 GB',
    format: 'DICOM/PNG',
    category: 'Medical AI',
    uploadDate: '2024-01-05',
    tags: ['medical-imaging', 'x-ray', 'pneumonia', 'classification']
  },
  {
    id: '5',
    title: 'Time Series Forecasting - Financial Data',
    description: 'Historical financial market data with technical indicators for algorithmic trading and price prediction models. Updated daily.',
    creator: 'FinanceML',
    price: 2.9,
    downloads: 743,
    rating: 4.5,
    size: '5.3 GB',
    format: 'CSV/Parquet',
    category: 'Finance',
    uploadDate: '2024-01-03',
    tags: ['time-series', 'financial', 'trading', 'forecasting']
  },
  {
    id: '6',
    title: 'Audio Processing - Speech Recognition',
    description: 'Multi-language speech dataset with transcriptions for training speech-to-text models. Includes various accents and speaking conditions.',
    creator: 'SpeechTech AI',
    price: 3.7,
    downloads: 567,
    rating: 4.8,
    size: '22.1 GB',
    format: 'WAV/JSON',
    category: 'Audio AI',
    uploadDate: '2023-12-28',
    tags: ['speech-recognition', 'audio', 'transcription', 'multi-language']
  }
];

export const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Computer Vision', 'NLP', 'Robotics', 'Medical AI', 'Finance', 'Audio AI'];

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dataset Marketplace</h1>
          <p className="text-gray-600">Discover and purchase high-quality datasets for your AI projects</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search datasets, tags, or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredDatasets.length} of {mockDatasets.length} datasets
          </p>
        </div>

        {/* Dataset Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredDatasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};