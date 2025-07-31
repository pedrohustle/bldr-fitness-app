import React, { useEffect, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const SELLER_ID = 242732;

const PRODUCT_IDS = {
  monthly: 'pro_01k0w0massgac1kvnd6kgswd0h',
  annual: 'pro_01k0w0massgac1kvnd6kgswd0h',
  lifetime: 'pro_01k0w0massgac1kvnd6kgswd0h',
};

const Checkout = () => {
  const { userProfile } = useContext(AuthContext);
  const [activeIndex, setActiveIndex] = useState(0);

  // NOVOS ESTADOS
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  const navigate = useNavigate();

  const plans = [
    {
      key: 'monthly',
      title: 'Mensal',
      price: 'R$ 19,90',
      description: 'Cobrança recorrente por mês',
      benefits: [''],
      productId: PRODUCT_IDS.monthly,
    },
    {
      key: 'annual',
      title: 'Anual',
      price: 'R$ 179,00',
      description: '~ R$ 14,90/mês',
      benefits: [''],
      productId: PRODUCT_IDS.annual,
      highlight: true,
    },
    {
      key: 'lifetime',
      title: 'Vitalício',
      price: 'R$ 349,00',
      description: 'Pagamento único',
      benefits: [''],
      productId: PRODUCT_IDS.lifetime,
    },
  ];

  useEffect(() => {
    if (!window.Paddle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/paddle.js';
      script.async = true;
      script.onload = () => {
        window.Paddle.Setup({ vendor: SELLER_ID });
      };
      document.body.appendChild(script);
    } else {
      window.Paddle.Setup({ vendor: SELLER_ID });
    }
  }, []);

  const handleCheckout = (productId, planType) => {
    if (!window.Paddle) {
      alert('O Paddle ainda não carregou. Tente novamente em alguns segundos.');
      return;
    }

    window.Paddle.Checkout.open({
      product: productId,
      successCallback: async () => {
        if (userProfile) {
          await updateUserProfile(userProfile.uid, {
            isPremium: true,
            premiumPlanType: planType,
            premiumSince: new Date().toISOString(),
          });
          setPurchasedPlan(planType);
          setShowSuccessModal(true);
        }
      },
    });
  };

  // Swipe logic
  const cardWidth = 320;
  const cardHeight = 213; // aspect ratio 3:2
  const spacing = 180;

  let startX = 0;
  let isDragging = false;

  const onDragStart = (e) => {
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  };

  const onDragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX;
    if (diff > 40 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (diff < -40 && activeIndex < plans.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 font-montserrat select-none">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center mb-12 border border-zinc-800">
        <img
          src="/images/bldr_naked_bgless.png"
          alt="BLDR Premium"
          className="w-36 h-36 object-contain mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">BLDR Premium</h1>
        <p className="text-gray-300 mb-6 text-sm">
          Acesso completo ao melhor do fitness. Sem limitações.
        </p>

        <ul className="text-sm text-gray-400 mb-6 space-y-2 text-center text-justify max-w-sm mx-auto">
          <li>✅ Todos os treinos desbloqueados</li>
          <li>✅ Nutrição, progresso, metas e desafios</li>
          <li>✅ Sem anúncios ou distrações</li>
          <li>✅ Suporte prioritário e atualizações futuras</li>
        </ul>
      </div>

      {/* Container dos cards com swipe */}
      <div
        className="relative w-full max-w-6xl h-[320px] mx-auto cursor-grab mb-16"
        style={{ perspective: 1000, touchAction: 'pan-y' }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {plans.map((plan, i) => {
          const offset = i - activeIndex;
          if (Math.abs(offset) > 2) return null;

          const rotateY = offset * 45;
          const translateX = offset * spacing;
          const scale = offset === 0 ? 1 : 0.75;
          const zIndex = offset === 0 ? 10 : 10 - Math.abs(offset);
          const opacity = offset === 0 ? 1 : 0.5;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              whileHover={offset === 0 ? { scale: 1.05, boxShadow: '0 0 20px 5px #d4af37' } : {}}
              style={{
                position: 'absolute',
                width: cardWidth,
                height: cardHeight,
                left: '50%',
                top: '50%',
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2 - 35,
                cursor: offset === 0 ? 'pointer' : 'default',
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                opacity,
                y: 0,
                rotateY,
                x: translateX,
                scale,
              }}
              onClick={() => offset === 0 && handleCheckout(plan.productId, plan.title)}
              className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-700 flex flex-col justify-between drop-shadow-lg relative overflow-visible"
            >
              {/* FAIXA NO CARD ANUAL */}
              {plan.key === 'annual' && (
                <div className="absolute top-3 -right-16 bg-[#d4af37] text-black text-xs font-bold px-12 py-1 rotate-45 shadow-md z-20">
                  Mais Vendido
                </div>
              )}

              <div className="w-full text-center">
                <h2 className="text-lg font-bold mb-2 text-white">{plan.title}</h2>
                <p className="text-yellow-400 text-2xl font-bold">{plan.price}</p>
                <p className="text-sm text-gray-400 mt-2 mb-4">{plan.description}</p>

                <ul className="text-xs text-gray-400 space-y-2 max-w-xs mx-auto">
                  {plan.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(plan.productId, plan.title)}
                className="w-full bg-black text-white border border-[#d4af37] hover:bg-[#d4af37] hover:text-black py-3 rounded-lg font-bold transition duration-300"
              >
                {plan.key === 'monthly'
                  ? 'Assinar Mensal'
                  : plan.key === 'annual'
                  ? 'Assinar Anual'
                  : 'Comprar Vitalício'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-8 mb-20 text-center max-w-md">
        Pagamento 100% seguro via Paddle. Você pode cancelar sua assinatura a qualquer momento.
      </p>

      {/* MODAL DE SUCESSO PÓS-CHECKOUT */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl max-w-sm text-center text-white">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Parabéns!</h2>
            <p className="mb-6 text-lg">
              Você adquiriu o plano <span className="font-semibold">{purchasedPlan}</span> e agora é Premium.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/dashboard');
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg transition"
            >
              Ir para Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
