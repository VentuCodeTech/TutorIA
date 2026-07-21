'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('Tirei10_cookie_consent');
    if (!consent) {
      // Show with a small delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('Tirei10_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem('Tirei10_cookie_consent', 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Usamos Cookies</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Coletamos dados de navegação para personalizar sua experiência de estudos, 
                melhorar nossos serviços e exibir conteúdo relevante. Ao continuar, você concorda com o uso 
                de cookies conforme nossa{' '}
                <Link href="/politicas" className="text-indigo-600 hover:underline font-medium">
                  Política de Privacidade
                </Link>.
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
            <button type="button"
              onClick={handleRefuse}
              className="flex-1 md:flex-none px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm"
            >
              Recusar
            </button>
            <button type="button"
              onClick={handleAccept}
              className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
