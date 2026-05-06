import React from 'react';
import ClassificationFeed from '../components/ClassificationFeed';
import { useTranslation } from '../contexts/LanguageContext';

export default function VisionPage({ latestClassification }) {
  const { t } = useTranslation();

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('page.vision.title')}</h1>
        <p className="page-subtitle">{t('page.vision.subtitle')}</p>
      </div>
      
      <div className="vision-layout">
        <ClassificationFeed classification={latestClassification} />
      </div>
    </div>
  );
}
