import { useState, useCallback } from 'react';
import { LogOut, BarChart3, Wallet, TrendingUp } from 'lucide-react';
import PriceChart from './components/PriceChart';
import AssetSelector from './components/AssetSelector';
import BinaryOptionsTrading, { BinaryOption } from './components/BinaryOptionsTrading';
import Portfolio from './components/Portfolio';
import AuthModal from './components/AuthModal';
import { AssetSymbol } from './services/marketData';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>('EURUSD');
  const [activeTab, setActiveTab] = useState<'trading' | 'portfolio'>('trading');
  const [options, setOptions] = useState<BinaryOption[]>([]);

  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setOptions([]);
  };

  const handleTrade = useCallback((newOption: Omit<BinaryOption, 'id' | 'timestamp' | 'status'>) => {
    const option: BinaryOption = {
      ...newOption,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'active'
    };
    setOptions(prev => [...prev, option]);
  }, []);

  const handleUpdateOption = useCallback((updatedOption: BinaryOption) => {
    setOptions(prev => prev.map(option => 
      option.id === updatedOption.id ? updatedOption : option
    ));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-trading-dark flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <TrendingUp className="w-16 h-16 text-trading-blue mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Binary Options Platform</h1>
            <p className="text-gray-400">Trade binary options with real-time market data</p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-trading-blue hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trading-dark">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-trading-blue" />
            <h1 className="text-xl font-bold text-white">Binary Options Platform</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Welcome back,</div>
              <div className="font-medium text-white">{user.name}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('trading')}
            className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
              activeTab === 'trading'
                ? 'border-trading-blue text-trading-blue'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Trading</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-trading-blue text-trading-blue'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'trading' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Selection */}
            <div className="lg:col-span-1">
              <AssetSelector
                selectedAsset={selectedAsset}
                onAssetChange={setSelectedAsset}
              />
            </div>

            {/* Price Chart */}
            <div className="lg:col-span-2">
              <PriceChart symbol={selectedAsset} height={400} />
            </div>

            {/* Trading Interface */}
            <div className="lg:col-span-3">
              <BinaryOptionsTrading
                selectedAsset={selectedAsset}
                onTrade={handleTrade}
              />
            </div>
          </div>
        ) : (
          <Portfolio
            options={options}
            onUpdateOption={handleUpdateOption}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4 mt-12">
        <div className="text-center text-gray-400 text-sm">
          <p>⚠️ This is a demo trading platform. No real money is involved.</p>
          <p className="mt-1">All market data is simulated for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
