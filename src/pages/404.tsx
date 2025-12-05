import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Custom404Props {
  darkMode: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

interface UnownLetter {
  id: number;
  letter: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  image: string;
}

const Custom404: React.FC<Custom404Props> = ({
  darkMode,
  onThemeToggle,
  language,
  onLanguageChange,
}) => {
  const router = useRouter();
  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [unownLetters, setUnownLetters] = useState<UnownLetter[]>([]);

  // Unown letter mappings (A-Z and ! ?)
  const unownSprites: { [key: string]: string } = {
    'A': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png',
    'B': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10061.png',
    'C': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10062.png',
    'D': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10063.png',
    'E': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10064.png',
    'F': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10065.png',
    'G': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10066.png',
    'H': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10067.png',
    'I': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10068.png',
    'J': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10069.png',
    'K': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10070.png',
    'L': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10071.png',
    'M': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10072.png',
    'N': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10073.png',
    'O': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10074.png',
    'P': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10075.png',
    'Q': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10076.png',
    'R': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10077.png',
    'S': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10078.png',
    'T': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10079.png',
    'U': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10080.png',
    'V': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10081.png',
    'W': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10082.png',
    'X': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10083.png',
    'Y': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10084.png',
    'Z': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10085.png',
    '!': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10086.png',
    '?': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10087.png',
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create random Unown letters
    const letters = ['4', '0', '4', 'E', 'R', 'R', 'O', 'R', '!', '?'];
    const initialLetters: UnownLetter[] = letters.map((letter, index) => {
      const validLetter = unownSprites[letter] ? letter : 'A';
      return {
        id: index,
        letter: validLetter,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 200) + 100,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        image: unownSprites[validLetter] || unownSprites['A'],
      };
    });

    setUnownLetters(initialLetters);

    const animateUnown = () => {
      setUnownLetters(prev => prev.map(letter => {
        let newX = letter.x + letter.dx;
        let newY = letter.y + letter.dy;
        let newDx = letter.dx;
        let newDy = letter.dy;

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 100) {
          newDx = -letter.dx;
          newX = letter.x + newDx;
        }
        if (newY <= 100 || newY >= window.innerHeight - 200) {
          newDy = -letter.dy;
          newY = letter.y + newDy;
        }

        return {
          ...letter,
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
        };
      }));
    };

    const intervalId = setInterval(animateUnown, 50);
    return () => clearInterval(intervalId);
  }, [isClient]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{isClient && ready ? `404 - ${t('404.title')} | Pokédex` : '404 - Page Not Found | Pokédex'}</title>
        <meta name="description" content={isClient && ready ? t('404.description') : "The page you're looking for doesn't exist."} />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} language={language} onLanguageChange={onLanguageChange} />
        
        {/* Animated Unown letters */}
        {isClient && unownLetters.map((letter) => (
          <Box
            key={letter.id}
            component="img"
            src={letter.image}
            alt={`Unown ${letter.letter}`}
            sx={{
              position: 'fixed',
              left: `${letter.x}px`,
              top: `${letter.y}px`,
              width: 80,
              height: 80,
              opacity: 0.3,
              pointerEvents: 'none',
              zIndex: 1,
              transition: 'all 0.05s linear',
            }}
          />
        ))}

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Container maxWidth="md">
            <Card 
              sx={{ 
                textAlign: 'center',
                p: 4,
                backgroundColor: 'background.paper',
                boxShadow: 4,
                borderRadius: 3,
              }}
            >
              <CardContent>
                {/* 404 with large Unown A */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '4rem', md: '6rem' },
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mr: 2,
                    }}
                  >
                    4
                  </Typography>
                  <Box
                    component="img"
                    src={unownSprites['O']}
                    alt="Unown O"
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      mx: 1,
                    }}
                  />
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '4rem', md: '6rem' },
                      fontWeight: 'bold',
                      color: 'primary.main',
                      ml: 2,
                    }}
                  >
                    4
                  </Typography>
                </Box>

                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  {isClient && ready ? t('404.title') : 'Page Not Found'}
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {isClient && ready ? (
                    <>
                      {t('404.message')}
                      <br />
                      {t('404.help')}
                    </>
                  ) : (
                    <>
                      The Pokémon you're looking for seems to have wandered off into the tall grass!
                      <br />
                      Let's get you back on the right path.
                    </>
                  )}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={handleGoBack}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    {isClient && ready ? t('404.goBack') : 'Go Back'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={handleGoHome}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    {isClient && ready ? t('404.home') : 'Home'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>

        <Footer language={language} />
      </Box>
    </>
  );
};

// This function gets called at build time
export async function getStaticProps() {
  // You can add any data fetching here if needed
  return {
    props: {}, // Will be passed to the page component as props
  };
}

export default Custom404;