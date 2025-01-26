import React, { useState } from 'react';
import DonutChart from './DonutChart';
import Register from './Register';

const ParentComponent = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <DonutChart refreshKey={refreshKey} />
      <Register setRefreshKey={setRefreshKey} />
    </div>
  );
};

export default ParentComponent;