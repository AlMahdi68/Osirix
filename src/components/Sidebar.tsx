import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  BarChart3,
  Video,
  PieChart,
  Sparkles,
  Zap,
  Brain,
  Link2,
  Calendar,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  FileText,
  Info,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { path: '/', label: 'Dashboard', icon: BarChart3 },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
      ],
    },
    {
      title: 'Content Creation',
      items: [
        { path: '/create', label: 'Video Generator', icon: Video },
        { path: '/character', label: 'Character Creator', icon: Sparkles },
        { path: '/schedule', label: 'Content Scheduler', icon: Calendar },
      ],
    },
    {
      title: 'Automation & Products',
      items: [
        { path: '/agent', label: 'Hustler AI', icon: Brain },
        { path: '/autorun', label: 'AutoRun Agent', icon: Zap },
        { path: '/products', label: 'Digital Products', icon: Package },
        { path: '/product-analytics', label: 'Product Analytics', icon: PieChart },
      ],
    },
    {
      title: 'Growth & Revenue',
      items: [
        { path: '/connections', label: 'Social Connections', icon: Link2 },
        { path: '/monetization', label: 'Monetization', icon: Zap },
        { path: '/pricing', label: 'Pricing Plans', icon: Sparkles },
      ],
    },
    {
      title: 'Information',
      items: [
        { path: '/about', label: 'About', icon: Info },
        { path: '/terms', label: 'Terms & Conditions', icon: FileText },
      ],
    },
    {
      title: 'Account',
      items: [
        { path: '/login', label: 'Login', icon: LogIn },
        { path: '/signup', label: 'Sign Up', icon: UserPlus },
        { path: '/onboarding', label: 'Onboarding', icon: Sparkles },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleExpanded = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-20 z-40 lg:hidden bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg text-white"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen || true && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900 border-r border-slate-700 overflow-y-auto z-30 lg:relative lg:translate-x-0 hidden lg:block"
          >
            <div className="p-4 space-y-6">
              {menuGroups.map((group) => (
                <div key={group.title}>
                  <button
                    onClick={() => toggleExpanded(group.title)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{group.title}</span>
                    <motion.div
                      animate={{ rotate: expandedMenu === group.title ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedMenu === group.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 mt-2"
                      >
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                active
                                  ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-950">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-all mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
