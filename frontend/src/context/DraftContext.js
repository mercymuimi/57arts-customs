import React, { createContext, useContext, useState } from 'react';

const DraftContext = createContext();

export const useDrafts = () => useContext(DraftContext);

export const DraftProvider = ({ children }) => {
  const [drafts, setDrafts] = useState([]);

  const addDraft = (draftData) => {
    const newDraft = {
      id: `draft-${Date.now()}`,
      ...draftData,
      status: 'draft',
      savedAt: new Date(),
      submittedAt: null,
      quoteReceived: false,
      quote: null,
    };
    setDrafts(prev => [newDraft, ...prev]);
    return newDraft.id;
  };

  const updateDraft = (id, updates) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDraft = (id) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const submitDraft = (id) => {
    setDrafts(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: 'submitted', submittedAt: new Date() }
        : d
    ));
  };

  return (
    <DraftContext.Provider value={{ drafts, addDraft, updateDraft, deleteDraft, submitDraft }}>
      {children}
    </DraftContext.Provider>
  );
};