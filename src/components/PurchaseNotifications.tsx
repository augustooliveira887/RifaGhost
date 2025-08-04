import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';

interface Purchase {
  id: string;
  name: string;
  state: string;
  quantity: number;
  timestamp: number;
}

export const PurchaseNotifications: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<Purchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lista de compras simuladas para demonstração
  const mockPurchases: Purchase[] = [
    { id: '1', name: 'João Silva', state: 'SP', quantity: 400, timestamp: Date.now() },
    { id: '2', name: 'Maria Santos', state: 'RJ', quantity: 120, timestamp: Date.now() },
    { id: '3', name: 'Pedro Costa', state: 'MG', quantity: 800, timestamp: Date.now() },
    { id: '4', name: 'Ana Oliveira', state: 'RS', quantity: 160, timestamp: Date.now() },
    { id: '5', name: 'Carlos Ferreira', state: 'PR', quantity: 80, timestamp: Date.now() },
    { id: '6', name: 'Lucia Mendes', state: 'SC', quantity: 200, timestamp: Date.now() },
    { id: '7', name: 'Roberto Lima', state: 'BA', quantity: 400, timestamp: Date.now() },
    { id: '8', name: 'Fernanda Rocha', state: 'CE', quantity: 160, timestamp: Date.now() },
    { id: '9', name: 'Marcos Alves', state: 'PE', quantity: 200, timestamp: Date.now() },
    { id: '10', name: 'Juliana Cardoso', state: 'GO', quantity: 80, timestamp: Date.now() },
  ];

  useEffect(() => {
    const showNotification = () => {
      // Seleciona uma compra aleatória
      const randomPurchase = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
      
      setCurrentNotification(randomPurchase);
      setIsVisible(true);

      // Esconde a notificação após 4 segundos
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentNotification(null);
        }, 500); // Aguarda a animação de saída
      }, 4000);
    };

    // Mostra primeira notificação após 3 segundos
    const initialTimeout = setTimeout(showNotification, 3000);

    // Depois mostra uma notificação a cada 8-15 segundos
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 7000 + 8000); // Entre 8 e 15 segundos

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-4 md:right-auto z-50 transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-3 max-w-xs mx-auto md:mx-0">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 rounded-full p-1.5 flex-shrink-0">
            <ShoppingCart className="w-3 h-3 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 text-xs">
                {currentNotification.name}
              </span>
              <div className="flex items-center text-gray-500 text-xs flex-shrink-0">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                <span className="text-xs">({currentNotification.state})</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">
              acabou de comprar <span className="font-bold text-green-600">
                {currentNotification.quantity} números
              </span>
            </p>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></div>
              <span className="text-xs text-gray-500">há poucos segundos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
