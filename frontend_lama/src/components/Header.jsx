import React from 'react';
import { ShoppingCart, User, Store } from 'lucide-react';

const Header = ({ currentUser, cart, onShowAuth, onShowCart, onLogout, activeView, setActiveView }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              FoodHub
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.role === 'customer' && (
                  <button
                    onClick={onShowCart}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                )}
                
                <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">{currentUser.name}</span>
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onShowAuth}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
        
        {currentUser && (
          <nav className="flex space-x-2 mt-4">
            <button
              onClick={() => setActiveView('menu')}
              className={`px-4 py-2 rounded-lg transition ${
                activeView === 'menu' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`px-4 py-2 rounded-lg transition ${
                activeView === 'orders' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {currentUser.role === 'customer' ? 'My Orders' : 'Incoming Orders'}
            </button>
            {currentUser.role === 'owner' && (
              <button
                onClick={() => setActiveView('manage')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeView === 'manage' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manage Menu
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;