'use client';

import { useState } from 'react';
import { Language, languages } from '@/lib/i18n/config';
import { 
  getBrowserLanguage, 
  getLanguageDirection, 
  formatTranslationKey, 
  validateTranslationKey,
  interpolateTranslation,
  bidiText 
} from '@/lib/i18n/utils';

export default function LanguageTest() {
  const [testResults, setTestResults] = useState<{
    name: string;
    status: 'success' | 'error';
    message: string;
  }[]>([]);

  const runTests = async () => {
    const results = [];

    // Test 1: Language Configuration
    try {
      const hasAllLanguages = ['en', 'tr', 'es', 'pt', 'de', 'fr', 'ru', 'ro', 'it', 'pl', 'ar']
        .every(code => languages.some(lang => lang.code === code));
      
      results.push({
        name: 'Language Configuration',
        status: hasAllLanguages ? 'success' : 'error',
        message: hasAllLanguages 
          ? 'All required languages are configured'
          : 'Missing some required languages'
      });
    } catch (error) {
      results.push({
        name: 'Language Configuration',
        status: 'error',
        message: 'Error testing language configuration'
      });
    }

    // Test 2: RTL Support
    try {
      const arabicLang = languages.find(lang => lang.code === 'ar');
      const hasRTLSupport = arabicLang?.dir === 'rtl';
      
      results.push({
        name: 'RTL Support',
        status: hasRTLSupport ? 'success' : 'error',
        message: hasRTLSupport 
          ? 'RTL support is properly configured'
          : 'RTL support is missing for Arabic'
      });
    } catch (error) {
      results.push({
        name: 'RTL Support',
        status: 'error',
        message: 'Error testing RTL support'
      });
    }

    // Test 3: Translation Key Formatting
    try {
      const testKey = 'Hello World Test';
      const formattedKey = formatTranslationKey(testKey);
      const isValid = validateTranslationKey(formattedKey);
      
      results.push({
        name: 'Translation Key Formatting',
        status: isValid ? 'success' : 'error',
        message: isValid 
          ? 'Key formatting and validation working correctly'
          : 'Key formatting or validation failed'
      });
    } catch (error) {
      results.push({
        name: 'Translation Key Formatting',
        status: 'error',
        message: 'Error testing key formatting'
      });
    }

    // Test 4: Text Interpolation
    try {
      const template = 'Hello {{name}}, you have {{count}} messages';
      const params = { name: 'John', count: 5 };
      const result = interpolateTranslation(template, params);
      const isCorrect = result === 'Hello John, you have 5 messages';
      
      results.push({
        name: 'Text Interpolation',
        status: isCorrect ? 'success' : 'error',
        message: isCorrect 
          ? 'Text interpolation working correctly'
          : 'Text interpolation failed'
      });
    } catch (error) {
      results.push({
        name: 'Text Interpolation',
        status: 'error',
        message: 'Error testing text interpolation'
      });
    }

    // Test 5: Bidirectional Text
    try {
      const arabicText = 'مرحبا بكم';
      const rtlText = bidiText(arabicText, 'ar');
      const hasRTLMarkers = rtlText.includes('\u202B') && rtlText.includes('\u202C');
      
      results.push({
        name: 'Bidirectional Text',
        status: hasRTLMarkers ? 'success' : 'error',
        message: hasRTLMarkers 
          ? 'Bidirectional text support working correctly'
          : 'Bidirectional text support failed'
      });
    } catch (error) {
      results.push({
        name: 'Bidirectional Text',
        status: 'error',
        message: 'Error testing bidirectional text'
      });
    }

    // Test 6: API Integration
    try {
      const response = await fetch('/api/admin/translations');
      const isOk = response.ok;
      
      results.push({
        name: 'API Integration',
        status: isOk ? 'success' : 'error',
        message: isOk 
          ? 'API endpoints are accessible'
          : 'API endpoints are not accessible'
      });
    } catch (error) {
      results.push({
        name: 'API Integration',
        status: 'error',
        message: 'Error testing API integration'
      });
    }

    setTestResults(results);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Language Support Test</h1>
        <button
          onClick={runTests}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Run Tests
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <h3 className="font-medium text-gray-900">{result.name}</h3>
            </div>
            <p className={`mt-1 text-sm ${
              result.status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
          </div>
        ))}

        {testResults.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Click "Run Tests" to validate language support
          </p>
        )}
      </div>
    </div>
  );
} 