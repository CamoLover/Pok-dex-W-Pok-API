import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import { getTypeImageUrl, getTypeColor } from '../lib/typeImages';

interface TypeChipProps {
  typeName: string;
  size?: 'small' | 'medium';
}

const TypeChip: React.FC<TypeChipProps> = ({ typeName, size = 'medium' }) => {
  const typeImageUrl = getTypeImageUrl(typeName);
  const typeColor = getTypeColor(typeName);
  const [imageError, setImageError] = useState(false);
  
  // If there's no image URL or the image failed to load, show text fallback
  if (!typeImageUrl || imageError) {
    return (
      <Chip
        label={typeName}
        sx={{
          backgroundColor: typeColor,
          color: 'white',
          fontWeight: 500,
          textTransform: 'capitalize',
          '& .MuiChip-label': {
            px: size === 'small' ? 1 : 1.5,
            py: size === 'small' ? 0.25 : 0.5,
          },
          ...(size === 'small' && {
            height: 24,
            fontSize: '0.75rem',
          }),
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={typeImageUrl}
      alt={`${typeName} type`}
      sx={{
        width: size === 'small' ? 96 : 120,
        height: size === 'small' ? 48 : 60,
        objectFit: 'contain',
        cursor: 'pointer',
      }}
      onError={() => setImageError(true)}
    />
  );
};

export default TypeChip;