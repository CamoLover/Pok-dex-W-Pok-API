import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Button } from '@mui/material';

interface HeroProps {
  ready: boolean;
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ ready, t }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRandomPokemon = () => {
    // Generate random Pokemon ID between 1 and 1302 (all available Pokemon)
    const randomId = Math.floor(Math.random() * 1302) + 1;
    router.push(`/pokemon/${randomId}`);
  };
  return (
    <Box
      sx={{
        height: '50vh',
        minHeight: '400px',
        backgroundImage: 'url("/images/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 2, md: 6 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'left',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            maxWidth: '16ch',
            wordWrap: 'break-word',
          }}
        >
          {isClient && ready ? t('page.title') : 'Pokédex - Gotta Catch \'Em All!'}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' },
            maxWidth: '45ch',
            wordWrap: 'break-word',
          }}
        >
          {isClient && ready
            ? t('page.description')
            : 'Explore the world of Pokémon with our comprehensive Pokédex'}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleRandomPokemon}
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
          }}
        >
          {isClient && ready ? t('hero.button') : 'Start Exploring'}
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
