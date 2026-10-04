import { Paper, Box, Typography } from "@mui/material";

export default function SummaryCard({
  title,
  count,
  subtitle,
  icon: IconComponent,
  iconColor = "#14213d",
  iconBg = "#e2e8f0",
  onClick,
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              borderColor: "#cbd5e1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }
          : {},
      }}
    >
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#0f172a",
            fontWeight: 700,
            fontSize: { xs: "1.75rem", sm: "2rem" },
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          {count}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {IconComponent && (
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
            flexShrink: 0,
          }}
        >
          <IconComponent sx={{ fontSize: 24 }} />
        </Box>
      )}
    </Paper>
  );
}
