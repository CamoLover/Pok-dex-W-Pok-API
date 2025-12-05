import React, { useState, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import professorQuotes from '../data/professorQuotes.json';

interface FooterProps {
  language: string;
}

type LanguageKey = 'en' | 'fr' | 'es' | 'de' | 'ja';

const Footer: React.FC<FooterProps> = ({ language }) => {
  const [randomQuote, setRandomQuote] = useState(professorQuotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * professorQuotes.length);
    setRandomQuote(professorQuotes[randomIndex]);
  }, []);

  const currentLanguage = language as LanguageKey;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
            "{randomQuote.quote[currentLanguage] || randomQuote.quote.en}"
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            - {randomQuote.professor[currentLanguage] || randomQuote.professor.en}
          </Typography>
        </Box>
        
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Powered by{' '}
            <Link
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'secondary.light', textDecoration: 'underline' }}
            >
              PokéAPI
            </Link>
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2024 Pokédex App. Made with ❤️ for Pokémon trainers everywhere.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;