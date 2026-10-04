import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { FactCheckOutlined } from "@mui/icons-material";
import StatusBadge from "../StatusBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import RiskBadge from "./RiskBadge";

export default function VerificationQueueTable({
  requests = [],
  onReviewRequest,
  emptyMessage = "No requests currently waiting in the verification queue.",
}) {
  if (!requests.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 2.5,
          border: "1px dashed #cbd5e1",
          backgroundColor: "#f8fafc",
        }}
      >
        <Typography variant="body1" sx={{ color: "#475569", fontWeight: 600, mb: 0.5 }}>
          {emptyMessage}
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          All incoming institutional submissions have been processed or are completed.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 800 }} aria-label="admin verification queue table">
        <TableHead sx={{ backgroundColor: "#f8fafc" }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                py: 1.75,
              }}
            >
              Request ID
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Requester / Student
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Service Category
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Submitted Date
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Status
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              AI Confidence
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Risk Level
            </TableCell>

            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {requests.map((row) => {
            const ai = row.aiVerification || {};

            return (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.15s ease",
                }}
              >
               
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: "0.875rem",
                  }}
                >
                  <Chip
                    size="small"
                    label={row.id}
                    sx={{
                      backgroundColor: "#14213d",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>

              
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.student}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", fontSize: "0.75rem" }}
                    >
                      Roll: {row.studentId} • {row.department}
                    </Typography>
                  </Box>
                </TableCell>

                
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.category}
                    </Typography>
                    {row.subType && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontSize: "0.72rem", display: "block" }}
                      >
                        {row.subType}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

               
                <TableCell sx={{ color: "#475569", fontSize: "0.85rem" }}>
                  {row.submittedDate}
                </TableCell>

               
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>

                
                <TableCell>
                  <ConfidenceIndicator
                    confidence={ai.confidence || 90}
                    label={ai.confidenceLabel}
                    size="small"
                  />
                </TableCell>

               
                <TableCell>
                  <RiskBadge
                    level={ai.risk?.level || "LOW"}
                    reason={ai.risk?.reason}
                  />
                </TableCell>

               
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<FactCheckOutlined sx={{ fontSize: 16 }} />}
                    onClick={() => onReviewRequest(row)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      backgroundColor: "#14213d",
                      color: "#ffffff",
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.6,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#0f172a",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)",
                      },
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
