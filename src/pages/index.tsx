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
  const placeholderCards = Array.from({ length: 25 }, (_, index) => index + 1);
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
                px: { xs: 2, sm: 3 }
              }}
            >
              {placeholderCards.map((cardNumber) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={cardNumber}>
                  <Card
                    sx={{
                      height: 200,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://placehold.co/200x200/3f51b5/white?text=Pokemon+${cardNumber}`}
                      alt={`Pokémon ${cardNumber}`}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
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
