import { motion } from 'framer-motion';
import { Sparkles, Zap, Users, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to empower creators.',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Automate your workflow and save hours on content creation.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of creators building their brands with Osirix.',
    },
    {
      icon: Target,
      title: 'Growth',
      description: 'Tools and insights to help you reach and monetize your audience.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">About Osirix</h1>
          <p className="text-xl text-slate-400">
            Empowering creators to build, grow, and monetize their social media presence with AI
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Osirix is dedicated to democratizing content creation by making advanced AI tools accessible to creators of all levels. We believe that anyone should be able to create professional-quality content, reach their audience, and build a sustainable income stream without needing a large team or expensive equipment.
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{value.title}</h3>
                  </div>
                  <p className="text-slate-400">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What Makes Osirix Different</h2>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="text-purple-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>AI-Powered Video Generation:</strong> Create professional videos in seconds with advanced AI technology.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-purple-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Multi-Platform Integration:</strong> Post to TikTok, Instagram, YouTube, and more from one dashboard.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-purple-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Built-in Monetization:</strong> Create and sell digital products with integrated Stripe payments.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-purple-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Automation Tools:</strong> Schedule content, use AutoRun workflows, and track analytics automatically.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-purple-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>AI Assistant (Hustler):</strong> Get personalized recommendations and strategy advice from our AI agent.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-slate-400 mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <a
            href="mailto:support@osirix.com"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
