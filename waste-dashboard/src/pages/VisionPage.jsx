import React, { useState } from 'react';
import ClassificationFeed from '../components/ClassificationFeed';
import { useTranslation } from '../contexts/LanguageContext';

export default function VisionPage({ latestClassification }) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [detections, setDetections] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setDetections(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/classify', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setResultImage(data.image);
        setDetections(data.detections);
      } else {
        console.error('Error from server:', data.error);
        alert('Classification failed: ' + data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Could not connect to the classification server. Make sure api.py is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('page.vision.title')}</h1>
        <p className="page-subtitle">{t('page.vision.subtitle')}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="white-card" style={{ padding: '28px', flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Upload Image for Classification</h2>
          <div style={{ marginBottom: '16px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ display: 'block', width: '100%', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
            />
          </div>
          
          {previewUrl && !resultImage && (
            <div style={{ marginBottom: '16px' }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            </div>
          )}
          
          {resultImage && (
            <div style={{ marginBottom: '16px' }}>
              <img src={resultImage} alt="Result" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            </div>
          )}

          <button 
            onClick={handleUpload} 
            disabled={!selectedImage || loading}
            style={{ 
              background: loading || !selectedImage ? '#94A3B8' : '#3B82F6', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: loading || !selectedImage ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              width: '100%'
            }}
          >
            {loading ? 'Processing...' : 'Classify Waste'}
          </button>
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ClassificationFeed classification={latestClassification} />
          
          {detections && detections.length > 0 && (
            <div className="white-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Detection Results</h2>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {detections.map((det, index) => (
                  <li key={index} style={{ marginBottom: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '16px' }}>{det.category}</div>
                    <div style={{ color: '#64748B', fontSize: '14px' }}>Detected: {det.raw_label}</div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>Confidence: {(det.conf * 100).toFixed(1)}%</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {detections && detections.length === 0 && (
            <div className="white-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Detection Results</h2>
              <p style={{ color: '#64748B' }}>No waste detected in this image.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
