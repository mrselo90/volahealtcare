'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  SocialIcon 
} from 'react-social-icons';

interface SocialMediaSettings {
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  social_youtube: string;
  social_pinterest: string;
  social_twitter: string;
}

export default function SocialMediaSettings() {
  const [settings, setSettings] = useState<SocialMediaSettings>({
    social_instagram: '',
    social_facebook: '',
    social_linkedin: '',
    social_youtube: '',
    social_pinterest: '',
    social_twitter: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/social-media');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching social media settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/social-media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Social media settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating social media settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof SocialMediaSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const socialPlatforms = [
    {
      key: 'social_instagram' as keyof SocialMediaSettings,
      label: 'Instagram',
      placeholder: 'https://instagram.com/yourhandle',
      icon: 'instagram'
    },
    {
      key: 'social_facebook' as keyof SocialMediaSettings,
      label: 'Facebook',
      placeholder: 'https://facebook.com/yourpage',
      icon: 'facebook'
    },
    {
      key: 'social_twitter' as keyof SocialMediaSettings,
      label: 'Twitter/X',
      placeholder: 'https://twitter.com/yourhandle',
      icon: 'twitter'
    },
    {
      key: 'social_linkedin' as keyof SocialMediaSettings,
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/company/yourcompany',
      icon: 'linkedin'
    },
    {
      key: 'social_youtube' as keyof SocialMediaSettings,
      label: 'YouTube',
      placeholder: 'https://youtube.com/yourchannel',
      icon: 'youtube'
    },
    {
      key: 'social_pinterest' as keyof SocialMediaSettings,
      label: 'Pinterest',
      placeholder: 'https://pinterest.com/yourboard',
      icon: 'pinterest'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Media Settings</h1>
        <p className="mt-2 text-gray-600">Manage your social media links displayed on the website</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialPlatforms.map((platform) => (
              <div key={platform.key} className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <SocialIcon 
                    url={`https://${platform.icon}.com`} 
                    style={{ height: 24, width: 24 }} 
                    className="mr-2"
                  />
                  {platform.label}
                </label>
                <input
                  type="url"
                  value={settings[platform.key]}
                  onChange={(e) => handleInputChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="flex space-x-4">
            {socialPlatforms.map((platform) => {
              const url = settings[platform.key];
              return url ? (
                <a
                  key={platform.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <SocialIcon 
                    url={url} 
                    style={{ height: 40, width: 40 }}
                  />
                </a>
              ) : null;
            })}
          </div>
          {socialPlatforms.every(p => !settings[p.key]) && (
            <p className="text-gray-500 text-sm">Add social media URLs to see preview</p>
          )}
        </div>
      </div>
    </div>
  );
} 