import React from 'react';
import Head from 'next/head';
import { Box, Grid, Card, CardMedia, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

interface HomeProps {
  darkMode: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Home: React.FC<HomeProps> = ({ darkMode, onThemeToggle, language, onLanguageChange }) => {
  const placeholderCards = Array.from({ length: 151 }, (_, index) => index + 1);
  const { t, ready } = useTranslation();

  return (
    <>
      <Head>
        <title>{ready ? t('page.title') : 'Pokédex - Gotta Catch \'Em All!'}</title>
        <meta name="description" content={ready ? t('page.description') : 'Explore the world of Pokémon with our comprehensive Pokédex'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
      </Head>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} language={language} onLanguageChange={onLanguageChange} />
        
        <Hero ready={ready} t={t} />

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              {ready ? t('hero.section_title') : 'Discover Pokémon'}
            </Typography>
            <Grid
              container
              spacing={3}
              sx={{
                justifyContent: 'center',
                px: { xs: 2, sm: 3 },
              }}
            >
              {placeholderCards.map((cardNumber, index) => (
                <Grid component="div" key={cardNumber}>
                  <Card
                    sx={{
                      height: 250,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://placehold.co/200x200/c00043/white?text=Pokemon+${cardNumber}`}
                      alt={`Pokémon ${cardNumber}`}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                    {/* Mini Footer */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/logo.svg"
                        alt="Pokédex Logo"
                        sx={{
                          width: 32,
                          height: 32,
                          cursor: 'pointer',
                          objectFit: 'contain',
                        }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                      >
                        N°{String(index + 1).padStart(3, '0')}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        
        <Footer language={language} />
      </Box>
    </>
  );
};

export default Home;
