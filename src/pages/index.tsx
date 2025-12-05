import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Grid, Card, Typography, Container, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import PokemonImage from '../components/PokemonImage';
import { fetchAllPokemon, fetchPokemonSpecies, PokemonListItem, getPokemonImageUrl, getLocalizedName } from '../lib/pokeapi';

interface HomeProps {
  darkMode: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

interface PokemonWithTranslation extends PokemonListItem {
  translatedName?: string;
}

const Home: React.FC<HomeProps> = ({ darkMode, onThemeToggle, language, onLanguageChange }) => {
  const [pokemon, setPokemon] = useState<PokemonWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { t, ready } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        const allPokemon = await fetchAllPokemon();
        setPokemon(allPokemon.map(p => ({ ...p, translatedName: undefined })));
      } catch (error) {
        console.error('Error loading Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      loadPokemon();
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || pokemon.length === 0 || language === 'en') {
      return;
    }

    const loadTranslatedNames = async () => {
      // Load translations in batches to avoid overwhelming the API
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < Math.min(pokemon.length, 300); i += batchSize) { // Only translate first 300 for performance
        batches.push(pokemon.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        try {
          const translationPromises = batch.map(async (poke) => {
            try {
              const species = await fetchPokemonSpecies(poke.id);
              const translatedName = getLocalizedName(species.names, language);
              return { id: poke.id, translatedName };
            } catch {
              return { id: poke.id, translatedName: poke.name };
            }
          });

          const translations = await Promise.all(translationPromises);
          
          setPokemon(prevPokemon => 
            prevPokemon.map(poke => {
              const translation = translations.find(t => t.id === poke.id);
              return translation 
                ? { ...poke, translatedName: translation.translatedName }
                : poke;
            })
          );
        } catch (error) {
          console.error('Error loading translations for batch:', error);
        }
        
        // Small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    loadTranslatedNames();
  }, [language, isClient, pokemon.length]);

  const handlePokemonClick = (id: number) => {
    router.push(`/pokemon/${id}`);
  };

  return (
    <>
      <Head>
        <title>{isClient && ready ? t('page.title') : 'Pokédex - Gotta Catch \'Em All!'}</title>
        <meta name="description" content={isClient && ready ? t('page.description') : 'Explore the world of Pokémon with our comprehensive Pokédex'} />
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
              {isClient && ready ? t('hero.section_title') : 'Discover Pokémon'}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Grid
                container
                spacing={3}
                sx={{
                  justifyContent: 'center',
                  px: { xs: 2, sm: 3 },
                }}
              >
                {pokemon.map((pokemonItem) => (
                  <Grid component="div" key={pokemonItem.id}>
                    <Card
                      onClick={() => handlePokemonClick(pokemonItem.id)}
                      sx={{
                        height: 250,
                        width: 200,
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
                      <PokemonImage
                        src={getPokemonImageUrl(pokemonItem.id)}
                        alt={pokemonItem.name}
                        height="200"
                        sx={{
                          objectFit: 'contain',
                          backgroundColor: 'rgba(0,0,0,0.02)',
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
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            fontWeight: 500,
                            textTransform: 'capitalize',
                            fontSize: '0.9rem',
                          }}
                        >
                          {pokemonItem.translatedName || pokemonItem.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                        >
                          N°{String(pokemonItem.id).padStart(3, '0')}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>

        
        <Footer language={language} />
      </Box>
    </>
  );
};

export default Home;
