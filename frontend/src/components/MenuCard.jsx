import React from 'react';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../services/api';

const MenuCard = ({ item, onAddToCart, isCustomer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition card-hover">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
        <p className="text-2xl font-bold text-orange-600 mb-4">
          {formatCurrency(item.price)}
        </p>
        {isCustomer && (
          <button
            onClick={() => onAddToCart(item)}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;