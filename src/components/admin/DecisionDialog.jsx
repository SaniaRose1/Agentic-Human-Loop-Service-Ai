import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  Divider,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import {
  CheckCircleOutlined,
  CancelOutlined,
  EditOutlined,
  LockOutlined,
  AdminPanelSettingsOutlined,
  Close,
  ShieldOutlined,
} from "@mui/icons-material";
import { SERVICE_CATEGORIES } from "../../data/mockData";


export default function DecisionDialog({
  open,
  mode, 
  request,
  onClose,
  onConfirmApprove,
  onConfirmReject,
  onConfirmEditApprove,
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  
  const [editCategory, setEditCategory] = useState("");
  const [editSubType, setEditSubType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (request) {
      setEditCategory(request.category || "Certificate");
      setEditSubType(request.subType || "");
      setEditDescription(request.description || "");
      setEditNotes("");
      setRejectionReason("");
      setRejectionError("");
      setEditError("");
    }
  }, [request, mode]);

  if (!request) return null;

  
  if (mode === "approve") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1, backgroundColor: "#ffffff" },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: "#dcfce7",
                color: "#166534",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                Approve Request?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Human-in-the-Loop Institutional Authorization
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} size="small" sx={{ minWidth: "auto", p: 0.5, color: "#64748b" }}>
            <Close fontSize="small" />
          </Button>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 2.5 }}>
         
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  REQUEST ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {request.id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  STUDENT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {request.student} ({request.studentId})
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SERVICE CATEGORY
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {request.category}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  PURPOSE / SUBTYPE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {request.subType}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          
          {request.aiVerification?.recommendation && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e40af", display: "block", mb: 0.5 }}>
                AI RECOMMENDATION SUMMARY (Decision Support Only)
              </Typography>
              <Typography variant="body2" sx={{ color: "#1e3a8a", fontSize: "0.85rem", lineHeight: 1.5 }}>
                "{request.aiVerification.recommendation}"
              </Typography>
            </Paper>
          )}

         
          <Alert
            severity="info"
            icon={<AdminPanelSettingsOutlined />}
            sx={{
              borderRadius: 2,
              backgroundColor: "#f8fafc",
              border: "1px solid #cbd5e1",
              "& .MuiAlert-icon": { color: "#14213d" },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Administrator Institutional Authority
            </Typography>
            <Typography variant="caption" sx={{ color: "#475569", display: "block", mt: 0.25 }}>
              By confirming approval, you are executing the final institutional sign-off on behalf of the administration. This action will be attributed to your administrator identity in the audit trail.
            </Typography>
          </Alert>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#475569",
              borderColor: "#cbd5e1",
              borderRadius: 1.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirmApprove(request)}
            variant="contained"
            startIcon={<CheckCircleOutlined />}
            sx={{
              backgroundColor: "#166534",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              "&:hover": { backgroundColor: "#14532d" },
            }}
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  
  if (mode === "reject") {
    const handleRejectSubmit = () => {
      if (!rejectionReason.trim()) {
        setRejectionError("A formal rejection reason is required for institutional accountability.");
        return;
      }
      onConfirmReject(request, rejectionReason.trim());
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1, backgroundColor: "#ffffff" },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CancelOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                Reject Request
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Institutional Rejection & Redressal Recording
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} size="small" sx={{ minWidth: "auto", p: 0.5, color: "#64748b" }}>
            <Close fontSize="small" />
          </Button>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 2.5 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#334155", mb: 0.5 }}>
              Rejecting request <strong>{request.id}</strong> submitted by{" "}
              <strong>{request.student}</strong> ({request.category}).
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please enter the institutional reason for rejection. This reason will be communicated to the student and archived permanently in the audit trail.
            </Typography>
          </Box>

          {rejectionError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {rejectionError}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            placeholder="e.g. Supporting fees receipt missing seal; Student has pending library fine; Request outside permitted department slot..."
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (rejectionError) setRejectionError("");
            }}
            required
            error={Boolean(rejectionError)}
            helperText="Mandatory institutional justification"
            sx={{ mb: 2 }}
          />

          <Alert severity="warning" sx={{ borderRadius: 2, "& .MuiAlert-icon": { color: "#b45309" } }}>
            <Typography variant="caption" sx={{ color: "#78350f", fontWeight: 600, display: "block" }}>
              Human Decision Accountability: This action will mark the request status as "Rejected" and record an immutable audit entry under your name.
            </Typography>
          </Alert>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#475569",
              borderColor: "#cbd5e1",
              borderRadius: 1.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            variant="contained"
            startIcon={<CancelOutlined />}
            sx={{
              backgroundColor: "#991b1b",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              "&:hover": { backgroundColor: "#7f1d1d" },
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  
  if (mode === "edit-approve") {
    const handleEditApproveSubmit = (e) => {
      e?.preventDefault();
      if (!editDescription.trim() || !editSubType.trim()) {
        setEditError("Request description and subtype cannot be empty.");
        return;
      }

      const editedPayload = {
        category: editCategory,
        subType: editSubType.trim(),
        description: editDescription.trim(),
        adminEditNotes: editNotes.trim(),
      };

      onConfirmEditApprove(request, editedPayload);
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1, backgroundColor: "#ffffff" },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                Edit & Approve Request
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Human-in-the-Loop Modification & Authorization Workflow
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} size="small" sx={{ minWidth: "auto", p: 0.5, color: "#64748b" }}>
            <Close fontSize="small" />
          </Button>
        </DialogTitle>

        <Divider />

        <Box component="form" onSubmit={handleEditApproveSubmit}>
          <DialogContent sx={{ py: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {editError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {editError}
              </Alert>
            )}

           
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <LockOutlined sx={{ fontSize: 16, color: "#64748b" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                  Immutable Student Identity Fields (Locked)
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Request ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {request.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Student Name & ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {request.student} ({request.studentId})
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Department & Submitted Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {request.department} • {request.submittedDate}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Editable Service Parameters
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Service Category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  helperText="Select from 4 institutional categories"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Service SubType / Specifics"
                  value={editSubType}
                  onChange={(e) => setEditSubType(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Request Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              helperText="Administrative refinement of request specifications"
            />

            <TextField
              fullWidth
              size="small"
              label="Administrator Modification Notes (Optional)"
              placeholder="e.g. Adjusted quota slot to 12h per cluster availability; Corrected certificate dispatch desk..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />

           
            <Alert
              severity="info"
              icon={<ShieldOutlined />}
              sx={{
                borderRadius: 2,
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                "& .MuiAlert-icon": { color: "#166534" },
              }}
            >
              <Typography variant="caption" sx={{ color: "#14532d", fontWeight: 600, display: "block" }}>
                Human Decision Workflow: AI provided analysis → Human reviewed → Human edited parameters → Human approves.
              </Typography>
            </Alert>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#475569",
                borderColor: "#cbd5e1",
                borderRadius: 1.5,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<CheckCircleOutlined />}
              sx={{
                backgroundColor: "#14213d",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 1.5,
                px: 3,
                "&:hover": { backgroundColor: "#0f172a" },
              }}
            >
              Approve Edited Request
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }

  return null;
}
