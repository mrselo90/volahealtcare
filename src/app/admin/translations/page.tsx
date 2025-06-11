'use client';

import { useState, useEffect } from 'react';
import { languages } from '@/lib/i18n/config';
import { RiAddLine, RiSearchLine, RiFilter2Line, RiErrorWarningLine } from 'react-icons/ri';
import { validateTranslationKey, formatTranslationKey, getLanguageDirection } from '@/lib/i18n/utils';
import Link from 'next/link';

interface Translation {
  id: number;
  key: string;
  languageCode: string;
  value: string;
  category: string;
}

interface GroupedTranslation {
  key: string;
  category: string;
  translations: Record<string, string>;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    category: 'common',
    translations: {} as Record<string, string>
  });
  const [keyError, setKeyError] = useState('');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const response = await fetch('/api/admin/translations');
      const data = await response.json();
      setTranslations(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((t: Translation) => t.category)));
      setCategories(['all', ...uniqueCategories]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setLoading(false);
    }
  };

  const handleAddTranslation = async () => {
    // Validate key
    if (!newTranslation.key) {
      setKeyError('Translation key is required');
      return;
    }

    const formattedKey = formatTranslationKey(newTranslation.key);
    if (!validateTranslationKey(formattedKey)) {
      setKeyError('Key can only contain letters, numbers, dots, and underscores');
      return;
    }

    // Check for duplicate key
    if (groupedTranslations.some(t => t.key === formattedKey)) {
      setKeyError('This translation key already exists');
      return;
    }

    try {
      // Create translations for each language
      await Promise.all(
        languages.map(lang =>
          fetch('/api/admin/translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: formattedKey,
              category: newTranslation.category.toLowerCase(),
              languageCode: lang.code,
              value: newTranslation.translations[lang.code] || ''
            })
          })
        )
      );

      setIsAddModalOpen(false);
      setNewTranslation({ key: '', category: 'common', translations: {} });
      setKeyError('');
      fetchTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
    }
  };

  const handleUpdateTranslation = async (id: number, value: string) => {
    try {
      await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value })
      });
    } catch (error) {
      console.error('Error updating translation:', error);
    }
  };

  const handleDeleteTranslation = async (key: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) return;

    try {
      const translationsToDelete = translations.filter(t => t.key === key);
      await Promise.all(
        translationsToDelete.map(t =>
          fetch(`/api/admin/translations?id=${t.id}`, { method: 'DELETE' })
        )
      );
      fetchTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  // Group translations by key
  const groupedTranslations = translations.reduce((acc: GroupedTranslation[], translation) => {
    const existing = acc.find(t => t.key === translation.key);
    if (existing) {
      existing.translations[translation.languageCode] = translation.value;
    } else {
      acc.push({
        key: translation.key,
        category: translation.category,
        translations: { [translation.languageCode]: translation.value }
      });
    }
    return acc;
  }, []);

  // Filter translations
  const filteredTranslations = groupedTranslations.filter(translation => {
    const matchesSearch = translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(translation.translations).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory = selectedCategory === 'all' || translation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Translations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your website's translations across all supported languages
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/translations/test"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Validate Support
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <RiAddLine className="mr-2 h-4 w-4" />
            Add Translation
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Key
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                {languages.map(lang => (
                  <th key={lang.code} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      {lang.name}
                    </span>
                  </th>
                ))}
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTranslations.map((translation) => (
                <tr key={translation.key}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {translation.key}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {translation.category}
                  </td>
                  {languages.map(lang => {
                    const translationId = translations.find(
                      t => t.key === translation.key && t.languageCode === lang.code
                    )?.id;
                    const dir = getLanguageDirection(lang.code);
                    return (
                      <td key={lang.code} className="px-3 py-4 text-sm text-gray-500">
                        <input
                          type="text"
                          value={translation.translations[lang.code] || ''}
                          onChange={(e) => {
                            if (translationId) {
                              handleUpdateTranslation(translationId, e.target.value);
                            }
                          }}
                          dir={dir}
                          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 ${
                            dir === 'rtl' ? 'text-right' : 'text-left'
                          }`}
                        />
                      </td>
                    );
                  })}
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleDeleteTranslation(translation.key)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Translation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-lg font-medium mb-4">Add New Translation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Key</label>
                <input
                  type="text"
                  value={newTranslation.key}
                  onChange={(e) => {
                    setNewTranslation({ ...newTranslation, key: e.target.value });
                    setKeyError('');
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    keyError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                  }`}
                />
                {keyError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <RiErrorWarningLine className="h-4 w-4" />
                    {keyError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={newTranslation.category}
                  onChange={(e) => setNewTranslation({ ...newTranslation, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              {languages.map(lang => {
                const dir = getLanguageDirection(lang.code);
                return (
                  <div key={lang.code}>
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newTranslation.translations[lang.code] || ''}
                      onChange={(e) => setNewTranslation({
                        ...newTranslation,
                        translations: {
                          ...newTranslation.translations,
                          [lang.code]: e.target.value
                        }
                      })}
                      dir={dir}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                        dir === 'rtl' ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                );
              })}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setKeyError('');
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTranslation}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Add Translation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 