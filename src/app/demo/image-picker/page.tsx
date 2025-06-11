'use client';

import { useState } from 'react';
import BeforeAfterForm from '@/components/forms/BeforeAfterForm';
import ImagePicker from '@/components/ImagePicker';
import { motion } from 'framer-motion';

interface BeforeAfterData {
  beforeImageUrl: string;
  beforeImageAlt: string;
  afterImageUrl: string;
  afterImageAlt: string;
  title: string;
  description: string;
  serviceId?: string;
}

export default function ImagePickerDemo() {
  const [savedData, setSavedData] = useState<BeforeAfterData[]>([]);
  const [singleImage, setSingleImage] = useState<string>('');

  const handleFormSubmit = async (data: BeforeAfterData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSavedData(prev => [...prev, { ...data, serviceId: data.serviceId || 'demo' }]);
    console.log('Form submitted:', data);
  };

  const handleSingleImageChange = (url: string, altText?: string) => {
    setSingleImage(url);
    console.log('Single image selected:', { url, altText });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Picker Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive image selection component with upload, gallery, and URL options. 
            Perfect for medical tourism websites and content management systems.
          </p>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Drag & Drop Upload',
              description: 'Simply drag images from your computer or click to browse and upload',
              icon: '🎯'
            },
            {
              title: 'Gallery Selection',
              description: 'Choose from curated medical stock images with search functionality',
              icon: '🖼️'
            },
            {
              title: 'URL Input',
              description: 'Enter image URLs directly with live preview and validation',
              icon: '🔗'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Single Image Picker Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Single Image Picker</h2>
          <p className="text-gray-600 mb-6">
            Try the image picker component with different selection methods:
          </p>
          
          <div className="max-w-md">
            <ImagePicker
              value={singleImage}
              onChange={handleSingleImageChange}
              label="Profile Picture"
              placeholder="Select your profile image"
              required={true}
            />
          </div>

          {singleImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800 font-medium">✅ Image selected successfully!</p>
              <p className="text-green-600 text-sm mt-1">URL: {singleImage}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Before & After Form Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BeforeAfterForm onSubmit={handleFormSubmit} />
        </motion.div>

        {/* Saved Results */}
        {savedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Saved Results ({savedData.length})
            </h2>
            
            <div className="space-y-8">
              {savedData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Before</p>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.beforeImageUrl}
                          alt={item.beforeImageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {item.beforeImageAlt && (
                        <p className="text-xs text-gray-500 mt-1">Alt: {item.beforeImageAlt}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">After</p>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.afterImageUrl}
                          alt={item.afterImageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {item.afterImageAlt && (
                        <p className="text-xs text-gray-500 mt-1">Alt: {item.afterImageAlt}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gray-900 text-white rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Drag & drop file upload with validation</li>
                <li>• File type and size restrictions</li>
                <li>• Live image preview and cropping</li>
                <li>• Gallery with search functionality</li>
                <li>• URL input with validation</li>
                <li>• Alt text for accessibility</li>
                <li>• Recent uploads memory</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Usage</h3>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">// Basic usage</div>
                <div className="text-gray-300">
                  {'<ImagePicker'}<br/>
                  {'  value={imageUrl}'}<br/>
                  {'  onChange={(url, alt) => {}}'}<br/>
                  {'  label="Choose Image"'}<br/>
                  {'  required={true}'}<br/>
                  {'/>'}<br/>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 