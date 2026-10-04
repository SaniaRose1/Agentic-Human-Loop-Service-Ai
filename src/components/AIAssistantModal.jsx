import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import {
  SmartToyOutlined,
  Close,
  ShieldOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

export default function AIAssistantModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: "#ffffff",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              backgroundColor: "#f1f5f9",
              color: "#14213d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SmartToyOutlined fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Institutional AI Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Human-in-the-Loop Autonomous Service Guide
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: "auto", p: 0.5, color: "#64748b" }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
            Autonomous Agentic Routing
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, mb: 1.5 }}>
            The AI Assistant will automatically extract student requirements, match institutional policies across departments, evaluate prerequisite documents, and draft structured requests for human officer approval.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <ShieldOutlined sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography variant="caption" sx={{ color: "#0369a1", fontWeight: 600 }}>
              AI Assistant integration will be connected in the next development phase.
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >
            <VerifiedUserOutlined sx={{ color: "#14213d", fontSize: 20, mt: 0.2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                Policy & Prerequisite Check
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Agent evaluates institutional eligibility rules before routing to administrative staff.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#14213d",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            px: 3,
            "&:hover": { backgroundColor: "#0f172a" },
          }}
        >
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  );
}
