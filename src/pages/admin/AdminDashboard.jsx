import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Button,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AssignmentTurnedIn,
  HourglassEmpty,
  CheckCircleOutlined,
  CancelOutlined,
  ShieldOutlined,
  ExpandMore,
  ArrowForward,
  HelpOutlineOutlined,
} from "@mui/icons-material";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import SummaryCard from "../../components/SummaryCard";
import VerificationQueueTable from "../../components/admin/VerificationQueueTable";
import RequestReviewPanel from "../../components/admin/RequestReviewPanel";
import DecisionDialog from "../../components/admin/DecisionDialog";
import AuditTimeline from "../../components/admin/AuditTimeline";

import {
  getAllRequestsForAdmin,
  getAuditEvents,
  subscribeStore,
  markRequestUnderReview,
  approveRequest,
  rejectRequest,
  editAndApproveRequest,
} from "../../data/requestStore";

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

 
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

 
  const [requests, setRequests] = useState(getAllRequestsForAdmin);
  const [auditEvents, setAuditEvents] = useState(getAuditEvents);
  const [requestsFilter, setRequestsFilter] = useState("all");


  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [reviewPanelOpen, setReviewPanelOpen] = useState(false);

 
  const [decisionModalState, setDecisionModalState] = useState({
    open: false,
    mode: "approve", 
    requestId: null,
  });

 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

 
  useEffect(() => {
    const unsubscribe = subscribeStore(() => {
      setRequests(getAllRequestsForAdmin());
      setAuditEvents(getAuditEvents());
    });
    return unsubscribe;
  }, []);

 
  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  const decisionModalRequest = useMemo(() => {
    if (!decisionModalState.requestId) return null;
    return requests.find((r) => r.id === decisionModalState.requestId) || null;
  }, [requests, decisionModalState.requestId]);

  
  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "Pending" || r.status === "Under Review"
  ).length;
  const approvedCount = requests.filter((r) => r.status === "Completed").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  
  const verificationQueueRequests = useMemo(() => {
    return requests.filter(
      (r) => r.status === "Pending" || r.status === "Under Review"
    );
  }, [requests]);

  
  const filteredAllRequests = useMemo(() => {
    return requests.filter((r) => {
      if (requestsFilter === "all") return true;
      if (requestsFilter === "pending")
        return r.status === "Pending" || r.status === "Under Review";
      if (requestsFilter === "approved") return r.status === "Approved";
      if (requestsFilter === "rejected") return r.status === "Rejected";
      if (requestsFilter === "completed") return r.status === "Completed";
      return true;
    });
  }, [requests, requestsFilter]);

 
  const handleOpenReview = (request) => {
    setSelectedRequestId(request.id);
    setReviewPanelOpen(true);

    if (request.status === "Pending") {
      markRequestUnderReview(request.id);
    }
  };

  
  const handleCloseReviewPanel = () => {
    setReviewPanelOpen(false);
    setSelectedRequestId(null);
  };

  
  const handleOpenDecisionModal = (mode, request) => {
    setDecisionModalState({
      open: true,
      mode,
      requestId: request.id,
    });
  };

  
  const handleCloseDecisionModal = () => {
    setDecisionModalState({
      open: false,
      mode: "approve",
      requestId: null,
    });
  };

  
  const handleConfirmApprove = (targetRequest) => {
    const targetId = targetRequest.id;

    approveRequest(targetId);

  
    handleCloseDecisionModal();
    handleCloseReviewPanel();

   
    setSnackbar({
      open: true,
      message: `Request ${targetId} approved successfully by Admin.`,
      severity: "success",
    });
  };

  
  const handleConfirmReject = (targetRequest, reason) => {
    const targetId = targetRequest.id;

    rejectRequest(targetId, reason);

   
    handleCloseDecisionModal();
    handleCloseReviewPanel();

   
    setSnackbar({
      open: true,
      message: `Request ${targetId} rejected by Admin. Reason recorded in audit trail.`,
      severity: "error",
    });
  };

  
  const handleConfirmEditApprove = (targetRequest, editedData) => {
    const targetId = targetRequest.id;

    editAndApproveRequest(targetId, editedData);

    
    handleCloseDecisionModal();
    handleCloseReviewPanel();

   
    setSnackbar({
      open: true,
      message: `Request ${targetId} modified and approved by Admin.`,
      severity: "success",
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
     
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        isMobile={isMobile}
        pendingVerificationCount={pendingCount}
      />

      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
       
        <AdminHeader
          title={
            activeTab === "queue"
              ? "Verification Queue"
              : activeTab === "requests"
              ? "Service Requests Management"
              : activeTab === "audit"
              ? "Institutional Audit Trail"
              : activeTab === "support"
              ? "Administrator Support & FAQs"
              : "Admin Verification Dashboard"
          }
          subtitle="Human-in-the-Loop Institutional Service Delivery"
          onMenuToggle={() => setMobileDrawerOpen(true)}
          unreadCount={pendingCount}
        />

        
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flex: 1, maxWidth: 1400 }}>
        
          {activeTab !== "support" && (
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Total Requests"
                  count={totalCount}
                  subtitle="All institutional records"
                  icon={AssignmentTurnedIn}
                  iconBg="#e0e7ff"
                  iconColor="#3730a3"
                  onClick={() => setActiveTab("requests")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Pending Verification"
                  count={pendingCount}
                  subtitle="Requires Human Sign-off"
                  icon={HourglassEmpty}
                  iconBg="#fef3c7"
                  iconColor="#92400e"
                  onClick={() => setActiveTab("queue")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Approved"
                  count={approvedCount}
                  subtitle="Authorized by Admin"
                  icon={CheckCircleOutlined}
                  iconBg="#dcfce7"
                  iconColor="#166534"
                  onClick={() => {
                    setActiveTab("requests");
                    setRequestsFilter("approved");
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Rejected"
                  count={rejectedCount}
                  subtitle="Redressal Recorded"
                  icon={CancelOutlined}
                  iconBg="#fee2e2"
                  iconColor="#991b1b"
                  onClick={() => {
                    setActiveTab("requests");
                    setRequestsFilter("rejected");
                  }}
                />
              </Grid>
            </Grid>
          )}

         
          {activeTab === "dashboard" && (
            <Box>
              
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  mb: 4,
                  borderRadius: 2.5,
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      backgroundColor: "#14213d",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldOutlined sx={{ fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Human-in-the-Loop Institutional Verification Console
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569", mt: 0.25 }}>
                      Agentic AI verifies request completeness, evaluates policy rules, and estimates confidence scores. <strong>Final institutional approval or rejection is executed strictly by authorized administrators.</strong>
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => setActiveTab("queue")}
                  endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  sx={{
                    backgroundColor: "#14213d",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.1,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                      boxShadow: "none",
                    },
                  }}
                >
                  Open Verification Queue ({pendingCount})
                </Button>
              </Paper>

             
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Priority Verification Queue
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Incoming student requests awaiting administrative review and decision.
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setActiveTab("queue")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#14213d",
                      borderColor: "#cbd5e1",
                      borderRadius: 1.5,
                    }}
                  >
                    View All in Queue
                  </Button>
                </Box>

                <VerificationQueueTable
                  requests={verificationQueueRequests}
                  onReviewRequest={handleOpenReview}
                />
              </Box>

             
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Recent Institutional Audit Events
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Latest automated checks and administrative actions across the institution.
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setActiveTab("audit")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#14213d",
                      borderColor: "#cbd5e1",
                      borderRadius: 1.5,
                    }}
                  >
                    Full Audit Trail
                  </Button>
                </Box>

                <AuditTimeline
                  events={auditEvents.slice(0, 4)}
                  compact={true}
                />
              </Box>
            </Box>
          )}

          
          {activeTab === "queue" && (
            <Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Verification Queue ({verificationQueueRequests.length})
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Pending institutional submissions across Certificate, Maintenance, Laboratory Booking, and Grievance services.
                </Typography>
              </Box>

              <VerificationQueueTable
                requests={verificationQueueRequests}
                onReviewRequest={handleOpenReview}
              />
            </Box>
          )}

         
          {activeTab === "requests" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    All Service Requests
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Complete institutional database of student submissions and processing lifecycles.
                  </Typography>
                </Box>

               
                <Tabs
                  value={requestsFilter}
                  onChange={(e, val) => setRequestsFilter(val)}
                  sx={{
                    minHeight: 36,
                    "& .MuiTabs-indicator": { backgroundColor: "#14213d" },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      minHeight: 36,
                      py: 0.5,
                      px: 1.5,
                      color: "#64748b",
                      "&.Mui-selected": { color: "#14213d" },
                    },
                  }}
                >
                  <Tab label="All" value="all" />
                  <Tab label="Pending" value="pending" />
                  <Tab label="Approved" value="approved" />
                  <Tab label="Rejected" value="rejected" />
                  <Tab label="Completed" value="completed" />
                </Tabs>
              </Box>

              <VerificationQueueTable
                requests={filteredAllRequests}
                onReviewRequest={handleOpenReview}
                emptyMessage="No service requests match the selected filter."
              />
            </Box>
          )}

         
          {activeTab === "audit" && (
            <Box>
              <AuditTimeline events={auditEvents} />
            </Box>
          )}

          
          {activeTab === "support" && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  mb: 3,
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <HelpOutlineOutlined sx={{ color: "#14213d", fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    Administrator Guidance & FAQs
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                  Guidelines on operating the Human-in-the-Loop AI verification architecture.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Accordion
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        What is the role of AI in institutional service delivery?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        The Agentic AI acts purely as an automated decision-support analyst. It parses student intent, extracts structured attributes, cross-checks departmental policies, verifies digital evidence integrity, and computes confidence scores. The AI NEVER approves requests autonomously.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Does high AI Confidence (e.g., 96%) mean the request is pre-approved?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        No. AI confidence is solely a statistical indicator of document clarity and policy match. Institutional bylaws require an authorized human officer to review the evidence and formally execute the decision.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        When should an administrator use "Edit & Approve"?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        Use "Edit & Approve" when a request has valid intent but requires administrative refinement (e.g., re-assigning service sub-type, adjusting lab cluster hours based on slot availability, or correcting administrative category). Immutable identity fields (Request ID and Student Roll) remain locked.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        How does the Audit Trail guarantee institutional accountability?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        Every system action (AI verification, policy check) and human action (review opened, approved, rejected with reason, edited) is timestamped and cryptographically associated with the actor identity. This provides end-to-end traceability for compliance audits.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

    
      <RequestReviewPanel
        open={reviewPanelOpen}
        onClose={handleCloseReviewPanel}
        request={selectedRequest}
        onOpenDecisionModal={handleOpenDecisionModal}
        auditEvents={auditEvents}
      />

     
      <DecisionDialog
        open={decisionModalState.open}
        mode={decisionModalState.mode}
        request={decisionModalRequest}
        onClose={handleCloseDecisionModal}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
        onConfirmEditApprove={handleConfirmEditApprove}
      />

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
