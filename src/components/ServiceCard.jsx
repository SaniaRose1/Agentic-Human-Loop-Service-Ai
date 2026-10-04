import { Paper, Box, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

export default function ServiceCard({
  title,
  description,
  icon: IconComponent,
  iconBg = "#eff6ff",
  iconColor = "#1e40af",
  onSelect,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: "#94a3b8",
          boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            mb: 2,
          }}
        >
          {IconComponent && <IconComponent sx={{ fontSize: 24 }} />}
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "#0f172a",
            fontWeight: 700,
            fontSize: "1.05rem",
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            mb: 2,
          }}
        >
          {description}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        size="small"
        endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
        onClick={onSelect}
        sx={{
          alignSelf: "flex-start",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.82rem",
          borderColor: "#cbd5e1",
          color: "#1e293b",
          borderRadius: 1.5,
          px: 1.75,
          py: 0.6,
          "&:hover": {
            borderColor: "#0f172a",
            backgroundColor: "#f8fafc",
          },
        }}
      >
        Start Request
      </Button>
    </Paper>
  );
}
