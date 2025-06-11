'use client';

import { useState } from 'react';
import { RiSaveLine } from 'react-icons/ri';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Aesthetic Care Istanbul',
    contactEmail: 'contact@aestheticcare.com',
    phoneNumber: '+90 555 123 4567',
    address: 'Istanbul, Turkey',
    socialMedia: {
      facebook: 'https://facebook.com/aestheticcare',
      instagram: 'https://instagram.com/aestheticcare',
      youtube: 'https://youtube.com/aestheticcare',
      tiktok: 'https://tiktok.com/@aestheticcare',
      twitter: 'https://twitter.com/aestheticcare',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Implement settings update API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

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
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
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
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="tiktok" className="block text-sm font-medium text-gray-900">
                TikTok URL
              </label>
              <input
                type="url"
                name="tiktok"
                id="tiktok"
                value={settings.socialMedia.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, tiktok: e.target.value },
                  })
                }
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
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50"
          >
            <RiSaveLine className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 