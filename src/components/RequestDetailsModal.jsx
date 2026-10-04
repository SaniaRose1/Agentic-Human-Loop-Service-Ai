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
} from "@mui/material";

import {
  CheckCircle,
  RadioButtonUnchecked,
  HourglassEmpty,
  VerifiedUserOutlined,
  ShieldOutlined,
  AdminPanelSettingsOutlined,
  TaskAltOutlined,
  AssignmentOutlined,
  Close,
 CancelOutlined,
 
 
} from "@mui/icons-material";

import StatusBadge from "./StatusBadge";

const workflowSteps = [
  {
    step: 1,
    title: "Submitted",
    description: "Student service request created and timestamped.",
    icon: <AssignmentOutlined fontSize="small" />,
  },
  {
    step: 2,
    title: "AI Verification",
    description:
      "Agentic AI verifies request completeness and document integrity.",
    icon: <VerifiedUserOutlined fontSize="small" />,
  },
  {
    step: 3,
    title: "Policy Check",
    description:
      "Institutional rules, prerequisites, and eligibility evaluated.",
    icon: <ShieldOutlined fontSize="small" />,
  },
  {
    step: 4,
    title: "Human Review",
    description:
      "Authorized institutional officer reviews and signs off.",
    icon: <AdminPanelSettingsOutlined fontSize="small" />,
  },
  {
    step: 5,
    title: "Completed",
    description:
      "Final decision enacted and institutional outcome delivered.",
    icon: <TaskAltOutlined fontSize="small" />,
  },
];

