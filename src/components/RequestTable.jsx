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
} from "@mui/material";
import { VisibilityOutlined } from "@mui/icons-material";
import StatusBadge from "./StatusBadge";

export default function RequestTable({ requests = [], onViewRequest }) {
  if (!requests.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2.5,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          No service requests found.
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
      <Table sx={{ minWidth: 650 }} aria-label="recent requests table">
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
              Service
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
              Submitted On
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
              Last Updated
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
          {requests.map((row) => (
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
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "0.875rem",
                }}
              >
                {row.id}
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
                    {row.service}
                  </Typography>
                  {row.subType && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", fontSize: "0.75rem" }}
                    >
                      {row.subType}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ color: "#475569", fontSize: "0.875rem" }}>
                {row.submittedOn}
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                {row.lastUpdated}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityOutlined sx={{ fontSize: 16 }} />}
                  onClick={() => onViewRequest(row)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "#14213d",
                    borderColor: "#cbd5e1",
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.4,
                    "&:hover": {
                      borderColor: "#14213d",
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
