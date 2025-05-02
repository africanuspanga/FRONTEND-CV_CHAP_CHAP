import React from 'react';
import kilimanjaroImg from '../images/templates/kilimanjaro.png';

const KilimanjaroTemplate = () => (
  <img 
    src={kilimanjaroImg} 
    alt="Kilimanjaro Template" 
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  />
);

export default KilimanjaroTemplate;