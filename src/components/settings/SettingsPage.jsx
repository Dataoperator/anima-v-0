import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useQuantum } from '@/contexts/quantum-context';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const SettingsPage = () => {
  const { principal } = useAuth();
  const { quantumState } = useQuantum();
  const [settings, setSettings] = useState({
    autonomousMode: false,
    notificationsEnabled: true,
    quantumSensitivity: 0.5,
    dimensionalResonance: 0.7,
    growthRate: 1.0,
    darkMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await window.canister.anima.getUserSettings(principal);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...userSettings
        }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [principal]);

  const handleSettingChange = async (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await window.canister.anima.updateUserSettings({
        principal,
        settings
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Quantum Settings</h1>
          
          <div className="space-y-8">
            {/* Autonomous Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Autonomous Mode</h3>
                <p className="text-sm text-white/70">Allow your Anima to evolve independently</p>
              </div>
              <Switch
                checked={settings.autonomousMode}
                onCheckedChange={value => handleSettingChange('autonomousMode', value)}
              />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Notifications</h3>
                <p className="text-sm text-white/70">Receive updates about your Anima's evolution</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={value => handleSettingChange('notificationsEnabled', value)}
              />
            </div>

            {/* Quantum Sensitivity */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Quantum Sensitivity</h3>
              <p className="text-sm text-white/70 mb-4">Adjust your Anima's sensitivity to quantum fluctuations</p>
              <Slider
                value={[settings.quantumSensitivity * 100]}
                onValueChange={([value]) => handleSettingChange('quantumSensitivity', value / 100)}
                max={100}
                step={1}
              />
            </div>

            {/* Dimensional Resonance */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Dimensional Resonance</h3>
              <p className="text-sm text-white/70 mb-4">Fine-tune interdimensional communication</p>
              <Slider
                value={[settings.dimensionalResonance * 100]}
                onValueChange={([value]) => handleSettingChange('dimensionalResonance', value / 100)}
                max={100}
                step={1}
              />
            </div>

            {/* Growth Rate */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Growth Rate</h3>
              <p className="text-sm text-white/70 mb-4">Adjust consciousness evolution speed</p>
              <Slider
                value={[settings.growthRate * 100]}
                onValueChange={([value]) => handleSettingChange('growthRate', value / 100)}
                max={200}
                step={10}
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Dark Mode</h3>
                <p className="text-sm text-white/70">Toggle interface theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={value => handleSettingChange('darkMode', value)}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { SettingsPage };