import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import {
  CheckCircleOutlined,
  CancelOutlined,
  EditOutlined,
  SmartToyOutlined,
  PolicyOutlined,
  VerifiedUserOutlined,
  AssignmentOutlined,
  AttachFileOutlined,
  Close,
  HistoryEduOutlined,
} from "@mui/icons-material";

import StatusBadge from "../StatusBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import RiskBadge from "./RiskBadge";
import AuditTimeline from "./AuditTimeline";

export default function RequestReviewPanel({
  open,
  onClose,
  request,
  onOpenDecisionModal,
  auditEvents = [],
}) {
  const [activeTab, setActiveTab] = useState(0);

  if (!request) return null;

  const ai = request.aiVerification || {
    intent: `${request.category} Service Evaluation`,
    extractedInformation: [
      { label: "Requester", value: `${request.student} (${request.studentId})` },
      { label: "Department", value: request.department },
      { label: "Service", value: request.category },
    ],
    policyCheck: {
      status: "Passed",
      rule: "Standard Institutional Service Charter",
      details: "Policy criteria verified.",
    },
    evidenceCheck: {
      status: "Verified",
      details: "Digital documentation validated.",
    },
    confidence: 90,
    confidenceLabel: "High Confidence",
    risk: {
      level: "LOW",
      reason: "Standard institutional workflow.",
    },
    recommendation:
      "Request appears consistent with submitted information and applicable service requirements. Human review required.",
  };

  const isResolved = request.status ===  "Completed" ;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: "#ffffff",
            maxHeight: "92vh",
          },
        },
      }}
    >
      
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pb: 1.5,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              {request.id}
            </Typography>
            <StatusBadge status={request.status} />
            <RiskBadge level={ai.risk?.level} reason={ai.risk?.reason} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {request.category} — {request.subType || "Institutional Request"}
          </Typography>
        </Box>

        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: "auto", p: 0.5, color: "#64748b" }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>

    
      <Box sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": { backgroundColor: "#14213d" },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              minHeight: 40,
              color: "#64748b",
              "&.Mui-selected": { color: "#14213d" },
            },
          }}
        >
          <Tab icon={<AssignmentOutlined sx={{ fontSize: 18 }} />} iconPosition="start" label="Request & AI Analysis" />
          <Tab icon={<HistoryEduOutlined sx={{ fontSize: 18 }} />} iconPosition="start" label="Audit Trail" />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
        {activeTab === 0 ? (
          <>
           
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AssignmentOutlined fontSize="small" sx={{ color: "#14213d" }} />
                Request Information
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      STUDENT NAME
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      {request.student}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      STUDENT ID / ROLL
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {request.studentId}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      DEPARTMENT
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {request.department}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      SUBMITTED DATE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {request.submittedDate}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
                  REQUEST DESCRIPTION & PURPOSE
                </Typography>
                <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
                  {request.description}
                </Typography>

                {request.adminEditNotes && (
                  <Box sx={{ mt: 2, p: 1.5, backgroundColor: "#f0fdf4", borderRadius: 1.5, border: "1px solid #bbf7d0" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#166534", display: "block" }}>
                      ADMINISTRATOR EDIT NOTE:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#14532d", fontSize: "0.82rem" }}>
                      {request.adminEditNotes}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AttachFileOutlined fontSize="small" sx={{ color: "#14213d" }} />
                Supporting Evidence & Verification
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      PDF
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {request.evidence?.fileName || "student_request_document.pdf"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.evidence?.fileSize || "1.4 MB"} • Uploaded {request.evidence?.uploadedOn || request.submittedDate}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      label={request.evidence?.evidenceStatus || "Available for Review"}
                      sx={{
                        backgroundColor: "#e0f2fe",
                        color: "#0369a1",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<VerifiedUserOutlined sx={{ fontSize: "14px !important" }} />}
                      label={request.evidence?.verificationStatus || "Integrity Verified"}
                      sx={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        "& .MuiChip-icon": { color: "#166534" },
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#94a3b8", fontStyle: "italic" }}>
                  Mock document integrity check: institutional digital certificate and prerequisite attachments matched.
                </Typography>
              </Paper>
            </Box>

          
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                }}
              >
               
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 2,
                    pb: 1.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        backgroundColor: "#14213d",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SmartToyOutlined sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                        AI Verification Summary
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Agentic Decision-Support Output (MOCK AI DATA)
                      </Typography>
                    </Box>
                  </Box>

                
                  <Chip
                    label="AI-assisted analysis — Human Decision Required"
                    size="small"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      border: "1px solid #fde68a",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      height: 24,
                    }}
                  />
                </Box>

               
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                 
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.75,
                        height: "100%",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                        1. Detected Intent
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.5 }}>
                        {ai.intent}
                      </Typography>
                    </Paper>
                  </Grid>

                 
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.75,
                        height: "100%",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <PolicyOutlined sx={{ fontSize: 16, color: "#166534" }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                            3. Policy Check
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={ai.policyCheck?.status || "Passed"}
                          sx={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700, height: 20, fontSize: "0.68rem" }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: "#334155" }}>
                        {ai.policyCheck?.rule}
                      </Typography>

                      <Divider sx={{ my: 0.25 }} />

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <VerifiedUserOutlined sx={{ fontSize: 16, color: "#0369a1" }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                            4. Evidence Check
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={ai.evidenceCheck?.status || "Verified"}
                          sx={{ backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: 700, height: 20, fontSize: "0.68rem" }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: "#334155" }}>
                        {ai.evidenceCheck?.details}
                      </Typography>
                    </Paper>
                  </Grid>

                 
                  <Grid size={{ xs: 12 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.75,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", mb: 1 }}>
                        2. Extracted Information
                      </Typography>
                      <Grid container spacing={1.5}>
                        {ai.extractedInformation?.map((item, idx) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                              {item.value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>

                 
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <ConfidenceIndicator
                      confidence={ai.confidence}
                      label={ai.confidenceLabel}
                      showProgress={true}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <RiskBadge
                      level={ai.risk?.level}
                      reason={ai.risk?.reason}
                      detailed={true}
                    />
                  </Grid>

                 
                  <Grid size={{ xs: 12 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                        7. AI Recommendation
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#334155", fontStyle: "italic", lineHeight: 1.5 }}>
                        "{ai.recommendation}"
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 1 }}>
                        * Autonomous suggestion provided for administrative review. Final institutional decision is made exclusively by authorized personnel.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </>
        ) : (
         
          <Box>
            <AuditTimeline
              events={auditEvents}
              filterRequestId={request.id}
              compact={true}
              title={`Audit Records for ${request.id}`}
              subtitle="Full chronological sequence of automated checks and human administrative actions."
            />
          </Box>
        )}
      </DialogContent>

      <Divider />

      
      <DialogActions sx={{ p: 2.5, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
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
          Close Panel
        </Button>

        
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<EditOutlined />}
            onClick={() => onOpenDecisionModal("edit-approve", request)}
            sx={{
              color: "#1e293b",
              borderColor: "#94a3b8",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              "&:hover": {
                borderColor: "#14213d",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Edit & Approve
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelOutlined />}
            onClick={() => onOpenDecisionModal("reject", request)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: "#fca5a5",
              color: "#991b1b",
              "&:hover": {
                borderColor: "#ef4444",
                backgroundColor: "#fef2f2",
              },
            }}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckCircleOutlined />}
            onClick={() => onOpenDecisionModal("approve", request)}
            sx={{
              backgroundColor: "#166534",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 2.5,
              "&:hover": {
                backgroundColor: "#14532d",
              },
            }}
          >
            {isResolved ? "Re-Approve" : "Approve Request"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
