import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AddCircleOutlineOutlined,
  AssignmentTurnedIn,
  HourglassEmpty,
  CheckCircleOutlined,
  DoneAll,
  DescriptionOutlined,
  BuildOutlined,
  ScienceOutlined,
  ReportProblemOutlined,
  SmartToyOutlined,
  ArrowForward,
  HelpOutlineOutlined,
  ExpandMore,
} from "@mui/icons-material";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import SummaryCard from "../../components/SummaryCard";
import ServiceCard from "../../components/ServiceCard";
import RequestTable from "../../components/RequestTable";
import RequestDetailsModal from "../../components/RequestDetailsModal";
import NewRequestModal from "../../components/NewRequestModal";
import AIAssistantModal from "../../components/AIAssistantModal";

import {
  getRequests,
  addStudentRequest,
  subscribeStore,
} from "../../data/requestStore";

export default function StudentDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [name , setName]=useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [requests, setRequests] = useState(getRequests);
  const [tableFilter, setTableFilter] = useState("all");

  
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState("Certificate");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  
  useEffect(() => {

     const User = localStorage.getItem("user");
    if(User){
      const user = JSON.parse(User);
      setName(user.name);
    }
    const unsubscribe = subscribeStore(() => {
      setRequests(getRequests());
    });
    return unsubscribe;

   

  }, []);

  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  const handleTabSelect = useCallback((tabId) => {
    setActiveTab(tabId);
    if (tabId === "new-request") {
      setInitialCategory("Certificate");
      setNewRequestModalOpen(true);
    } else if (tabId === "ai-assistant") {
      setAiModalOpen(true);
    }
  }, []);

  const handleOpenCategoryRequest = useCallback((categoryName) => {
    setInitialCategory(categoryName);
    setNewRequestModalOpen(true);
  }, []);

  const handleViewRequest = useCallback((request) => {
    setSelectedRequestId(request.id);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedRequestId(null);
  }, []);

  const handleCreateRequest =useCallback((updatedRequest) => {
  console.log("REQUEST RECEIVED:", updatedRequest);

  console.log(
    "SLOT STATUS:",
    updatedRequest.slotAvailability?.status
  );

 
  addStudentRequest(updatedRequest);

  setRequests(getRequests()); 
    setSnackbarMessage("Request submitted successfully and routed for human verification.");
  }, []);

  
  const totalCount = requests.length;
  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "Pending" || r.status === "Under Review").length,
    [requests]
  );
  const approvedCount = useMemo(
    () => requests.filter((r) => r.status === "Completed").length,
    [requests]
  );
  const completedCount = useMemo(
    () => requests.filter((r) => r.status === "Completed").length,
    [requests]
  );

 
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (tableFilter === "all") return true;
      if (tableFilter === "pending")
        return r.status === "Pending" || r.status === "Under Review";
      if (tableFilter === "approved") return r.status === "Approved";
      if (tableFilter === "completed") return r.status === "Completed";
      return true;
    });
  }, [requests, tableFilter]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
   
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        isMobile={isMobile}
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
       
        <Header
          title={
            activeTab === "my-requests"
              ? "My Service Requests"
              : activeTab === "help"
              ? "Support & Help Desk"
              : "Student Service Dashboard"
          }
          subtitle="Human-in-the-Loop Institutional Service Delivery"
          onMenuToggle={() => setMobileDrawerOpen(true)}
          unreadCount={pendingCount}
        />

       
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flex: 1, maxWidth: 1400 }}>
        
          {activeTab === "dashboard" && (
            <Box>
            
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  mb: 3.5,
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: 0.5,
                      fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    }}
                  >
                    Welcome back,{name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Manage your institutional service requests from one place with Human-in-the-Loop verification.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineOutlined />}
                  onClick={() => {
                    setInitialCategory("Certificate");
                    setNewRequestModalOpen(true);
                  }}
                  sx={{
                    backgroundColor: "#14213d",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    px: 2.5,
                    py: 1.1,
                    borderRadius: 2,
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
                    },
                  }}
                >
                  New Request
                </Button>
              </Paper>

             
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Total Requests"
                    count={totalCount}
                    subtitle="All submitted records"
                    icon={AssignmentTurnedIn}
                    iconBg="#e0e7ff"
                    iconColor="#3730a3"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Pending / Review"
                    count={pendingCount}
                    subtitle="Awaiting officer verification"
                    icon={HourglassEmpty}
                    iconBg="#fef3c7"
                    iconColor="#92400e"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Approved"
                    count={approvedCount}
                    subtitle="Authorized by admin"
                    icon={CheckCircleOutlined}
                    iconBg="#dcfce7"
                    iconColor="#166534"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Completed"
                    count={completedCount}
                    subtitle="Service fulfilled"
                    icon={DoneAll}
                    iconBg="#f0fdf4"
                    iconColor="#15803d"
                  />
                </Grid>
              </Grid>

             
              <Box sx={{ mb: 4.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Start a New Request
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Select an institutional category to begin structured service delivery.
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ServiceCard
                      title="Certificate"
                      description="Request institutional certificates, transcripts, and official verification documents."
                      icon={DescriptionOutlined}
                      iconBg="#eff6ff"
                      iconColor="#1e40af"
                      onSelect={() => handleOpenCategoryRequest("Certificate")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ServiceCard
                      title="Maintenance"
                      description="Report campus, hostel, electrical, sanitation, or facility maintenance issues."
                      icon={BuildOutlined}
                      iconBg="#fef2f2"
                      iconColor="#991b1b"
                      onSelect={() => handleOpenCategoryRequest("Maintenance")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ServiceCard
                      title="Laboratory Booking"
                      description="Request laboratory access, HPC GPU cluster slots, or specialized equipment."
                      icon={ScienceOutlined}
                      iconBg="#f0fdf4"
                      iconColor="#166534"
                      onSelect={() => handleOpenCategoryRequest("Laboratory Booking")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ServiceCard
                      title="Grievance"
                      description="Submit an institutional grievance or academic dispute for formal administrative redressal."
                      icon={ReportProblemOutlined}
                      iconBg="#fffbeb"
                      iconColor="#b45309"
                      onSelect={() => handleOpenCategoryRequest("Grievance")}
                    />
                  </Grid>
                </Grid>
              </Box>

             
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4.5,
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
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      backgroundColor: "#f1f5f9",
                      color: "#14213d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyOutlined sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Need help with a service request?
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mt: 0.25 }}>
                      Describe what you need and the institutional AI assistant will evaluate policy rules and guide you to the right department.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => setAiModalOpen(true)}
                  endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#14213d",
                    borderColor: "#14213d",
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.9,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      borderColor: "#0f172a",
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  Open AI Assistant
                </Button>
              </Paper>

            
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      Recent Requests
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Track the real-time lifecycle and administrative sign-off for your submissions.
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setActiveTab("my-requests")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#14213d",
                      borderColor: "#cbd5e1",
                      borderRadius: 1.5,
                    }}
                  >
                    View All Requests
                  </Button>
                </Box>

                <RequestTable
                  requests={filteredRequests.slice(0, 5)}
                  onViewRequest={handleViewRequest}
                />
              </Box>
            </Box>
          )}

         
          {activeTab === "my-requests" && (
            <Box>
              {/* Summary Cards */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Total Requests"
                    count={totalCount}
                    subtitle="All submitted records"
                    icon={AssignmentTurnedIn}
                    iconBg="#e0e7ff"
                    iconColor="#3730a3"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Pending / Review"
                    count={pendingCount}
                    subtitle="Awaiting officer verification"
                    icon={HourglassEmpty}
                    iconBg="#fef3c7"
                    iconColor="#92400e"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Approved"
                    count={approvedCount}
                    subtitle="Authorized by admin"
                    icon={CheckCircleOutlined}
                    iconBg="#dcfce7"
                    iconColor="#166534"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Completed"
                    count={completedCount}
                    subtitle="Service fulfilled"
                    icon={DoneAll}
                    iconBg="#f0fdf4"
                    iconColor="#15803d"
                  />
                </Grid>
              </Grid>

             
              <Box sx={{ mb: 3 }}>
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
                      All My Service Requests ({requests.length})
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Complete submission history, policy verification logs, and human approval statuses.
                    </Typography>
                  </Box>

                  <Tabs
                    value={tableFilter}
                    onChange={(e, val) => setTableFilter(val)}
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
                    <Tab label="Completed" value="completed" />
                  </Tabs>
                </Box>

                <RequestTable
                  requests={filteredRequests}
                  onViewRequest={handleViewRequest}
                />
              </Box>
            </Box>
          )}

         
          {activeTab === "help" && (
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
                    Student Support & Institutional Help Desk
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                  Frequently asked questions regarding Human-in-the-Loop AI verification and service turnaround times.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Accordion
                    elevation={0}
                    defaultExpanded
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        How does the Human-in-the-Loop verification process work?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        When you submit a request, our Agentic AI immediately evaluates document completeness, prerequisites, and departmental bylaws. An authorized university verification officer then reviews the synthesized evidence and makes the final approval decision.
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
                        What is the average turnaround time for Certificate requests?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        Standard academic certificates (Bonafide, Medium of Instruction, Fee Estimate) are typically verified by officers within 24 to 48 business hours upon receipt of full supporting documents.
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
                        Can I edit my request after submission?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        Requests in "Pending" status can be reviewed and amended by contacting the academic desk or consulting the AI Assistant. Once an officer begins verification, requests are locked to ensure institutional audit trail integrity.
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
                        How do I escalate an urgent maintenance or grievance issue?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                        Select "Grievance" or "Maintenance" under New Request and provide critical details. High-priority submissions are automatically flagged with elevated priority in the administrative verification queue.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      
      <RequestDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        request={selectedRequest}
      />

      <NewRequestModal
        open={newRequestModalOpen}
        onClose={() => setNewRequestModalOpen(false)}
        initialCategory={initialCategory}
        onSubmitRequest={handleCreateRequest}
      />

      <AIAssistantModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarMessage("")}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
