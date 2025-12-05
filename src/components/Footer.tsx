import React, { useState, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import professorQuotes from '../data/professorQuotes.json';

interface FooterProps {
  language: string;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const [randomQuote, setRandomQuote] = useState(professorQuotes[0]);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * professorQuotes.length);
    setRandomQuote(professorQuotes[randomIndex]);
  }, []);

  if (!isClient) return null;

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
            "{t(randomQuote.quoteKey)}"
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            - {t(randomQuote.professorKey)}
          </Typography>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('footer.powered_by')}{' '}
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
            {t('footer.copyright')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
