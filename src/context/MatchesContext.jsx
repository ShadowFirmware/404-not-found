import { createContext, useContext, useState } from 'react';

const MatchesContext = createContext();

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
};

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const addMatch = (pet) => {
    // Verificar que no exista ya en matches
    if (!matches.find(match => match.id === pet.id)) {
      setMatches([...matches, { ...pet, matchedAt: new Date().toISOString() }]);
    }
  };

  const removeMatch = (petId) => {
    setMatches(matches.filter(match => match.id !== petId));
  };

  return (
    <MatchesContext.Provider value={{ matches, addMatch, removeMatch }}>
      {children}
    </MatchesContext.Provider>
  );
};
