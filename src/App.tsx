import React, { useState, useEffect } from 'react';
import { gerarPix, verificarStatusPagamento } from './services/pixService';
import { PixResponse } from './types';
import { 
  Gift, 
  Clock, 
  Users, 
  Shield, 
  Star, 
  Sparkles, 
  Trophy,
  Car,
  Zap,
  Heart,
  CheckCircle,
  Crown,
  Medal,
  Award,
  CreditCard,
  Clover,
  User,
  Search,
  Copy,
  Download
} from 'lucide-react';
import { ScarcityAlert } from './components/ScarcityAlert';
import { PurchaseNotifications } from './components/PurchaseNotifications';

function App() {
  const [activeTab, setActiveTab] = useState('comprar');
  const [utmParams, setUtmParams] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseData, setPurchaseData] = useState({
    cpf: '',
    telefone: ''
  });
  const [cpfValidation, setCpfValidation] = useState({
    isValid: null,
    isLoading: false,
    userData: null,
    error: ''
  });
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid' | 'error'>('pending');
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const [consultaNumero, setConsultaNumero] = useState('');
  const [consultaResultado, setConsultaResultado] = useState('');

  // Dados da rifa para o aviso de escassez
  const totalNumbers = 100000; // Total de números da rifa
  const soldNumbers = 87500; // Números já vendidos (87.5% vendidos = 12.5% restantes)
  
  // Extract UTM parameters from current URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'click_id', 'fbclid', 'gclid'];
    const params = new URLSearchParams();
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        params.append(key, value);
      }
    });
    
    setUtmParams(params.toString());
  }, []);

  // Função para iniciar verificação de status do pagamento
  const startPaymentStatusCheck = (transactionId: string) => {
    setPaymentStatus('checking');
    
    const interval = setInterval(async () => {
      try {
        const status = await verificarStatusPagamento(transactionId);
        console.log('Status do pagamento:', status);
        
        if (status === 'paid' || status === 'approved' || status === 'completed') {
          setPaymentStatus('paid');
          clearInterval(interval);
          
          // Aguardar 2 segundos para mostrar a confirmação e depois redirecionar
          setTimeout(() => {
            window.location.href = 'https://rifasupervip.site';
          }, 2000);
        } else if (status === 'cancelled' || status === 'failed') {
          setPaymentStatus('error');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 5000); // Verificar a cada 5 segundos
    
    setStatusCheckInterval(interval);
    
    // Parar verificação após 30 minutos
    setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'checking') {
        setPaymentStatus('pending');
      }
    }, 30 * 60 * 1000);
  };

  // Limpar interval quando componente for desmontado
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);
  // Function to append UTM parameters to checkout URLs
  const getCheckoutUrl = (baseUrl: string) => {
    if (utmParams) {
      return `${baseUrl}?${utmParams}`;
    }
    return baseUrl;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const packages = [
    { price: 20, numbers: 80, popular: false },
    { price: 30, numbers: 120, popular: false },
    { price: 40, numbers: 160, popular: true },
    { price: 50, numbers: 200, popular: false },
    { price: 100, numbers: 400, popular: false },
    { price: 200, numbers: 800, popular: false }
  ];

  // Dados simulados do ranking
  const [rankingData] = useState([
    { 
      id: 1, 
      name: "Carlos M.", 
      cotas: 847, 
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: 2, 
      name: "Ana S.", 
      cotas: 623, 
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: 3, 
      name: "João P.", 
      cotas: 589, 
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: 4, 
      name: "Maria L.", 
      cotas: 445, 
      avatar: "https://i.imgur.com/a8Ll7WD.jpeg"
    },
    { 
      id: 5, 
      name: "Pedro R.", 
      cotas: 398, 
      avatar: "https://i.imgur.com/X4Wa0FH.png"
    },
    { 
      id: 6, 
      name: "Lucia F.", 
      cotas: 367, 
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: 7, 
      name: "Roberto C.", 
      cotas: 289, 
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: 8, 
      name: "Fernanda B.", 
      cotas: 234, 
      avatar: "https://i.imgur.com/4TP8BfM.png"
    }
  ]);

  const maxCotas = Math.max(...rankingData.map(item => item.cotas));

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-white">{position}º</span>;
    }
  };

  const getRankEmoji = (position: number) => {
    switch (position) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `${position}º`;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700";
      default:
        return "bg-gradient-to-r from-green-500 to-green-600";
    }
  };

  // Dados dos ganhadores passados
  const pastWinners = [
    {
      id: 1,
      name: "Roberto Silva",
      prize: "Civic 0KM + R$5.000",
      date: "04/06/2025",
      photo: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      numbers: "0847, 1523, 2891"
    },
    {
      id: 2,
      name: "Marina Costa",
      prize: "Corolla + Moto Honda",
      date: "02/05/2025",
      photo: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      numbers: "3456, 7890, 1234"
    },
    {
      id: 3,
      name: "José Santos",
      prize: "HRV 0KM + R$3.000",
      date: "27/03/2025",
      photo: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      numbers: "5678, 9012, 3456"
    },
    {
      id: 4,
      name: "Carla Oliveira",
      prize: "Fit 0KM + Notebook",
      date: "20/02/2025",
      photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      numbers: "7890, 1234, 5678"
    }
  ];

  const handleConsultar = () => {
    if (consultaNumero.trim()) {
      setConsultaResultado('participando');
    }
  };

  const handlePurchaseClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
    setPurchaseData({ cpf: '', telefone: '' });
    setCpfValidation({ isValid: null, isLoading: false, userData: null, error: '' });
  };

  const handleClosePixModal = () => {
    setShowPixModal(false);
    setPixData(null);
    setPaymentStatus('pending');
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    handleClosePurchaseModal();
  };

  // Função para validar CPF via API
  const validateCPF = async (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      setCpfValidation({ isValid: false, isLoading: false, userData: null, error: 'CPF deve ter 11 dígitos' });
      return;
    }

    setCpfValidation(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const token = '95150b0b9cc3dcb0ae0b24a66514a8360cb293324fb65ffb76f783133018cfc8';
      const response = await fetch(`https://api.dataget.site/api/v1/cpf/${cpfLimpo}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }
      
      setCpfValidation({
        isValid: true,
        isLoading: false,
        userData: data,
        error: ''
      });
    } catch (error) {
      console.error('Erro ao consultar CPF:', error);
      setCpfValidation({
        isValid: false,
        isLoading: false,
        userData: null,
        error: 'CPF inválido'
      });
    }
  };

  const handleInputChange = async (field, value) => {
    if (field === 'cpf') {
      // Formatação do CPF
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      
      // Validar CPF quando tiver 11 dígitos
      const cpfLimpo = value.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        await validateCPF(value);
      } else {
        setCpfValidation({ isValid: null, isLoading: false, userData: null, error: '' });
      }
    }
    
    if (field === 'telefone') {
      // Formatação do telefone
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    
    setPurchaseData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchaseSubmit = async () => {
    if (!purchaseData.cpf || !purchaseData.telefone) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    if (purchaseData.cpf.replace(/\D/g, '').length !== 11) {
      alert('CPF deve ter 11 dígitos!');
      return;
    }
    
    if (!cpfValidation.isValid) {
      alert('CPF inválido! Verifique os dados informados.');
      return;
    }
    
    if (purchaseData.telefone.replace(/\D/g, '').length < 10) {
      alert('Telefone inválido!');
      return;
    }
    
    setIsGeneratingPix(true);
    
    try {
      const userData = cpfValidation.userData;
      const cpfLimpo = purchaseData.cpf.replace(/\D/g, '');
      const telefoneLimpo = purchaseData.telefone.replace(/\D/g, '');
      const amountCentavos = selectedPackage.price * 100; // Converter para centavos
      const itemName = `${selectedPackage.numbers} números da Super Rifa`;
      
      // Gerar email baseado no nome se não tiver
      const email = userData?.email || `${userData?.nome?.toLowerCase().replace(/\s+/g, '')}@email.com` || 'cliente@superrifa.com';

      
      const pixResponse = await gerarPix(
        userData?.nome || 'Cliente',
        email,
        cpfLimpo,
        telefoneLimpo,
        amountCentavos,
        itemName,
         utmParams
      );
      
      setPixData(pixResponse);
      setShowPixModal(true);
      
      // Iniciar verificação de status do pagamento
      startPaymentStatusCheck(pixResponse.id);
      
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      alert(`Erro ao gerar PIX: ${error.message}`);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.pixCode) {
      navigator.clipboard.writeText(pixData.pixCode);
      alert('Código PIX copiado!');
    }
  };

  const downloadQRCode = () => {
    if (pixData?.pixQrCode) {
      const link = document.createElement('a');
      link.href = pixData.pixQrCode;
      link.download = 'qrcode-pix.png';
      link.click();
    }
  };

    const userData = cpfValidation.userData;

  const renderContent = () => {
    switch (activeTab) {
      case 'comprar':
        return renderMainContent();
      case 'consultar':
        return renderConsultarContent();
      case 'ranking':
        return renderRankingContent();
      case 'resultados':
        return renderResultadosContent();
      case 'sobre':
        return renderSobreContent();
      default:
        return renderMainContent();
    }
  };

  const renderMainContent = () => (
    <>
      {/* Prize Banner */}
      <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-1 shadow-2xl animate-pulse">
        <div className="bg-white rounded-xl p-6 text-center">
          {/* Promotional Banner */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-sm py-2 px-4 rounded-lg mb-4 animate-pulse">
            🔥 PROMOÇÃO ESPECIAL: NÚMEROS EM DOBRO! 🔥
          </div>
          
          <div className="mb-4">
            <h2 className="text-2xl font-black text-green-800 mb-2">
              🎁 CONCORRA A UMA 🎁
            </h2>
            <div className="text-3xl font-black text-green-900 mb-2">
              SW4 0KM + MOTO BMW
            </div>
            <div className="text-lg font-bold text-red-600">
              POR APENAS R$0,25 POR NÚMERO!
            </div>
          </div>
          
          {/* Prize Images */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="/sw4-car.jpg"
                alt="SW4 0KM"
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-bold">SW4 0KM</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://i.imgur.com/Oo1UBgb.jpeg" 
                alt="Moto BMW"
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-bold">Moto BMW</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso de Escassez */}
      <ScarcityAlert totalNumbers={totalNumbers} soldNumbers={soldNumbers} />

      {/* Countdown Timer */}
      <div className="mt-6 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-6 h-6 animate-spin" />
            <h3 className="text-lg font-black">O GRANDE SORTEIO ACONTECE EM:</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-white/20 rounded-lg p-2">
              <div className="text-2xl font-black">{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className="text-xs">DIAS</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="text-2xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-xs">HORAS</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="text-2xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-xs">MIN</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="text-2xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs">SEG</div>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-bold mb-1">📍 Transmissão ao vivo no Instagram oficial</p>
            <p className="text-red-100">🔍 Sorteio auditado pela LOTEP</p>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-black text-center text-white mb-6">
          🎟️ ESCOLHA SEU PACOTE 🎟️
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-4 shadow-2xl transition-all duration-300 hover:scale-105 ${
                pkg.popular 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 ring-4 ring-yellow-300' 
                  : 'bg-gradient-to-br from-green-400 to-green-500'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  POPULAR
                </div>
              )}
              
              <div className="text-center text-white">
                <div className="text-2xl font-black mb-1">
                  R${pkg.price}
                </div>
                <div className="text-lg font-bold mb-2">
                  {pkg.numbers} números
                </div>
                <div className="text-sm mb-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    PROMOCIONAL!
                  </span>
                </div>
                <div className="text-sm mb-3">
                  Apenas R$0,25 por número
                </div>
                
                <button 
                  onClick={() => handlePurchaseClick(pkg)}
                  className="w-full bg-white text-green-800 font-bold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  COMPRAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-6 h-6" />
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-xl font-black mb-1">
            + 40 MIL PARTICIPANTES ATIVOS
          </p>
          <p className="text-sm text-blue-100">
            ✅ Prêmios já entregues com transparência e segurança
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 space-y-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-bold">Sorteio 100% Transparente</p>
              <p className="text-sm text-green-100">Transmissão ao vivo no Instagram</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-bold">Pagamento Seguro</p>
              <p className="text-sm text-green-100">Checkout protegido e confiável</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-bold">Entrega Garantida</p>
              <p className="text-sm text-green-100">Prêmios entregues com segurança</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4">
        <div className="text-center text-white text-sm space-y-2">
          <p className="font-bold">📄 INFORMAÇÕES IMPORTANTES</p>
          <p>• Este sorteio não envolve premiação em dinheiro</p>
          <p>• Cotas limitadas disponíveis</p>
          <p>• Produto 100% legalizado e auditado</p>
          <p>• Participação mediante compra de números</p>
        </div>
      </div>

      {/* Kwai Disclaimer */}
      <div className="mt-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4">
        <p className="text-gray-300 text-xs text-center leading-relaxed">
          Esta página não faz parte ou está relacionada ao Kwai ou a Kuaishou Technology. 
          Além disso, este site NÃO é endossado pelo Kwai de forma alguma.
        </p>
      </div>

      {/* Legal Information */}
      <div className="mt-6 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-600">
        <div className="text-center text-gray-200 text-xs leading-relaxed space-y-2">
          <p className="font-bold text-yellow-300 mb-3">📋 INFORMAÇÕES LEGAIS</p>
          <p>
            Super Rifa, operada por <span className="font-semibold">SR Promoções e Intermediação de Negócios LTDA</span>, 
            inscrita no CNPJ nº <span className="font-semibold">45.123.789/0001-65</span>, atua com autorização 
            Nº <span className="font-semibold">0035/2024</span> da <span className="font-semibold">LOTERIA DO ESTADO DO ACRE (LACRE)</span>, 
            conforme regulamentado pela Lei Estadual nº 3.215/2023.
          </p>
          <p>
            O sorteio final será realizado em sessão pública, nas dependências oficiais da LACRE, 
            com total transparência e auditoria registrada.
          </p>
        </div>
      </div>

      {/* Modal de Compra */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl max-h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-green-800">
                🎟️ FINALIZAR COMPRA
              </h2>
              <button 
                onClick={handleClosePurchaseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Pacote Selecionado */}
            {selectedPackage && (
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <div className="text-base font-bold text-green-800">
                    {selectedPackage.numbers} números
                  </div>
                  <div className="text-xl font-black text-green-900">
                    R${selectedPackage.price}
                  </div>
                  <div className="text-sm text-green-700">
                    Apenas R$0,25 por número
                  </div>
                </div>
              </div>
            )}

            {/* Formulário */}
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-sm">
                  CPF *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={purchaseData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    className={`w-full p-2.5 border-2 rounded-lg outline-none text-sm transition-colors ${
                      cpfValidation.isValid === null 
                        ? 'border-gray-300 focus:border-green-500' 
                        : cpfValidation.isValid 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                    }`}
                  />
                  {cpfValidation.isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    </div>
                  )}
                  {cpfValidation.isValid === true && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                {cpfValidation.error && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {cpfValidation.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 text-sm">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={purchaseData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  maxLength="15"
                  className="w-full p-2.5 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Botão de Continuar */}
            <button
              onClick={handlePurchaseSubmit}
              disabled={!cpfValidation.isValid || cpfValidation.isLoading || isGeneratingPix}
              className={`w-full mt-4 font-black py-2.5 px-6 rounded-lg transition-all duration-200 ${
                cpfValidation.isValid && !cpfValidation.isLoading && !isGeneratingPix
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {cpfValidation.isLoading ? 'VALIDANDO...' : isGeneratingPix ? 'GERANDO PIX...' : 'CONTINUAR COMPRA'}
            </button>

            {/* Informação de Segurança */}
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                <Shield className="w-4 h-4" />
                <span>Seus dados estão protegidos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal do PIX */}
      {showPixModal && pixData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl max-h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-green-800">
                💳 PAGAMENTO PIX
              </h2>
              <button 
                onClick={handleClosePixModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Informações do Pedido */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-black text-green-900 mb-1">
                  {selectedPackage?.numbers} números
                </div>
                <div className="text-2xl font-black text-green-800">
                  R${selectedPackage?.price}
                </div>
                <div className="text-sm text-green-700">
                  ID: {pixData.id}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img 
                  src={pixData.pixQrCode} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Escaneie o QR Code com seu app do banco
              </p>
            </div>

            {/* Código PIX */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                Ou copie o código PIX:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pixData.pixCode}
                  readOnly
                  className="flex-1 p-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-xs font-mono"
                />
                <button
                  onClick={copyPixCode}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button
                onClick={downloadQRCode}
                className="w-full bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                BAIXAR QR CODE
              </button>
              
              <button
                onClick={copyPixCode}
                className="w-full bg-green-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                COPIAR CÓDIGO PIX
              </button>
            </div>

            {/* Instruções */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">📋 Instruções:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Abra o app do seu banco</li>
                <li>• Escolha a opção PIX</li>
                <li>• Escaneie o QR Code ou cole o código</li>
                <li>• Confirme o pagamento</li>
                <li>• Seus números serão enviados por WhatsApp</li>
              </ul>
            </div>

            {/* Status */}
            <div className="mt-4 text-center">
              {paymentStatus === 'pending' && (
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <div className="animate-pulse w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Aguardando pagamento...</span>
                </div>
              )}
              
              {paymentStatus === 'checking' && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm font-medium">Verificando pagamento...</span>
                </div>
              )}
              
              {paymentStatus === 'paid' && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Pagamento confirmado! Redirecionando...</span>
                </div>
              )}
              
              {paymentStatus === 'error' && (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Erro no pagamento. Tente novamente.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderConsultarContent = () => (
    <div className="mt-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-2xl font-black text-white text-center mb-6">
          🔍 CONSULTAR NÚMEROS
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-bold mb-2">Digite seu número:</label>
            <input 
              type="text" 
              placeholder="Ex: 12345"
              value={consultaNumero}
              onChange={(e) => setConsultaNumero(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-green-400 focus:border-yellow-400 outline-none text-lg font-bold text-center"
            />
          </div>
          
          <button 
            onClick={handleConsultar}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-3 px-6 rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-200"
          >
            CONSULTAR NÚMERO
          </button>
        </div>
        
        {consultaResultado === 'participando' && (
          <div className="mt-6 p-4 bg-green-500/20 rounded-lg border-2 border-green-400">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">✅ PARABÉNS!</h3>
              <p className="text-green-100 text-sm">
                Seu número <span className="font-bold text-yellow-300">{consultaNumero}</span> está participando do sorteio!
              </p>
              <p className="text-green-100 text-xs mt-2">
                🍀 Boa sorte! O sorteio será transmitido ao vivo no nosso Instagram.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
          <p className="text-white text-sm text-center">
            💡 Digite o número que você comprou para verificar se está participando do sorteio
          </p>
        </div>
      </div>
    </div>
  );

  const renderRankingContent = () => (
    <div className="mt-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white mb-2">
          🔥 RANKING COMPRADORES 🔥
        </h3>
        <p className="text-yellow-300 text-sm font-bold animate-pulse">
          💸 LÍDER GANHA R$10.000,00 EXTRA! 💸
        </p>
      </div>

      <div className="space-y-2">
        {rankingData.map((participant, index) => {
          const position = index + 1;
          const progressPercentage = (participant.cotas / maxCotas) * 100;
          const isTopThree = position <= 3;
          
          return (
            <div
              key={participant.id}
              className={`relative rounded-xl p-3 shadow-xl transition-all duration-300 hover:scale-105 ${
                isTopThree 
                  ? `${getRankBg(position)} ring-4 ring-white/30` 
                  : 'bg-gradient-to-r from-green-600 to-green-700'
              }`}
            >
              {position === 1 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-red-800 text-xs font-black px-2 py-1 rounded-full animate-bounce">
                  R$10K
                </div>
              )}
              
              <div className="flex items-center gap-3">
                {/* Position */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {isTopThree ? getRankIcon(position) : (
                    <span className="text-sm font-bold text-white">{position}º</span>
                  )}
                </div>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={participant.avatar} 
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-white font-bold text-base">
                        {getRankEmoji(position)} {participant.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {participant.cotas} cotas compradas
                      </p>
                    </div>
                    {position === 1 && (
                      <div className="text-right">
                        <p className="text-yellow-300 text-xs font-black animate-pulse">💰 R$10K</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        position === 1 
                          ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse' 
                          : 'bg-gradient-to-r from-white to-yellow-300'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Ranking Footer */}
      <div className="mt-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-3">
        <div className="text-center text-white">
          <p className="text-sm font-bold mb-1 text-yellow-300">🚀 COMPRE MAIS E GANHE R$10.000,00! 🚀</p>
          <p className="text-xs text-orange-100">
            💡 Ranking atualizado em tempo real<br/>
            🏆 Prêmio de R$10K entregue junto com os prêmios principais<br/>
            ⚡ Quanto mais números, maior sua chance de liderar!
          </p>
        </div>
      </div>
    </div>
  );

  const renderResultadosContent = () => (
    <div className="mt-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2">
          🏆 GANHADORES ANTERIORES 🏆
        </h2>
        <p className="text-green-100 text-sm">
          Veja quem já foi contemplado em nossos sorteios!
        </p>
      </div>

      <div className="space-y-4">
        {pastWinners.map((winner) => (
          <div
            key={winner.id}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <img 
                src={winner.photo} 
                alt={winner.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-yellow-400"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-bold text-lg">{winner.name}</h3>
                </div>
                
                <p className="text-yellow-300 font-bold text-sm mb-1">
                  🎁 {winner.prize}
                </p>
                
                <p className="text-green-100 text-xs mb-2">
                  📅 Sorteado em: {winner.date}
                </p>
                
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-white text-xs">
                    🎯 Números sorteados: <span className="font-bold">{winner.numbers}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4">
        <div className="text-center text-white">
          <h3 className="font-black text-lg mb-2">🎉 PRÓXIMO PODE SER VOCÊ! 🎉</h3>
          <p className="text-sm">
            Todos os nossos sorteios são transmitidos ao vivo e auditados pela LOTEP.
            Transparência total para nossos participantes!
          </p>
        </div>
      </div>
    </div>
  );

  const renderSobreContent = () => (
    <div className="mt-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-2xl font-black text-white text-center mb-6">
          👥 SOBRE NÓS
        </h2>
        
        <div className="space-y-6 text-white">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Super Rifa</h3>
            <p className="text-green-100 text-sm">
              A plataforma de sorteios mais confiável do Brasil
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h4 className="font-bold">Transparência Total</h4>
                <p className="text-sm text-green-100">
                  Todos os sorteios são transmitidos ao vivo no Instagram e auditados pela LOTEP
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h4 className="font-bold">Segurança Garantida</h4>
                <p className="text-sm text-green-100">
                  Pagamentos processados com total segurança e criptografia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h4 className="font-bold">Prêmios Entregues</h4>
                <p className="text-sm text-green-100">
                  Mais de 100 ganhadores já contemplados com prêmios incríveis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h4 className="font-bold">Suporte 24/7</h4>
                <p className="text-sm text-green-100">
                  Nossa equipe está sempre disponível para ajudar você
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4">
            <h4 className="font-bold mb-2">📞 Entre em Contato</h4>
            <p className="text-sm text-green-100 mb-2">
              Email: contato@superrifa.com<br/>
              Instagram: @superrifa_oficial
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 animate-bounce">
          <Sparkles className="text-yellow-400 w-8 h-8" />
        </div>
        <div className="absolute top-32 right-8 animate-pulse">
          <Star className="text-yellow-300 w-6 h-6" />
        </div>
        <div className="absolute top-60 left-8 animate-spin">
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 right-4 animate-bounce delay-200">
          <Trophy className="text-yellow-500 w-7 h-7" />
        </div>
        <div className="absolute bottom-60 left-6 animate-pulse delay-300">
          <Zap className="text-yellow-400 w-5 h-5" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-green-600 to-green-700 shadow-2xl">
        <div className="px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* Logo Circle */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                <div className="text-center">
                  <div className="text-white font-black text-xs leading-tight">
                    SUPER
                  </div>
                  <div className="text-yellow-300 font-black text-xs leading-tight">
                    RIFA
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            </div>
            
            {/* Main Title */}
            <div className="text-left">
              <h1 className="text-3xl font-black text-white leading-tight">
                SUPER
              </h1>
              <h1 className="text-3xl font-black text-yellow-400 leading-tight -mt-1">
                RIFA
              </h1>
            </div>
          </div>
          <p className="text-green-100 text-sm font-medium">
            🍀 Sua sorte está aqui! 🍀
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-700 shadow-2xl z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <button
            onClick={() => setActiveTab('comprar')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              activeTab === 'comprar' 
                ? 'bg-yellow-400 text-green-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Clover className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Comprar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('consultar')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              activeTab === 'consultar' 
                ? 'bg-yellow-400 text-green-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Consultar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              activeTab === 'ranking' 
                ? 'bg-yellow-400 text-green-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Crown className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Ranking</span>
          </button>
          
          <button
            onClick={() => setActiveTab('resultados')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              activeTab === 'resultados' 
                ? 'bg-yellow-400 text-green-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Resultados</span>
          </button>
          
          <button
            onClick={() => setActiveTab('sobre')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              activeTab === 'sobre' 
                ? 'bg-yellow-400 text-green-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Sobre Nós</span>
          </button>
        </div>
      </div>

      {/* Notificações de Compras */}
      <PurchaseNotifications />
    </div>
  );
}

export default App;
