import React from 'react';
import bigBossImg from '../images/templates/bigBoss.png';

const BigBossTemplate = () => (
  <img 
    src={bigBossImg} 
    alt="Big Boss Template" 
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  />
);

export default BigBossTemplate;