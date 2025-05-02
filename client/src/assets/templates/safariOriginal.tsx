import React from 'react';
import safariOriginalImg from '../images/templates/safariOriginal.png';

const SafariOriginalTemplate = () => (
  <img 
    src={safariOriginalImg} 
    alt="Safari Original Template" 
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  />
);

export default SafariOriginalTemplate;