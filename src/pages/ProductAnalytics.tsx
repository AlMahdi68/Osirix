import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  PieChart,
  Calendar,
  Download,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatCurrency, formatNumber } from '../utils/helpers';

const ProductAnalytics = () => {
  const { digitalProducts } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Calculate totals
  const totalRevenue = digitalProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = digitalProducts.reduce((sum, p) => sum + p.sales, 0);
  const avgPrice = digitalProducts.length > 0
    ? digitalProducts.reduce((sum, p) => sum + p.price, 0) / digitalProducts.length
    : 0;
  const totalProducts = digitalProducts.length;

  // Get filtered products
  const filteredProducts = selectedProduct
    ? digitalProducts.filter(p => p.id === selectedProduct)
    : digitalProducts;

  // Simulate detailed analytics data
  const generateAnalyticsData = () => {
    return [
      { day: 'Mon', sales: 12, revenue: 360 },
      { day: 'Tue', sales: 19, revenue: 570 },
      { day: 'Wed', sales: 15, revenue: 450 },
      { day: 'Thu', sales: 25, revenue: 750 },
      { day: 'Fri', sales: 22, revenue: 660 },
      { day: 'Sat', sales: 30, revenue: 900 },
      { day: 'Sun', sales: 28, revenue: 840 },
    ];
  };

  const analyticsData = generateAnalyticsData();
  const maxSales = Math.max(...analyticsData.map(d => d.sales));

  const metrics = [
    {
      icon: ShoppingCart,
      label: 'Total Sales',
      value: formatNumber(totalSales),
      change: '+12%',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+28%',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Price',
      value: formatCurrency(avgPrice),
      change: '+5%',
      color: 'from-purple-600 to-purple-700',
    },
    {
      icon: BarChart3,
      label: 'Total Products',
      value: formatNumber(totalProducts),
      change: '+3',
      color: 'from-orange-600 to-orange-700',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Product Analytics</h1>
              <p className="text-slate-400">Track your digital product performance and revenue</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8"
        >
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${metric.color} rounded-lg p-6 text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-6">Sales Trend</h2>
            <div className="flex items-end justify-between h-64 gap-2">
              {analyticsData.map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.sales / maxSales) * 100}%` }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg hover:from-purple-700 hover:to-pink-700 transition-colors group cursor-pointer relative"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-3 py-1 rounded text-xs text-white whitespace-nowrap">
                    {data.sales} sales
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-sm text-slate-400">
              {analyticsData.map((data) => (
                <span key={data.day}>{data.day}</span>
              ))}
            </div>
          </motion.div>

          {/* Product Filter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Products</h2>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedProduct(null)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedProduct === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                All Products ({totalProducts})
              </motion.button>
              {digitalProducts.map((product) => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedProduct === product.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs mt-1">{product.sales} sales</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Product Table */}
        {digitalProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Product Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}
                      className="border-b border-slate-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-semibold">{product.name}</td>
                      <td className="px-6 py-4 text-slate-400 capitalize">{product.productType}</td>
                      <td className="px-6 py-4 text-right text-white">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right text-white">{product.sales}</td>
                      <td className="px-6 py-4 text-right text-green-400 font-semibold">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'published'
                              ? 'bg-green-500/20 text-green-300'
                              : product.status === 'archived'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-slate-600/50 text-slate-300'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {digitalProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-slate-800 rounded-xl p-12 border border-slate-700 border-dashed text-center"
          >
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No products yet</h3>
            <p className="text-slate-400">Create your first digital product to see analytics</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductAnalytics;
