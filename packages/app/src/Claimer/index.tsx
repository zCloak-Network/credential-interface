import React from 'react';

import { useKeystore } from '@credential/react-keystore';

const Claimer: React.FC = () => {
  const { claimerKeystore } = useKeystore();

  return <>{claimerKeystore ? 'claimer' : 'no claimer keystore'}</>;
};

export default Claimer;
