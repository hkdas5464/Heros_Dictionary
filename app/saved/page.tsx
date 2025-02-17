'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button, Input } from '@heroui/react';
import { title, subtitle } from "@/components/primitives";

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
  }[];
}

interface Definition {
  word: string;
  phonetics?: Phonetic[];
  meanings: Meaning[];
}

const SavedWords: React.FC = () => {
  const [savedWords, setSavedWords] = useState<Definition[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState<Definition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedWords');
      if (saved) {
        setSavedWords(JSON.parse(saved));
      }
    }
  }, []);

  const handleRemove = (word: string) => {
    const updated = savedWords.filter((entry) => entry.word !== word);
    setSavedWords(updated);
    localStorage.setItem('savedWords', JSON.stringify(updated));
  };

  const handleEditClick = (word: string) => {
    const wordToEdit = savedWords.find((entry) => entry.word === word);
    if (wordToEdit) {
      setIsEditing(word);
      setEditedWord({ ...wordToEdit });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedWord) {
      setEditedWord({ ...editedWord, word: e.target.value });
    }
  };

  const handleEditSave = () => {
    if (editedWord) {
      const updatedWords = savedWords.map((entry) =>
        entry.word === isEditing ? editedWord : entry
      );
      setSavedWords(updatedWords);
      localStorage.setItem('savedWords', JSON.stringify(updatedWords));
      setIsEditing(null);
      setEditedWord(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedWord(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <div className='flex flex-wrap gap-4 items-center'>
      <span className={title({ color: "green" })}>Saved Words&nbsp;</span>
   
       
       <span><Link href="/"><Button color='success'>Home</Button></Link></span> 
       </div>
      </header>

      {savedWords.length === 0 ? (
        <p>No saved words yet.</p>
      ) : (
        savedWords.map((entry, index) => (
          <Card
            key={index}
            style={{
              marginBottom: '2rem',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            {isEditing === entry.word ? (
              <div className="flex flex-wrap gap-4 items-center">
                <Input
                  value={editedWord?.word || ''}
                  onChange={handleEditChange}
                />
                <Button onClick={handleEditSave} color='warning'>Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <span className={title({ color: "violet" ,size:"sm"})}>{entry.word}</span>
                
                <div className="flex flex-wrap gap-4 items-center">
                <Button onClick={() => handleEditClick(entry.word)} color="warning">Edit</Button>
                <Button onClick={() => handleRemove(entry.word)} color="danger">Remove</Button>
                 
                </div>
              </div>
            )}
            <div className='pt-4'>
            {entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].text && (
              <p>{entry.meanings[0].definitions[1].definition}</p>
              
            )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default SavedWords;
