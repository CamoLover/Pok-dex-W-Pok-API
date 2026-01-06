import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Box, Grid, Card, Typography, Container, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import PokemonImage from '../components/PokemonImage';
import { fetchPokemonPaginated, fetchPokemonSpecies, PokemonListItem, getPokemonImageUrl, getLocalizedName } from '../lib/pokeapi';

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
  const [allPokemon, setAllPokemon] = useState<PokemonWithTranslation[]>([]); // Store all pokemon for search
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsDisplayCount, setSearchResultsDisplayCount] = useState(60);
  const { t, ready } = useTranslation();
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 60;
  const TOTAL_POKEMON = 1302;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load all Pokemon names for search functionality
  useEffect(() => {
    const loadAllPokemonNames = async () => {
      if (!isClient || allPokemon.length > 0) return;

      try {
        const allPokeData = await fetchPokemonPaginated(0, TOTAL_POKEMON);
        setAllPokemon(allPokeData.map(p => ({ ...p, translatedName: undefined })));
      } catch (error) {
        console.error('Error loading all Pokemon names:', error);
      }
    };

    loadAllPokemonNames();
  }, [isClient]);

  const loadMorePokemon = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const newPokemon = await fetchPokemonPaginated(offset, ITEMS_PER_PAGE);

      setPokemon(prev => [...prev, ...newPokemon.map(p => ({ ...p, translatedName: undefined }))]);
      setOffset(prev => prev + ITEMS_PER_PAGE);

      if (offset + ITEMS_PER_PAGE >= TOTAL_POKEMON) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [offset, loadingMore, hasMore]);

  useEffect(() => {
    if (isClient) {
      loadMorePokemon();
    }
  }, [isClient]);

  // Reset search results display count when query changes
  useEffect(() => {
    setSearchResultsDisplayCount(60);
  }, [searchQuery]);

  // Filter from allPokemon if searching, otherwise get loaded pokemon from allPokemon
  const allFilteredPokemon = searchQuery
    ? allPokemon.filter((poke) => {
        const query = searchQuery.toLowerCase();
        const pokeName = poke.name.toLowerCase();
        const pokeId = String(poke.id);
        const translatedName = poke.translatedName?.toLowerCase() || '';

        return pokeName.includes(query) ||
               pokeId.includes(query) ||
               translatedName.includes(query);
      })
    : allPokemon.slice(0, offset); // Show loaded count from allPokemon (which has translations)

  // Display only the first N results
  const filteredPokemon = searchQuery
    ? allFilteredPokemon.slice(0, searchResultsDisplayCount)
    : allFilteredPokemon;

  const hasMoreSearchResults = searchQuery && allFilteredPokemon.length > searchResultsDisplayCount;

  const loadMoreSearchResults = useCallback(() => {
    setSearchResultsDisplayCount(prev => prev + 60);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (searchQuery && hasMoreSearchResults) {
            loadMoreSearchResults();
          } else if (!searchQuery && hasMore && !loadingMore) {
            loadMorePokemon();
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMorePokemon, searchQuery, hasMoreSearchResults, loadMoreSearchResults]);

  // Load all translations progressively in background
  useEffect(() => {
    if (!isClient || allPokemon.length === 0 || language === 'en') {
      return;
    }

    const loadAllTranslations = async () => {
      // Get all Pokemon that need translation
      const pokemonToTranslate = allPokemon
        .filter(poke => !poke.translatedName && poke.id > 0 && poke.id <= TOTAL_POKEMON);

      if (pokemonToTranslate.length === 0) return;

      const batchSize = 50; // Process 50 at a time
      const batches = [];

      for (let i = 0; i < pokemonToTranslate.length; i += batchSize) {
        batches.push(pokemonToTranslate.slice(i, i + batchSize));
      }

      // Process batches one at a time
      for (const batch of batches) {
        try {
          const translationPromises = batch.map(async (poke) => {
            try {
              const species = await fetchPokemonSpecies(poke.id);
              const translatedName = getLocalizedName(species.names, language);
              return { id: poke.id, translatedName };
            } catch (error) {
              console.error(`Error fetching species for Pokemon ${poke.id}:`, error);
              return { id: poke.id, translatedName: poke.name };
            }
          });

          const translations = await Promise.all(translationPromises);

          setAllPokemon(prevPokemon =>
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

        // Delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    };

    loadAllTranslations();
  }, [language, isClient, allPokemon.length]);

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

            {/* Search Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={isClient && ready ? t('search.placeholder') : 'Search Pokémon...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ maxWidth: 600 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    justifyContent: 'center',
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  {filteredPokemon.map((pokemonItem) => (
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

                {/* No results message */}
                {filteredPokemon.length === 0 && searchQuery && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      {ready ? t('search.no_results') : 'No Pokémon found matching'} "{searchQuery}"
                    </Typography>
                  </Box>
                )}

                {/* Observer target for infinite scroll */}
                <Box
                  ref={observerTarget}
                  sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
                >
                  {!searchQuery && loadingMore && <CircularProgress size={40} />}
                  {searchQuery && hasMoreSearchResults && (
                    <Typography variant="body2" color="text.secondary">
                      {ready ? t('search.load_more_hint') : 'Scroll down to load more Pokémon'}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Container>
        </Box>

        
        <Footer language={language} />
      </Box>
    </>
  );
};

export default Home;
