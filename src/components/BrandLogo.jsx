import { Box, Typography } from '@mui/material';
import soaLogo from '../assets/soa_logo_transparent_256.png';

export default function BrandLogo({
  size = 'large',
  showDeemedLine = false,
  light = false,
  layout,
}) {
  const isColumn = layout ? layout === 'column' : size === 'large';
  const iconBox = size === 'large' ? 72 : 40;
  const iconImg = size === 'large' ? 56 : 28;
  const textColor = light ? '#fff' : 'text.primary';
  const secondaryColor = light ? 'rgba(255,255,255,0.6)' : 'text.secondary';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isColumn ? 'column' : 'row',
        alignItems: 'center',
        gap: isColumn ? 1.5 : 1.2,
      }}
    >
      <Box
        sx={{
          bgcolor: light ? 'rgba(255,255,255,0.08)' : '#14213d',
          borderRadius: 3,
          width: iconBox,
          height: iconBox,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img
          src={soaLogo}
          alt="Siksha 'O' Anusandhan Logo"
          style={{ width: iconImg, height: iconImg, objectFit: 'contain' }}
        />
      </Box>
      <Box sx={{ textAlign: isColumn ? 'center' : 'left' }}>
        <Typography
          variant={size === 'large' ? 'h5' : 'subtitle1'}
          fontWeight={700}
          sx={{ color: textColor, lineHeight: 1.2 }}
        >
          Siksha 'O' Anusandhan
        </Typography>
        {showDeemedLine && (
          <Typography
            variant="caption"
            sx={{ color: secondaryColor, display: 'block', fontSize: '0.72rem' }}
          >
            (Deemed to be University)
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            color: secondaryColor,
            display: 'block',
            fontSize: size === 'large' ? '0.72rem' : '0.68rem',
            lineHeight: 1.25,
            mt: 0.25,
          }}
        >
          Human-in-the-Loop Institutional Service Delivery
        </Typography>
      </Box>
    </Box>
  );
}
