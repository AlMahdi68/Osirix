import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Loader } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const CharacterCreator = () => {
  const [characterConfig, setCharacterConfig] = useState({
    name: '',
    ethnicity: 'diverse',
    gender: 'neutral',
    style: 'cartoon',
    skinTone: 'medium',
    hairStyle: 'long',
    hairColor: 'brown',
    outfit: 'casual',
    expression: 'friendly',
  });

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const { generateImage } = useAI();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Create a ${characterConfig.style} style digital character:
        Name: ${characterConfig.name || 'Character'}
        Ethnicity: ${characterConfig.ethnicity}
        Gender: ${characterConfig.gender}
        Skin tone: ${characterConfig.skinTone}
        Hair: ${characterConfig.hairColor} ${characterConfig.hairStyle} hair
        Outfit: ${characterConfig.outfit}
        Expression: ${characterConfig.expression}
        High quality, professional 3D render, suitable for social media avatar`;

      const result = await generateImage(prompt);
      setGenerated(result);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const options = {
    ethnicity: ['Diverse', 'Asian', 'African', 'European', 'Latin', 'Middle Eastern'],
    gender: ['Neutral', 'Male', 'Female', 'Androgynous'],
    style: ['Cartoon', 'Anime', 'Realistic', '3D Model', 'Illustrated'],
    skinTone: ['Very Light', 'Light', 'Medium', 'Dark', 'Very Dark'],
    hairStyle: ['Short', 'Medium', 'Long', 'Curly', 'Straight', 'Wavy'],
    hairColor: ['Black', 'Brown', 'Blonde', 'Red', 'Purple', 'Pink'],
    outfit: ['Casual', 'Professional', 'Sporty', 'Formal', 'Futuristic', 'Retro'],
    expression: ['Friendly', 'Serious', 'Happy', 'Confident', 'Mysterious'],
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Character Creator</h1>
          <p className="text-slate-400">Design your AI avatar for social media</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Character Name */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-semibold text-white mb-3">Character Name</label>
              <input
                type="text"
                value={characterConfig.name}
                onChange={(e) => setCharacterConfig({ ...characterConfig, name: e.target.value })}
                placeholder="e.g., Luna, Alex, Dakota"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Customization Options */}
            {Object.entries(characterConfig).filter(([key]) => key !== 'name').map(([key, value]) => (
              <div key={key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <label className="block text-sm font-semibold text-white mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={value as string}
                  onChange={(e) =>
                    setCharacterConfig({
                      ...characterConfig,
                      [key]: e.target.value,
                    })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {options[key as keyof typeof options].map((option) => (
                    <option key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Character
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Character Preview */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 flex flex-col items-center justify-center min-h-96">
              {generated ? (
                <div className="w-full space-y-4">
                  <img
                    src={generated}
                    alt="Generated Character"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Character
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {loading ? 'Creating your character...' : 'Your character will appear here'}
                  </p>
                </div>
              )}
            </div>

            {/* Animation Options */}
            <div className="grid grid-cols-2 gap-4 bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div>
                <h3 className="font-semibold text-white mb-3">Animation Styles</h3>
                <div className="space-y-2">
                  {['Idle', 'Wave', 'Dance', 'Talk'].map((anim) => (
                    <label key={anim} className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                      <input type="checkbox" className="mr-2" defaultChecked={anim === 'Idle'} />
                      {anim}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Expression Presets</h3>
                <div className="space-y-2">
                  {['Happy', 'Serious', 'Excited', 'Confused'].map((expr) => (
                    <label key={expr} className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                      <input type="checkbox" className="mr-2" defaultChecked={expr === 'Happy'} />
                      {expr}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Character Info */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4">Character Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(characterConfig).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-slate-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-white font-medium capitalize">{(value as string).replace(/[-_]/g, ' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
