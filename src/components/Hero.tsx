import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

interface HeroProps {
  ready: boolean;
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ ready, t }) => {
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
            color: 'black',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            maxWidth: '16ch',
            wordWrap: 'break-word',
          }}
        >
          {ready ? t('page.title') : 'Pokédex - Gotta Catch \'Em All!'}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(0, 0, 0, 0.9)',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' },
            maxWidth: '45ch',
            wordWrap: 'break-word',
          }}
        >
          {ready
            ? t('page.description')
            : 'Explore the world of Pokémon with our comprehensive Pokédex'}
        </Typography>

        <Button
          variant="contained"
          size="large"
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
          {ready ? t('hero.button') : 'Start Exploring'}
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