export default function RequestDetailsModal({
  open,
  onClose,
  request,
}) {
  if (!request) return null;

  
 console.log("full request" , request);
 console.log("ai verification" , request.aiVerification)
  const aiVerification = request.aiVerification;

  const aiStatus = request.aiVerification?.status || "Pending";
  const slotStatus = request.slotAvailability?.status || "Not Applicable"
  const policyVerification = request.policyVerification;

const policyStatus =
  request.policyVerification?.status || "Pending";

  const requestStatus = request.status || "Pending"

  
   let currentStepIndex = 1;


if (aiStatus === "Pending") {
  currentStepIndex = 1;
}


else if (
  aiStatus === "Verified" &&
  policyStatus === "Pending"
) {
  currentStepIndex = 2;
}


else if (
  aiStatus === "Verified" &&
  (
    policyStatus === "Failed" ||
    policyStatus === "Needs Review"
  )
) {
  currentStepIndex = 2;
}


else if (
  aiStatus === "Verified" &&
  policyStatus === "Passed" &&
  requestStatus === "Pending"
) {
  currentStepIndex = 3;
}


else if (
  aiStatus === "Verified" &&
  policyStatus === "Passed" &&
  requestStatus === "Approved"
) {
  currentStepIndex = 4;
}

else if (requestStatus === "Completed") {
  currentStepIndex = 4;
}
  

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {request.id || request._id}
            </Typography>

            <StatusBadge status={request.status} />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {request.service ||
              request.category ||
              "Institutional Request"}{" "}
            — {request.subType || "Institutional Request"}
          </Typography>
        </Box>

        <Button
          onClick={onClose}
          size="small"
          sx={{
            minWidth: "auto",
            p: 0.5,
            color: "#64748b",
          }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2.5 }}>
       

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              SUBMITTED ON
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              {request.submittedOn ||
                (request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString()
                  : "Not available")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              DEPARTMENT
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              {request.department || "Academic Affairs"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              LAST UPDATED
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              {request.lastUpdated ||
                (request.updatedAt
                  ? new Date(request.updatedAt).toLocaleDateString()
                  : "Not available")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              ASSIGNED OFFICER
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              {request.officer ||
                "Admin Desk (Academic Sec.)"}
            </Typography>
          </Grid>
        </Grid>

       

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#f8fafc",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1,
            }}
          >
            Request Details
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            {request.details ||
              request.purpose ||
              "Request submitted for official institutional processing."}
          </Typography>
        </Paper>

       {request.category === "Laboratory Booking" && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2">
      Slot Availability
    </Typography>

    {slotStatus === "Available" && (
      <Typography sx={{ color: "green", fontWeight: 600 }}>
        ✓ SLOT AVAILABLE
      </Typography>
    )}

    {slotStatus === "Already Booked" && (
      <Typography sx={{ color: "red", fontWeight: 600 }}>
        ✕ SLOT ALREADY BOOKED
      </Typography>
    )}

    {slotStatus === "Not Applicable" && (
      <Typography>
        Not Applicable
      </Typography>
    )}
  </Box>
)}
        {aiVerification && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor:
                aiStatus === "Verified"
                  ? "#bbf7d0"
                  : aiStatus === "Invalid"
                  ? "#fecaca"
                  : "#fde68a",

              backgroundColor:
                aiStatus === "Verified"
                  ? "#f0fdf4"
                  : aiStatus === "Invalid"
                  ? "#fef2f2"
                  : "#fffbeb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              {aiStatus === "Verified" ? (
                <CheckCircle
                  sx={{
                    color: "#16a34a",
                    fontSize: 22,
                  }}
                />
              ) : aiStatus === "Invalid" ? (
                <CancelOutlined
                  sx={{
                    color: "#dc2626",
                    fontSize: 22,
                  }}
                />
              ) : (
                <HourglassEmpty
                  sx={{
                    color: "#d97706",
                    fontSize: 22,
                  }}
                />
              )}

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                AI Verification Result
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                color:
                  aiStatus === "Verified"
                    ? "#15803d"
                    : aiStatus === "Invalid"
                    ? "#b91c1c"
                    : "#92400e",
              }}
            >
              Status: {aiStatus}
            </Typography>

            {aiVerification.score !== null &&
              aiVerification.score !== undefined && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#475569",
                    mb: 0.5,
                  }}
                >
                  Verification Score:{" "}
                  <strong>
                    {aiVerification.score}/100
                  </strong>
                </Typography>
              )}

            {aiVerification.reason && (
              <Typography
                variant="body2"
                sx={{
                  color: "#475569",
                  lineHeight: 1.5,
                }}
              >
                {aiVerification.reason}
              </Typography>
            )}

            {aiVerification.missingFields &&
              aiVerification.missingFields.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      mb: 0.5,
                    }}
                  >
                    Missing Fields:
                  </Typography>

                  {aiVerification.missingFields.map(
                    (field, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          ml: 1,
                        }}
                      >
                        • {field}
                      </Typography>
                    )
                  )}
                </Box>
              )}
          </Paper>
        )}

       {policyVerification && (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 3,
      borderRadius: 2,
      border: "1px solid",
      borderColor:
        policyStatus === "Passed"
          ? "#bbf7d0"
          : policyStatus === "Failed"
          ? "#fecaca"
          : "#fde68a",

      backgroundColor:
        policyStatus === "Passed"
          ? "#f0fdf4"
          : policyStatus === "Failed"
          ? "#fef2f2"
          : "#fffbeb",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
      }}
    >
      {policyStatus === "Passed" ? (
        <CheckCircle
          sx={{
            color: "#16a34a",
            fontSize: 22,
          }}
        />
      ) : policyStatus === "Failed" ? (
        <CancelOutlined
          sx={{
            color: "#dc2626",
            fontSize: 22,
          }}
        />
      ) : (
        <HourglassEmpty
          sx={{
            color: "#d97706",
            fontSize: 22,
          }}
        />
      )}

      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        Policy Verification Result
      </Typography>
    </Box>

    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        mb: 0.5,
        color:
          policyStatus === "Passed"
            ? "#15803d"
            : policyStatus === "Failed"
            ? "#b91c1c"
            : "#92400e",
      }}
    >
      Status: {policyStatus}
    </Typography>

    {policyVerification.score !== null &&
      policyVerification.score !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: "#475569",
            mb: 0.5,
          }}
        >
          Policy Score:{" "}
          <strong>
            {policyVerification.score}/100
          </strong>
        </Typography>
      )}

    {policyVerification.reason && (
      <Typography
        variant="body2"
        sx={{
          color: "#475569",
          lineHeight: 1.5,
        }}
      >
        {policyVerification.reason}
      </Typography>
    )}

    {policyVerification.violations &&
      policyVerification.violations.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#475569",
              mb: 0.5,
            }}
          >
            Policy Issues:
          </Typography>

          {policyVerification.violations.map(
            (violation, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#64748b",
                  ml: 1,
                }}
              >
                • {violation}
              </Typography>
            )
          )}
        </Box>
      )}
  </Paper>
)}

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              mb: 1,
            }}
          >
            Human-in-the-Loop Service Lifecycle
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Autonomous agentic verification is supervised
            by institutional administrators prior to final
            decision.
          </Typography>

         

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {workflowSteps.map((s, idx) => {
             const isAI =
  s.title === "AI Verification";

const isPolicy =
  s.title === "Policy Check";

const isHumanReview =
  s.title === "Human Review";

const isCompletedStep =
  s.title === "Completed";




const isAICompleted =
  isAI && aiStatus === "Verified";

const isAIInvalid =
  isAI && aiStatus === "Invalid";

const isAIReview =
  isAI && aiStatus === "Needs Review";

const isAIPending =
  isAI && aiStatus === "Pending";




const isPolicyCompleted =
  isPolicy && policyStatus === "Passed";

const isPolicyFailed =
  isPolicy && policyStatus === "Failed";

const isPolicyReview =
  isPolicy && policyStatus === "Needs Review";

const isPolicyPending =
  isPolicy && policyStatus === "Pending";




const isHumanReviewCompleted =
  isHumanReview &&
  (
    requestStatus === "Approved" ||
    requestStatus === "Completed"
  );

const isHumanReviewCurrent =
  isHumanReview &&
  requestStatus !== "Approved" &&
  requestStatus !== "Completed" &&
   requestStatus !== "Rejected";




  
const isHumanReviewRejected =
  isHumanReview &&
  requestStatus === "Rejected";

const isFinalRejected =
  isCompletedStep &&
  requestStatus === "Rejected";

  const isRejectedStep =
  isHumanReviewRejected || isFinalRejected;

const isFinalCompleted =
  isCompletedStep &&
  requestStatus === "Completed";


const isCompleted =
  isAI
    ? isAICompleted
    : isPolicy
    ? isPolicyCompleted
    : isHumanReview
    ? isHumanReviewCompleted
    : isCompletedStep
    ? isFinalCompleted
    : idx < currentStepIndex;


const isCurrent =
  isAI
    ? isAIPending || isAIReview
    : isPolicy
    ? isPolicyPending || isPolicyReview
    : isHumanReview
    ? isHumanReviewCurrent
    :isCompletedStep
    ?false
    : idx === currentStepIndex;


const isPending =
  !isCompleted && !isCurrent;

              return (
                <Box
                  key={s.step}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",

                    borderColor: isAIInvalid || isPolicyFailed || isRejectedStep
                      ? "#fecaca"
                      : isCompleted
                      ? "#bbf7d0"
                      : isCurrent
                      ? "#14213d"
                      : "#e2e8f0",

                    backgroundColor: isAIInvalid || isPolicyFailed || isRejectedStep
                      ? "#fef2f2"
                      : isCompleted
                      ? "#f0fdf4"
                      : isCurrent
                      ? "#f1f5f9"
                      : "#ffffff",
                  }}
                >
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",

                      backgroundColor:
                        isAIInvalid || isPolicyFailed || isRejectedStep
                          ? "#dc2626"
                          : isCompleted
                          ? "#16a34a"
                          : isCurrent
                          ? "#14213d"
                          : "#e2e8f0",

                      color:
                        isAIInvalid ||
                        isCompleted ||
                        isCurrent
                          ? "#ffffff"
                          : "#64748b",

                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {isAIInvalid || isPolicyFailed || isRejectedStep ? (
                      <CancelOutlined
                        sx={{ fontSize: 18 }}
                      />
                    ) : isCompleted ? (
                      <CheckCircle
                        sx={{ fontSize: 18 }}
                      />
                    ) : isCurrent ? (
                      <HourglassEmpty
                        sx={{ fontSize: 16 }}
                      />
                    ) : (
                      <RadioButtonUnchecked
                        sx={{ fontSize: 16 }}
                      />
                    )}
                  </Box>

                 

                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,

                          color:
                            isAIInvalid 
                              ? "#b91c1c"
                              : isPending &&
                                !isCurrent
                              ? "#64748b"
                              : "#0f172a",
                        }}
                      >
                        Step {s.step}: {s.title}
                      </Typography>

                    
                      {isCompleted && !isRejectedStep && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            fontWeight: 600,
                            fontSize: "0.68rem",
                          }}
                        >
                          VERIFIED
                        </Typography>
                      )}

                     {isRejectedStep && (
  <Typography
    variant="caption"
    sx={{
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      px: 1,
      py: 0.2,
      borderRadius: 1,
      fontWeight: 600,
      fontSize: "0.68rem",
    }}
  >
    REJECTED
  </Typography>
)}
                      {isCurrent &&
                        !isAIReview && (
                          <Typography
                            variant="caption"
                            sx={{
                              backgroundColor: "#14213d",
                              color: "#ffffff",
                              px: 1,
                              py: 0.2,
                              borderRadius: 1,
                              fontWeight: 600,
                              fontSize: "0.68rem",
                            }}
                          >
                            IN PROGRESS
                          </Typography>
                        )}

                    
                      {isAIReview && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            fontWeight: 600,
                            fontSize: "0.68rem",
                          }}
                        >
                          NEEDS REVIEW
                        </Typography>
                      )}

                     
                      {isAIInvalid && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            fontWeight: 600,
                            fontSize: "0.68rem",
                          }}
                        >
                          INVALID
                        </Typography>
                      )}

                      {isPolicyReview && (
  <Typography
    variant="caption"
    sx={{
      backgroundColor: "#fef3c7",
      color: "#92400e",
      px: 1,
      py: 0.2,
      borderRadius: 1,
      fontWeight: 600,
      fontSize: "0.68rem",
    }}
  >
    NEEDS REVIEW
  </Typography>
)}

{isPolicyFailed && (
  <Typography
    variant="caption"
    sx={{
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      px: 1,
      py: 0.2,
      borderRadius: 1,
      fontWeight: 600,
      fontSize: "0.68rem",
    }}
  >
    FAILED
  </Typography>
)}
                      </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          isAIInvalid
                            ? "#b91c1c"
                            : isPending &&
                              !isCurrent
                            ? "#94a3b8"
                            : "#475569",

                        display: "block",
                        mt: 0.25,
                      }}
                    >
                      {s.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>

    

      <Divider />

      <DialogActions
        sx={{
          p: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#14213d",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            px: 3,

            "&:hover": {
              backgroundColor: "#0f172a",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}