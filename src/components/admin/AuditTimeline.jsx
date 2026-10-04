import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Divider,
  Stack,
} from "@mui/material";
import {
  Search,
  PersonOutlined,
  SmartToyOutlined,
  AdminPanelSettingsOutlined,
  CheckCircleOutlined,
  AccessTime,
  FilterList,
} from "@mui/icons-material";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";

const getActionIcon = (action = "") => {
  if (action.includes("Approved")) return { Icon: CheckCircle2, color: "#16a34a", bg: "#dcfce7" };
  if (action.includes("Rejected")) return { Icon: XCircle, color: "#dc2626", bg: "#fee2e2" };
  if (action.includes("Submitted")) return { Icon: FileText, color: "#2563eb", bg: "#dbeafe" };
  return { Icon: Clock, color: "#d97706", bg: "#fef3c7" }; // default: Opened for Review / Pending
};

const actorTypeConfig = {
  STUDENT: {
    label: "STUDENT",
    bg: "#eff6ff",
    color: "#1e40af",
    border: "#bfdbfe",
    icon: <PersonOutlined sx={{ fontSize: "14px !important" }} />,
  },
  SYSTEM: {
    label: "SYSTEM / AI",
    bg: "#f5f3ff",
    color: "#6d28d9",
    border: "#ddd6fe",
    icon: <SmartToyOutlined sx={{ fontSize: "14px !important" }} />,
  },
  ADMINISTRATOR: {
    label: "ADMINISTRATOR",
    bg: "#fef3c7",
    color: "#92400e",
    border: "#fde68a",
    icon: <AdminPanelSettingsOutlined sx={{ fontSize: "14px !important" }} />,
  },
};

export default function AuditTimeline({
  events = [],
  filterRequestId,
  compact = false,
  title = "Institutional Audit Trail",
  subtitle = "Cryptographically timestamped accountability & traceability log",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActorType, setSelectedActorType] = useState("ALL");

  
  const filteredEvents = events.filter((ev) => {
    if (filterRequestId && ev.requestId !== filterRequestId) {
      return false;
    }
    if (selectedActorType !== "ALL" && ev.actorType !== selectedActorType) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = (ev.requestId || "").toLowerCase().includes(q);
      const matchActor = (ev.actor || "").toLowerCase().includes(q);
      const matchAction = (ev.action || "").toLowerCase().includes(q);
      const matchDetails = (ev.details || "").toLowerCase().includes(q);
      return matchId || matchActor || matchAction || matchDetails;
    }
    return true;
  });

  return (
    <Box>
      {!compact && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2.5,
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {subtitle}
              </Typography>
            </Box>

           
            <Chip
              icon={<CheckCircleOutlined sx={{ fontSize: "15px !important" }} />}
              label={`${events.length} Total Audit Events`}
              sx={{
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                fontWeight: 600,
                color: "#1e293b",
              }}
            />
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
            }}
          >
            <TextField
              size="small"
              placeholder="Search by Request ID, Actor, or Action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              value={selectedActorType}
              onChange={(e) => setSelectedActorType(e.target.value)}
              sx={{ minWidth: 180 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList sx={{ color: "#94a3b8", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            >
              <MenuItem value="ALL">All Actor Types</MenuItem>
              <MenuItem value="STUDENT">Student Only</MenuItem>
              <MenuItem value="SYSTEM">System / AI Only</MenuItem>
              <MenuItem value="ADMINISTRATOR">Administrator Only</MenuItem>
            </TextField>
          </Box>
        </Paper>
      )}

     
      <Stack spacing={2.5}>
        {filteredEvents.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: "1px dashed #cbd5e1",
              backgroundColor: "#f8fafc",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              No audit records match the selected filter.
            </Typography>
          </Paper>
        ) : (
          filteredEvents.map((ev, index) => {
            const config = actorTypeConfig[ev.actorType] || actorTypeConfig.SYSTEM;
            const isHumanAdmin = ev.actorType === "ADMINISTRATOR";
            const { Icon, color, bg } = getActionIcon(ev.action || "");

            return (
              <Paper
                key={ev.id || index}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: isHumanAdmin ? "#fde68a" : "#e2e8f0",
                  backgroundColor: isHumanAdmin ? "#fffdf7" : "#ffffff",
                  transition: "border-color 0.15s ease",
                  "&:hover": {
                    borderColor: isHumanAdmin ? "#f59e0b" : "#94a3b8",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                 
                  <Box
                    sx={{
                      bgcolor: bg,
                      borderRadius: "50%",
                      p: 1.2,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} color={color} />
                  </Box>

                 
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        flexWrap: "wrap",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        size="small"
                        icon={config.icon}
                        label={config.label}
                        sx={{
                          backgroundColor: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          height: 22,
                          "& .MuiChip-icon": { color: config.color },
                        }}
                      />

                      {ev.requestId && (
                        <Chip
                          size="small"
                          label={ev.requestId}
                          sx={{
                            backgroundColor: "#14213d",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            height: 22,
                          }}
                        />
                      )}
                    </Box>

                  
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: "0.95rem",
                        mb: 1,
                      }}
                    >
                      {ev.action}
                    </Typography>

                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#334155",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        mb: 1.5,
                      }}
                    >
                      {ev.details}
                    </Typography>

                   
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      Recorded Actor: <strong>{ev.actor}</strong> • Immutable Institutional Log
                    </Typography>
                  </Box>

                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#64748b",
                      flexShrink: 0,
                      pt: 0.5,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 14 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.timestamp}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>
    </Box>
  );
}
