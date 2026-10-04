import { Chip } from "@mui/material";
import {
  HourglassEmpty,
  CheckCircleOutlined,
  DoneAll,
  RateReview,
  CancelOutlined,
  InfoOutlined,
} from "@mui/icons-material";

const statusConfig = {
  Pending: {
    label: "Pending",
    bg: "#fef3c7",
    color: "#92400e",
    border: "#fde68a",
    icon: <HourglassEmpty sx={{ fontSize: "15px !important" }} />,
  },
  "Under Review": {
    label: "Under Review",
    bg: "#e0f2fe",
    color: "#0369a1",
    border: "#bae6fd",
    icon: <RateReview sx={{ fontSize: "15px !important" }} />,
  },
  Approved: {
    label: "Approved",
    bg: "#dcfce7",
    color: "#166534",
    border: "#bbf7d0",
    icon: <CheckCircleOutlined sx={{ fontSize: "15px !important" }} />,
  },
  Completed: {
    label: "Completed",
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#86efac",
    icon: <DoneAll sx={{ fontSize: "15px !important" }} />,
  },
  Rejected: {
    label: "Rejected",
    bg: "#fee2e2",
    color: "#991b1b",
    border: "#fecaca",
    icon: <CancelOutlined sx={{ fontSize: "15px !important" }} />,
  },
};

export default function StatusBadge({ status = "Pending" }) {
  const config = statusConfig[status] || {
    label: status,
    bg: "#f1f5f9",
    color: "#475569",
    border: "#e2e8f0",
    icon: <InfoOutlined sx={{ fontSize: "15px !important" }} />,
  };

  return (
    <Chip
      size="small"
      icon={config.icon}
      label={config.label}
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontWeight: 600,
        fontSize: "0.75rem",
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
  );
}
