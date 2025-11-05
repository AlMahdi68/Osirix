import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  ShoppingCart,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { DigitalProduct, ProductContent } from '../types/index';
import ProductPaymentModal from './ProductPaymentModal';

const DigitalProductCreator = () => {
  const { digitalProducts, addDigitalProduct, updateDigitalProduct, deleteDigitalProduct } =
    useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productType: 'course' as const,
    price: 0,
    content: [] as ProductContent[],
  });
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'text' as const,
    content: '',
  });

  const productTypes = [
    { value: 'course', label: 'Online Course', icon: BookOpen },
    { value: 'ebook', label: 'E-Book', icon: FileText },
    { value: 'template', label: 'Template/Framework', icon: Package },
    { value: 'guide', label: 'Guide/Handbook', icon: FileText },
    { value: 'masterclass', label: 'Masterclass', icon: Video },
  ];

  const contentTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'file', label: 'Download File' },
    { value: 'link', label: 'External Link' },
  ];

  const handleAddContent = () => {
    if (!newContent.title || !newContent.content) {
      alert('Please fill in title and content');
      return;
    }

    const content: ProductContent = {
      id: Date.now().toString(),
      title: newContent.title,
      description: newContent.description,
      type: newContent.type,
      content: newContent.content,
      order: formData.content.length + 1,
    };

    setFormData({
      ...formData,
      content: [...formData.content, content],
    });

    setNewContent({
      title: '',
      description: '',
      type: 'text',
      content: '',
    });
  };

  const handleRemoveContent = (contentId: string) => {
    setFormData({
      ...formData,
      content: formData.content.filter((c) => c.id !== contentId),
    });
  };

  const handleCreateProduct = () => {
    if (!formData.name || !formData.description || formData.price <= 0 || formData.content.length === 0) {
      alert('Please fill in all required fields and add at least one content item');
      return;
    }

    const product: DigitalProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      productType: formData.productType,
      price: formData.price,
      content: formData.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      sales: 0,
      revenue: 0,
      status: 'draft',
    };

    addDigitalProduct(product);
    resetForm();
    setShowCreateModal(false);
  };

  const handleBuyProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      productType: 'course',
      price: 0,
      content: [],
    });
    setNewContent({
      title: '',
      description: '',
      type: 'text',
      content: '',
    });
    setEditingProduct(null);
  };

  const getTotalRevenue = () => {
    return digitalProducts.reduce((sum, p) => sum + p.revenue, 0);
  };

  const getTotalSales = () => {
    return digitalProducts.reduce((sum, p) => sum + p.sales, 0);
  };

  const getProductIcon = (type: string) => {
    const product = productTypes.find((p) => p.value === type);
    return product?.icon || Package;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Digital Product Creator</h1>
              <p className="text-slate-400">Create and sell digital products directly to your audience</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Product
            </motion.button>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-200" />
                <div>
                  <p className="text-purple-100 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{digitalProducts.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-200" />
                <div>
                  <p className="text-green-100 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-white">{getTotalSales()}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-yellow-200" />
                <div>
                  <p className="text-yellow-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">${getTotalRevenue()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {digitalProducts.map((product, idx) => {
            const IconComponent = getProductIcon(product.productType);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{product.name}</h3>
                      <p className="text-purple-100 text-xs">
                        {productTypes.find((p) => p.value === product.productType)?.label}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'published'
                        ? 'bg-green-500/20 text-green-300'
                        : product.status === 'archived'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-slate-600/50 text-slate-300'
                    }`}
                  >
                    {product.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-slate-300 text-sm line-clamp-2">{product.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-lg font-bold text-white">${product.price}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Sales</p>
                      <p className="text-lg font-bold text-white">{product.sales}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="text-lg font-bold text-green-400">${product.revenue}</p>
                    </div>
                  </div>

                  {/* Content Items Count */}
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Content Items</p>
                    <p className="text-sm font-semibold text-white">{product.content.length} items</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleBuyProduct(product)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-semibold">Buy</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => deleteDigitalProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {digitalProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700"
          >
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Digital Products Yet</h3>
            <p className="text-slate-400 mb-6">Create your first digital product and start generating revenue</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create First Product
            </motion.button>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700 my-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create Digital Product</h2>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-white mb-2 block">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Complete TikTok Growth Course"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-white mb-2 block">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your digital product..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-white mb-2 block">
                          Product Type
                        </label>
                        <select
                          value={formData.productType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              productType: e.target.value as
                                | 'course'
                                | 'ebook'
                                | 'template'
                                | 'guide'
                                | 'masterclass',
                            })
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        >
                          {productTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-white mb-2 block">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          placeholder="29.99"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Items */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Content Items</h3>

                  {/* Add Content Form */}
                  <div className="bg-slate-700 rounded-lg p-4 mb-4 space-y-3">
                    <input
                      type="text"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      placeholder="Content title (e.g., Module 1: Getting Started)"
                      className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />

                    <input
                      type="text"
                      value={newContent.description}
                      onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                      placeholder="Brief description"
                      className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newContent.type}
                        onChange={(e) =>
                          setNewContent({
                            ...newContent,
                            type: e.target.value as 'text' | 'video' | 'file' | 'link',
                          })
                        }
                        className="bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                      >
                        {contentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={newContent.content}
                      onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                      placeholder={
                        newContent.type === 'text'
                          ? 'Paste your content here...'
                          : newContent.type === 'video'
                            ? 'Paste YouTube/Vimeo embed URL...'
                            : 'Paste file URL...'
                      }
                      className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      rows={3}
                    />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddContent}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add Content Item
                    </motion.button>
                  </div>

                  {/* Content List */}
                  {formData.content.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">
                        {formData.content.length} content item(s) added
                      </p>
                      {formData.content.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="text-white font-semibold">{idx + 1}. {item.title}</p>
                            <p className="text-xs text-slate-400">{item.type}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveContent(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8 border-t border-slate-700 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateProduct}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg font-semibold"
                >
                  Create Product
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedProduct && (
          <ProductPaymentModal
            product={selectedProduct}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedProduct(null);
            }}
            onPaymentSuccess={(transactionId) => {
              // Update product sales
              updateDigitalProduct(selectedProduct.id, {
                sales: selectedProduct.sales + 1,
                revenue: selectedProduct.revenue + selectedProduct.price,
              });
              setShowPaymentModal(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DigitalProductCreator;
