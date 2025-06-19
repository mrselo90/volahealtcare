'use client';

import { useState, useEffect } from 'react';
import { RiSaveLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri';

interface Settings {
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    trustpilot: string;
    googlemaps: string;
    linkedin: string;
    pinterest: string;
  };
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      trustpilot: '',
      googlemaps: '',
      linkedin: '',
      pinterest: '',
    },
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <RiCheckLine className="h-5 w-5 text-green-400" />
              ) : (
                <RiErrorWarningLine className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">General Settings</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Basic information about your medical tourism website.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-900">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-900">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                name="contactPhone"
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Site Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                placeholder="Brief description of your medical tourism services..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Social Media</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Your social media presence and links.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-900">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-900">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="youtube" className="block text-sm font-medium text-gray-900">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtube"
                id="youtube"
                value={settings.socialMedia.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/@volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-900">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter"
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="trustpilot" className="block text-sm font-medium text-gray-900">
                Trustpilot URL
              </label>
              <input
                type="url"
                name="trustpilot"
                id="trustpilot"
                value={settings.socialMedia.trustpilot}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, trustpilot: e.target.value },
                  })
                }
                placeholder="https://www.trustpilot.com/review/volahealthistanbul.com"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="googlemaps" className="block text-sm font-medium text-gray-900">
                Google Maps URL
              </label>
              <input
                type="url"
                name="googlemaps"
                id="googlemaps"
                value={settings.socialMedia.googlemaps}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, googlemaps: e.target.value },
                  })
                }
                placeholder="https://maps.google.com/..."
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-900">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={settings.socialMedia.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/company/volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="pinterest" className="block text-sm font-medium text-gray-900">
                Pinterest URL
              </label>
              <input
                type="url"
                name="pinterest"
                id="pinterest"
                value={settings.socialMedia.pinterest}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, pinterest: e.target.value },
                  })
                }
                placeholder="https://pinterest.com/volahealthistanbul"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiSaveLine className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 