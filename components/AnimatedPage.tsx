import React, { ReactNode } from 'react';

const AnimatedPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="animate-page-enter">
      {children}
    </div>
  );
};

export default AnimatedPage;