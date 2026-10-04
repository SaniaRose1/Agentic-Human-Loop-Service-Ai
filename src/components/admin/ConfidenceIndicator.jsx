import { Box, Typography, LinearProgress, Tooltip } from "@mui/material";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { Target } from "lucide-react";


export default function ConfidenceIndicator({
  confidence = 96,
  label = "High Confidence",
  showProgress = true,
  size = "medium",
}) {
 
  let barColor = "#0284c7"; 
  let textColor = "#0369a1";
  let bgTint = "#f0f9ff";
  let borderTint = "#bae6fd";

  if (confidence >= 90) {
    barColor = "#059669"; 
    textColor = "#065f46";
    bgTint = "#ecfdf5";
    borderTint = "#a7f3d0";
  } else if (confidence >= 75) {
    barColor = "#0284c7"; 
    textColor = "#075985";
    bgTint = "#f0f9ff";
    borderTint = "#bae6fd";
  } else {
    barColor = "#d97706"; 
    textColor = "#92400e";
    bgTint = "#fffbeb";
    borderTint = "#fde68a";
  }

  if (size === "small") {
    return (
      <Tooltip title="AI Model Evaluation Confidence (Human review required)" arrow placement="top">
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1,
            py: 0.25,
            borderRadius: 1.5,
            backgroundColor: bgTint,
            border: `1px solid ${borderTint}`,
          }}
        >
          <Target size={13} color={textColor} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: textColor, fontSize: "0.75rem" }}
          >
            {confidence}%
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: bgTint,
        border: `1px solid ${borderTint}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Target size={18} color={textColor} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: textColor }}
          >
            AI Confidence Score
          </Typography>
          <Tooltip
            title="Confidence reflects semantic matching and document integrity. AI confidence is NOT approval authority."
            arrow
            placement="top"
          >
            <HelpOutlineOutlined sx={{ fontSize: 14, color: textColor, cursor: "pointer", opacity: 0.8 }} />
          </Tooltip>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 800, color: textColor, lineHeight: 1 }}
          >
            {confidence}%
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: textColor,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>

      {showProgress && (
        <LinearProgress
          variant="determinate"
          value={confidence}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: barColor,
              borderRadius: 3,
            },
          }}
        />
      )}

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1,
          color: textColor,
          fontSize: "0.7rem",
          opacity: 0.9,
          fontStyle: "italic",
        }}
      >
        AI-assisted metric • Final validation by authorized administrator
      </Typography>
    </Box>
  );
}
