'use client'
import { useState } from "react";

import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";



interface Definition {
  word: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
    }[];
  }[];
}




export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<Definition[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      if (!res.ok) {
        throw new Error('Word not found');
      }
      const data: Definition[] = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };


  const handleSave = (entry: Definition) => {
    // Retrieve saved words from localStorage
    let savedWords: Definition[] = [];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedWords');
      if (saved) {
        savedWords = JSON.parse(saved);
      }
      // Check if the word is already saved to avoid duplicates
      if (!savedWords.find((item) => item.word === entry.word)) {
        savedWords.push(entry);
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        alert(`Word "${entry.word}" saved!`);
      } else {
        alert(`Word "${entry.word}" is already saved.`);
      }
    }
  };



  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Search Words In The&nbsp;</span>
        <span className={title({ color: "violet" })}>Dictionary&nbsp;</span>
        <br />
        
      </div>
      <form onSubmit={handleSearch}>
      <div className="flex gap-4">
      <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
          classNames={{
            inputWrapper: "",
            input: "text-sm",
          }}
     
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
        />
          <Button type="submit" variant="bordered">
          Search
          </Button>
        </div>
 
        {/* <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a word"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '250px' }}
          /> */}
      
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && result.map((entry, index) => (
        <div
          className={subtitle({ class: "mt-4" })}
          key={index}
          style={{

          }}
        >

          <span className={title({ color: "violet" })}>{entry.word}&nbsp;</span>
          {entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].text && (
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              {entry.phonetics[0].text}
            </p>
          )}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{entry.word}</h2>
              <Button onClick={() => handleSave(entry)}>Save Word</Button>
            </div>
             {entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].text && (
              <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#555' }}>{entry.phonetics[0].text}</p>
            )}
          {entry.meanings.map((meaning, mIndex) => (
            <div key={mIndex} style={{ marginBottom: '1rem' }} className="flex flex-col items-center justify-center gap-4 py-8 md:py-10" >
              <h3 style={{ fontSize: '1.5rem', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                {meaning.partOfSpeech}
              </h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                {meaning.definitions.map((def, dIndex) => (
                  <li key={dIndex} style={{ marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0 }}>{def.definition}</p>
                    {def.example && (
                      <p style={{ margin: 0, fontStyle: 'italic', color: '' }}>
                        Example: {def.example}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}




    </section>
  );
}
