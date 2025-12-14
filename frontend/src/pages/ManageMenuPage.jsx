import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { categories } from '../services/api';

const ManageMenuPage = ({ menuItems, currentUser, onAddMenu, onUpdateMenu, onDeleteMenu }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', category: 'Main Course', price: '', image: '' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddMenu(menuForm);
    setMenuForm({ name: '', category: 'Main Course', price: '', image: '' });
    setShowAddMenu(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onUpdateMenu(editingItem);
    setEditingItem(null);
  };

  const userMenuItems = menuItems.filter(item => item.ownerId === currentUser.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Menu</h2>
        <button
          onClick={() => setShowAddMenu(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>
      
      {showAddMenu && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Menu Item</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={menuForm.name}
                onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Menu item name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={menuForm.category}
                onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rp)</label>
              <input
                type="number"
                required
                value={menuForm.price}
                onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="15000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                required
                value={menuForm.image}
                onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddMenu(false)}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userMenuItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              {editingItem?.id === item.id ? (
                <form onSubmit={handleUpdateSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mb-4">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem({...item})}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteMenu(item.id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenuPage;