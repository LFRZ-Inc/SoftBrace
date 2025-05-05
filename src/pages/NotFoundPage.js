import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-bold mb-6">{t('notFound.title')}</h2>
      <p className="text-lg mb-8 max-w-lg mx-auto">
        {t('notFound.message')}
      </p>
      <Link 
        to="/" 
        className="inline-block bg-primary hover:bg-primary-light text-white py-3 px-8 rounded-lg font-bold transition-colors"
      >
        {t('notFound.backToHome')}
      </Link>
    </div>
  );
}

export default NotFoundPage; 