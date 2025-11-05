import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

const TermsAndConditions = () => {
  const [showScroll, setShowScroll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  });

  const sections = [
    {
      title: '1. Terms of Service',
      content:
        'By accessing and using Osirix, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
    },
    {
      title: '2. Use License',
      content:
        'Permission is granted to temporarily download one copy of the materials (information or software) on Osirix for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
    },
    {
      title: '3. Disclaimer',
      content:
        'The materials on Osirix are provided on an "as is" basis. Osirix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
    },
    {
      title: '4. Limitations',
      content:
        'In no event shall Osirix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Osirix, even if Osirix or an Osirix authorized representative has been notified orally or in writing of the possibility of such damage.',
    },
    {
      title: '5. Accuracy of Materials',
      content:
        'The materials appearing on Osirix could include technical, typographical, or photographic errors. Osirix does not warrant that any of the materials on Osirix are accurate, complete, or current. Osirix may make changes to the materials contained on Osirix at any time without notice.',
    },
    {
      title: '6. Links',
      content:
        'Osirix has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Osirix of the site. Use of any such linked website is at the user\'s own risk.',
    },
    {
      title: '7. Modifications',
      content:
        'Osirix may revise these terms of service for Osirix at any time without notice. By using Osirix, you are agreeing to be bound by the then current version of these terms of service.',
    },
    {
      title: '8. Governing Law',
      content:
        'These terms and conditions are governed by and construed in accordance with the laws of United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.',
    },
    {
      title: '9. User Content',
      content:
        'You are responsible for the content you generate and upload to Osirix. You represent and warrant that you have all necessary rights, licenses, and permissions to use the content you submit. You grant Osirix a license to use, modify, and distribute your content in connection with the service.',
    },
    {
      title: '10. Acceptable Use',
      content:
        'You agree not to use Osirix for any unlawful or prohibited purpose. You agree not to use Osirix to create content that is defamatory, abusive, obscene, or otherwise inappropriate.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-400">Last updated: November 2025</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-8 space-y-8"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-8">
              Welcome to Osirix. These terms and conditions outline the rules and regulations for the use of Osirix website and services. By accessing this website, you accept these terms and conditions in full. Do not continue to use Osirix if you do not accept all of the terms and conditions stated on this page.
            </p>

            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="mb-8 pb-8 border-b border-slate-700 last:border-b-0"
              >
                <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                <p className="text-slate-300 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600"
            >
              <h3 className="text-lg font-bold text-white mb-2">Contact Information</h3>
              <p className="text-slate-300">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="text-purple-400 font-semibold mt-2">support@osirix.com</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full text-white hover:from-purple-700 hover:to-pink-700 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default TermsAndConditions;
