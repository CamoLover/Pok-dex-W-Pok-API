import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Switch,
  FormControlLabel,
  IconButton,
  Modal,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Stop,
  VolumeUp,
  Close,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PokemonImage from '../../components/PokemonImage';
import TypeChip from '../../components/TypeChip';
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchMove,
  fetchEvolutionChain,
  flattenEvolutionChain,
  Pokemon,
  PokemonSpecies,
  Move,
  getPokemonImageUrl,
  getLocalizedName,
  getLocalizedFlavorText,
} from '../../lib/pokeapi';

interface PokemonDetailProps {
  darkMode: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({
  darkMode,
  onThemeToggle,
  language,
  onLanguageChange,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t, ready } = useTranslation();
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [movesModalOpen, setMovesModalOpen] = useState(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState<Array<{ name: string; id: number; localizedName: string }>>([]);

  useEffect(() => {
    if (id) {
      loadPokemonData();
    }
  }, [id, language]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      const [pokemonData, speciesData] = await Promise.all([
        fetchPokemon(id as string),
        fetchPokemonSpecies(id as string),
      ]);

      setPokemon(pokemonData);
      setPokemonSpecies(speciesData);

      // Fetch evolution chain
      if (speciesData.evolution_chain?.url) {
        try {
          const evolutionData = await fetchEvolutionChain(speciesData.evolution_chain.url);
          const flattenedChain = flattenEvolutionChain(evolutionData.chain);

          // Fetch localized names for each Pokemon in the evolution chain
          const chainWithNames = await Promise.all(
            flattenedChain.map(async (evo) => {
              try {
                const evoSpecies = await fetchPokemonSpecies(evo.id);
                const localizedName = getLocalizedName(evoSpecies.names, language);
                return { ...evo, localizedName };
              } catch (error) {
                console.error(`Error loading species for ${evo.name}:`, error);
                return { ...evo, localizedName: evo.name };
              }
            })
          );

          setEvolutionChain(chainWithNames);
        } catch (error) {
          console.error('Error loading evolution chain:', error);
        }
      }
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShinyToggle = () => {
    setShowFlash(true);
    setTimeout(() => {
      setIsShiny(!isShiny);
      setShowFlash(false);
    }, 300);
  };

  const playPokemonCry = () => {
    if (!pokemon?.cries?.latest) return;

    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    const newAudio = new Audio(pokemon.cries.latest);
    newAudio.onended = () => setIsPlaying(false);
    newAudio.onerror = () => setIsPlaying(false);
    
    newAudio.play().catch(() => {
      setIsPlaying(false);
    });
    
    setAudio(newAudio);
    setIsPlaying(true);
  };

  const loadMoves = async () => {
    if (!pokemon || moves.length > 0) return;
    
    setLoadingMoves(true);
    try {
      const movePromises = pokemon.moves.slice(0, 20).map(move =>
        fetchMove(move.move.name).catch(() => null)
      );
      
      const moveResults = await Promise.all(movePromises);
      setMoves(moveResults.filter((move): move is Move => move !== null));
    } catch (error) {
      console.error('Error loading moves:', error);
    } finally {
      setLoadingMoves(false);
    }
  };

  const openMovesModal = () => {
    setMovesModalOpen(true);
    loadMoves();
  };

  if (loading) {
    return (
      <>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} language={language} onLanguageChange={onLanguageChange} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
        <Footer language={language} />
      </>
    );
  }

  if (!pokemon || !pokemonSpecies) {
    return (
      <>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} language={language} onLanguageChange={onLanguageChange} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6">{ready ? t('pokemon.not_found') : 'Pokémon not found'}</Typography>
        </Box>
        <Footer language={language} />
      </>
    );
  }

  const localizedName = getLocalizedName(pokemonSpecies.names, language);
  const flavorText = getLocalizedFlavorText(pokemonSpecies.flavor_text_entries, language);

  return (
    <>
      <Head>
        <title>{localizedName || pokemon.name} - Pokédex</title>
        <meta name="description" content={flavorText} />
      </Head>

      {/* Flash animation overlay */}
      {showFlash && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
            animation: 'flash 0.3s ease-out',
            '@keyframes flash': {
              '0%': { opacity: 0 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
        />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} language={language} onLanguageChange={onLanguageChange} />
        
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            {/* Back button and shiny toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <IconButton
                onClick={() => router.push('/')}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={isShiny}
                    onChange={handleShinyToggle}
                    color="warning"
                  />
                }
                label={ready ? t('pokemon.shiny') : 'Shiny'}
                sx={{ fontSize: '1.1rem', fontWeight: 500 }}
              />
            </Box>

            <Grid container spacing={4}>
              {/* Left side - Images */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3, height: 'fit-content' }}>
                  <Box sx={{ position: 'relative' }}>
                    {/* Front sprite */}
                    <PokemonImage
                      src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
                      alt={`${pokemon.name} front`}
                      width="100%"
                      maxWidth={300}
                      sx={{
                        height: 'auto',
                        margin: '0 auto',
                        display: 'block',
                        objectFit: 'contain',
                      }}
                    />
                    
                    {/* Back sprite - only show if available */}
                    {(isShiny ? pokemon.sprites.back_shiny : pokemon.sprites.back_default) && (
                      <PokemonImage
                        src={isShiny ? pokemon.sprites.back_shiny : pokemon.sprites.back_default}
                        alt={`${pokemon.name} back`}
                        width="60%"
                        maxWidth={180}
                        sx={{
                          height: 'auto',
                          margin: '16px auto 0',
                          display: 'block',
                          objectFit: 'contain',
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Right side - Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Name and number */}
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {localizedName || pokemon.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      N°{String(pokemon.id).padStart(3, '0')}
                    </Typography>
                    
                    {/* Types */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {pokemon.types.map((type) => (
                        <TypeChip
                          key={type.type.name}
                          typeName={type.type.name}
                        />
                      ))}
                    </Box>

                    {/* Description */}
                    {flavorText && (
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {flavorText.replace(/\f/g, ' ')}
                      </Typography>
                    )}
                  </Card>

                  {/* Stats and abilities */}
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {ready ? t('pokemon.details') : 'Details'}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">{ready ? t('pokemon.height') : 'Height'}</Typography>
                        <Typography variant="h6">{(pokemon.height / 10).toFixed(1)} m</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">{ready ? t('pokemon.weight') : 'Weight'}</Typography>
                        <Typography variant="h6">{(pokemon.weight / 10).toFixed(1)} kg</Typography>
                      </Grid>
                    </Grid>

                    {/* Abilities */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {ready ? t('pokemon.abilities') : 'Abilities'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                      {pokemon.abilities.map((ability) => (
                        <Chip
                          key={ability.ability.name}
                          label={ability.ability.name.replace('-', ' ')}
                          variant={ability.is_hidden ? 'outlined' : 'filled'}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      ))}
                    </Box>

                    {/* Cry */}
                    <Button
                      onClick={playPokemonCry}
                      variant="contained"
                      startIcon={isPlaying ? <Stop /> : <PlayArrow />}
                      sx={{ mb: 2, mr: 2 }}
                      disabled={!pokemon.cries?.latest}
                    >
                      {isPlaying ? (ready ? t('pokemon.stop_cry') : 'Stop Cry') : (ready ? t('pokemon.play_cry') : 'Play Cry')}
                    </Button>

                    {/* Moves button */}
                    <Button
                      onClick={openMovesModal}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      {ready ? t('pokemon.view_moves') : 'View Moves'}
                    </Button>
                  </Card>
                </Box>
              </Grid>
            </Grid>

            {/* Evolution Chain */}
            {evolutionChain.length > 1 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                  {ready ? t('pokemon.evolution') : 'Evolution Chain'}
                </Typography>
                <Card sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    {evolutionChain.map((evo) => (
                      <Box
                        key={evo.id}
                        onClick={() => router.push(`/pokemon/${evo.id}`)}
                        sx={{
                          opacity: evo.id === pokemon?.id ? 1 : 0.75,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            opacity: 1,
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <PokemonImage
                            src={getPokemonImageUrl(evo.id, isShiny)}
                            alt={evo.name}
                            width={120}
                            maxWidth={120}
                            sx={{
                              height: 'auto',
                              display: 'block',
                              objectFit: 'contain',
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              textTransform: 'capitalize',
                              fontWeight: evo.id === pokemon?.id ? 'bold' : 'normal',
                              mt: 1,
                            }}
                          >
                            {evo.localizedName || evo.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            N°{String(evo.id).padStart(3, '0')}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Box>
            )}

            {/* Navigation Footer */}
            <Box sx={{ mt: 4 }}>
              <Card sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* Previous Pokemon */}
                  <Box
                    onClick={() => pokemon && pokemon.id > 1 && router.push(`/pokemon/${pokemon.id - 1}`)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: pokemon && pokemon.id > 1 ? 'pointer' : 'not-allowed',
                      opacity: pokemon && pokemon.id > 1 ? 1 : 0.3,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: pokemon && pokemon.id > 1 ? 0.8 : 0.3,
                      },
                    }}
                  >
                    <ArrowBack />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {ready ? t('pokemon.previous') : 'Previous'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        N°{pokemon && pokemon.id > 1 ? String(pokemon.id - 1).padStart(3, '0') : '---'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Current Pokemon */}
                  <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {ready ? t('pokemon.current') : 'Current'}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {localizedName || pokemon?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      N°{pokemon && String(pokemon.id).padStart(3, '0')}
                    </Typography>
                  </Box>

                  {/* Next Pokemon */}
                  <Box
                    onClick={() => pokemon && pokemon.id < 1302 && router.push(`/pokemon/${pokemon.id + 1}`)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: pokemon && pokemon.id < 1302 ? 'pointer' : 'not-allowed',
                      opacity: pokemon && pokemon.id < 1302 ? 1 : 0.3,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: pokemon && pokemon.id < 1302 ? 0.8 : 0.3,
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        {ready ? t('pokemon.next') : 'Next'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        N°{pokemon && pokemon.id < 1302 ? String(pokemon.id + 1).padStart(3, '0') : '---'}
                      </Typography>
                    </Box>
                    <Box sx={{ transform: 'rotate(180deg)' }}>
                      <ArrowBack />
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Container>
        </Box>

        <Footer language={language} />
      </Box>

      {/* Moves Modal */}
      <Modal
        open={movesModalOpen}
        onClose={() => setMovesModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ 
          width: '90%', 
          maxWidth: 600, 
          maxHeight: '80vh', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {localizedName || pokemon.name} - {ready ? t('pokemon.moves_title') : 'Moves'}
            </Typography>
            <IconButton onClick={() => setMovesModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />

          {loadingMoves ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ overflow: 'auto', flex: 1 }}>
              {moves.map((move) => (
                <ListItem key={move.id} divider>
                  <ListItemText
                    primary={
                      <Typography sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                        {getLocalizedName(move.names, language) || move.name.replace('-', ' ')}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {ready ? t('pokemon.type') : 'Type'}: {move.type.name} | {ready ? t('pokemon.power') : 'Power'}: {move.power || 'N/A'} | {ready ? t('pokemon.pp') : 'PP'}: {move.pp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default PokemonDetail;