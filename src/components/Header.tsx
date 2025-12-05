import React, { useState, useEffect } from 'react';
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
  const [isClient, setIsClient] = useState(false);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          component="img"
          src="/images/logo.svg"
          alt="Pokédex Logo"
          onClick={handleLogoClick}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            objectFit: 'contain',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />

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