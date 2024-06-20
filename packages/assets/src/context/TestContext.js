import React, {createContext, useState, useEffect} from 'react';
export const TestContext = createContext();

export const AppContext = ({children, value}) => {
  const [data, setData] = useState({value});
  console.log('21321');
  return (
    <TestContext.Provider
      value={{
        ...data
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
