import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  darkMode: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onThemeToggle, language, onLanguageChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { t, ready } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    onLanguageChange(event.target.value);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Searching for:', searchValue);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          component="img"
          src="https://placehold.co/40x40/3f51b5/white?text=P"
          alt="Pokédex Logo"
          onClick={handleLogoClick}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            maxWidth: 400,
            mx: 3,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder={ready ? t('header.search.placeholder') : 'Search Pokémon...'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'secondary.main',
                },
              },
            }}
          />
          <IconButton
            type="submit"
            sx={{
              ml: 1,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.main',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="fr">FR</MenuItem>
              <MenuItem value="es">ES</MenuItem>
              <MenuItem value="de">DE</MenuItem>
              <MenuItem value="ja">JA</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={onThemeToggle}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;