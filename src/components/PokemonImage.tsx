import React, { useState } from 'react';
import { CardMedia, Box } from '@mui/material';

interface PokemonImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  sx?: any;
  onLoad?: () => void;
  onError?: () => void;
}

const PokemonImage: React.FC<PokemonImageProps> = ({
  src,
  alt,
  width,
  height,
  maxWidth,
  sx = {},
  onLoad,
  onError,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    onError?.();
  };

  if (!src || imageError) {
    return (
      <Box
        sx={{
          width: width || '100%',
          height: height || 'auto',
          maxWidth: maxWidth,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.02)',
          position: 'relative',
          ...sx,
        }}
      >
        <Box
          component="img"
          src="/images/logo.svg"
          alt="Pokédex Logo"
          sx={{
            width: '60%',
            height: 'auto',
            maxWidth: '120px',
            opacity: 0.3,
            objectFit: 'contain',
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: width || '100%', height: height || 'auto', maxWidth: maxWidth, ...sx }}>
      {imageLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            src="/images/logo.svg"
            alt="Loading..."
            sx={{
              width: '60%',
              height: 'auto',
              maxWidth: '120px',
              opacity: 0.3,
              objectFit: 'contain',
            }}
          />
        </Box>
      )}
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          backgroundColor: 'rgba(0,0,0,0.02)',
          transition: 'opacity 0.3s ease',
          ...(imageLoading ? { opacity: 0 } : { opacity: 1 }),
        }}
      />
    </Box>
  );
};

export default PokemonImage;