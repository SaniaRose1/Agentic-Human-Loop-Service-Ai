import { Chip, Box, Typography, Tooltip } from "@mui/material";
import {
  ShieldOutlined,
  WarningAmberOutlined,
  ReportProblemOutlined,
} from "@mui/icons-material";

const riskConfig = {
  LOW: {
    label: "LOW RISK",
    bg: "#f0fdf4",
    color: "#166534",
    border: "#bbf7d0",
    icon: <ShieldOutlined sx={{ fontSize: "14px !important" }} />,
    defaultReason: "Standard request conforming to institutional policy prerequisites.",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    bg: "#fffbeb",
    color: "#b45309",
    border: "#fde68a",
    icon: <WarningAmberOutlined sx={{ fontSize: "14px !important" }} />,
    defaultReason: "Requires secondary verification of scheduling or resource quota.",
  },
  HIGH: {
    label: "HIGH RISK",
    bg: "#fef2f2",
    color: "#991b1b",
    border: "#fecaca",
    icon: <ReportProblemOutlined sx={{ fontSize: "14px !important" }} />,
    defaultReason: "Discrepancy detected or high-impact resource allocation requested.",
  },
};


export default function RiskBadge({
  level = "LOW",
  reason,
  detailed = false,
}) {
  const normalizedLevel = (level || "LOW").toUpperCase();
  const config = riskConfig[normalizedLevel] || riskConfig.LOW;
  const displayReason = reason || config.defaultReason;

  if (detailed) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              size="small"
              icon={config.icon}
              label={config.label}
              sx={{
                backgroundColor: "#ffffff",
                color: config.color,
                border: `1px solid ${config.border}`,
                fontWeight: 700,
                fontSize: "0.72rem",
                height: 24,
                "& .MuiChip-icon": {
                  color: config.color,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: config.color, fontWeight: 700 }}>
              Institutional Risk Assessment
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: config.color, fontSize: "0.82rem", lineHeight: 1.5 }}>
          {displayReason}
        </Typography>
      </Box>
    );
  }

  return (
    <Tooltip title={`Risk: ${normalizedLevel} — ${displayReason}`}>
      <Chip
        size="small"
        icon={config.icon}
        label={config.label}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          fontWeight: 700,
          fontSize: "0.72rem",
          height: 24,
          "& .MuiChip-icon": {
            color: config.color,
            marginLeft: "6px",
          },
          "& .MuiChip-label": {
            paddingLeft: "6px",
            paddingRight: "8px",
          },
        }}
      />
    </Tooltip>
  );
}
