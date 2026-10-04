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
} from "@mui/material";
import {
  DescriptionOutlined,
  BuildOutlined,
  ScienceOutlined,
  ReportProblemOutlined,
  Close,
  Send,
} from "@mui/icons-material";

const serviceCategories = [
  {
    value: "Certificate",
    label: "Certificate & Document Request",
    icon: <DescriptionOutlined fontSize="small" />,
    subTypes: [
      "Bonafide Certificate",
      "Transcript Request",
      "Character Certificate",
      "Fee Paid Receipt",
      "Semester Result",
    ],
  },
  {
    value: "Maintenance",
    label: "Campus Maintenance & Facilities",
    icon: <BuildOutlined fontSize="small" />,
    subTypes: [
      "Electrical Issue",
      "AC / Cooling Issue",
      "Furniture Repair",
      "Plumbing / Water Issue",
      "Hostel Maintenance",
      "Classroom / Infrastructure Issue",
      "Other Maintenance",
    ],
  },
  {
    value: "Laboratory Booking",
    label: "Laboratory & Equipment Access",
    icon: <ScienceOutlined fontSize="small" />,
    subTypes: [
      "Computer Science & Engineering (CSE / IT) Labs",
      "Electronics & Communication Engineering (ECE) Labs",
      "Electrical & EEE Labs",
      "Mechanical Engineering Labs",
      "Civil Engineering Labs",
    ],
  },
  {
    value: "Grievance",
    label: "Institutional Grievance & Redressal",
    icon: <ReportProblemOutlined fontSize="small" />,
    subTypes: [
      "Academic & Examination Grievances",
      "Hostel & Mess Facilities",
      "Campus Infrastructure & Utilities",
      "Administrative & Fee-Related",
      "Transport & Bus Facility",
      "Safety, Security & Discipline",
    ],
  },
];

const labTimeSlots = [
  "7:45 AM – 8:30 AM",
  "8:30 AM – 9:15 AM",
  "9:15 AM – 10:00 AM",
  "10:00 AM – 10:45 AM",
  "10:45 AM – 11:30 AM",
  "11:30 AM – 3:45 PM",
  "3:45 PM – 4:30 PM",
  "4:30 PM – 5:15 PM",
  "5:15 PM – 6:00 PM",
  "6:00 PM – 6:45 PM",
];

const categoryPlaceholders = {
  Certificate: "e.g. Request for Semester 5 Bonafide Certificate",
  Maintenance: "e.g. Hostel Block B AC Repair",
  "Laboratory Booking": "e.g. CSE AI Lab Slot Request",
  "Laboratory & Equipment Access": "e.g. CSE AI Lab Slot Request",
  Grievance: "e.g. Digital Library Access Issue",
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function NewRequestModal({
  open,
  onClose,
  initialCategory = "Certificate",
  onSubmitRequest,
}) {
  const [category, setCategory] = useState(initialCategory);

  
  const [subType, setSubType] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("Standard");

  
  const [lab, setLab] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [name , setName]=useState("");
  const [Registration , setReg] = useState("");
  const [section , setSection] = useState("");

  const [error, setError] = useState("");

  const resetAllFields = () => {
    setSubType("");
    setTitle("");
    setDetails("");
    setUrgency("Standard");
    setLab("");
    setDate("");
    setSlot("");
    setPurpose("");
    setError("");
  };

  useEffect(() => {
    if (open) {
      const matched = serviceCategories.find(
        (c) => c.value === initialCategory || c.label === initialCategory
      ) || serviceCategories[0];

      setCategory(matched.value);
      resetAllFields();
    }
  }, [open, initialCategory]);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    resetAllFields();
  };

  const isLabBooking =
    category === "Laboratory Booking" ||
    category === "Laboratory & Equipment Access";

  const currentCategoryObj =
    serviceCategories.find(
      (c) => c.value === category || c.label === category
    ) || serviceCategories[0];

  const currentPlaceholder =
    categoryPlaceholders[category] || "e.g. Request for Semester 5 Bonafide Certificate";

  const handleSubmit = async (e) => {
  e.preventDefault();

  let payload;

  

  if (isLabBooking) {
    if (!lab || !date || !slot || !purpose.trim()) {
      setError(
        "Please select the lab, date, slot, and provide the purpose."
      );
      return;
    }

    payload = {
      category,
      lab,
      date,
      slot,
      purpose: purpose.trim(),
    };
  }

  

  else {
    if (!subType || !title.trim() || !details.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    payload = {
      category,
      subType,
      title: title.trim(),
      urgency,
      details: details.trim(),
    };
  }

  

  const student = localStorage.getItem("user");

  if (!student) {
    setError(
      "Student information not found! Please login again."
    );
    return;
  }

  const user = JSON.parse(student);

  setName(user.name);
  setReg(user.Registration);
  setSection(user.section);

  const data = {
    name: user.name,
    section: user.section,
    Registration: user.Registration,
    ...payload,
  };

  try {
    

    const res = await fetch(
      "http://localhost:5000/api/req/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    console.log("REQUEST RESPONSE:", result);

    if (!res.ok) {
      setError(result.error || "Request failed");
      return;
    }

    

    const savedRequest = result.request?._id;

    console.log("SAVED REQUEST ID:", savedRequest);

    let verificationResult = null;
    let policyResult = null;
    

    if (savedRequest) {
      try {
        const verifyResponse = await fetch(
          `http://localhost:5000/api/verify/verify/${savedRequest}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        verificationResult =
          await verifyResponse.json();

        console.log(
          "AI VERIFICATION RESULT:",
          verificationResult
        );

        if (!verifyResponse.ok) {
          console.error(
            "AI verification failed:",
            verificationResult
          );
        }
      } catch (aiError) {
        console.error(
          "AI verification failed:",
          aiError
        );
      }


      try {
    const policyResponse = await fetch(
      `http://localhost:5000/api/policy/policy/${savedRequest}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    policyResult =await policyResponse.json();

    console.log(
      "POLICY VERIFICATION RESULT:",
      policyResult
    );

    if (!policyResponse.ok) {
      console.error(
        "Policy verification failed:",
        policyResult
      );
    }

  } catch (policyError) {
    console.error(
      "Policy verification failed:",
      policyError
    );
  }
    }

    

    const updatedRequest = {
      ...(result.request || payload),

      aiVerification:
        verificationResult?.verification || result.aiVerification,

      slotAvailability:
        verificationResult?.slotAvailability ||
        result.slotAvailability,

      policyVerification:
      policyResult?.policyVerification ||
      result.request?.policyVerification || {
        status: "Pending",
        score: null,
        reason: null,
        violations: [],
        checkedAt: null,
      }
    };

    console.log(
      "UPDATED REQUEST:",
      updatedRequest
    );

    

    onSubmitRequest(updatedRequest);

    

    if (
      category === "Laboratory Booking" &&
      updatedRequest.slotAvailability
    ) {
      if (
        updatedRequest.slotAvailability.status ===
        "Available"
      ) {
        alert(
          "Request submitted successfully!\n\nLab slot is AVAILABLE."
        );
      } else {
        alert(
          "Request submitted successfully!\n\nThis lab slot is ALREADY BOOKED."
        );
      }
    } else {
      alert("Request submitted successfully!");
    }

    onClose();
    resetAllFields();

  } catch (error) {
    console.log(error);
    setError("Something went wrong. Try again.");
  }
};

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
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Create Institutional Service Request
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Request will be agentically parsed and routed for human verification.
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

      <Divider />

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 0.5 }}>
              {error}
            </Alert>
          )}

          
          <TextField
            select
            fullWidth
            label="Service Category"
            value={category}
            onChange={handleCategoryChange}
            size="small"
          >
            {serviceCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.icon}
                  <Typography variant="body2">{option.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

        
          {isLabBooking ? (
            <>
             
              <TextField
                select
                fullWidth
                label="Select Lab"
                value={lab}
                onChange={(e) => setLab(e.target.value)}
                size="small"
                required
              >
                {currentCategoryObj.subTypes.map((labOption) => (
                  <MenuItem key={labOption} value={labOption}>
                    {labOption}
                  </MenuItem>
                ))}
              </TextField>

             
              <TextField
                type="date"
                fullWidth
                label="Select Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                size="small"
                required
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: getTodayDateString() },
                }}
              />

              
              <TextField
                select
                fullWidth
                label="Select Available Slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                size="small"
                required
              >
                {labTimeSlots.map((timeSlot) => (
                  <MenuItem key={timeSlot} value={timeSlot}>
                    {timeSlot}
                  </MenuItem>
                ))}
              </TextField>

             
              <TextField
                fullWidth
                label="Purpose"
                placeholder="e.g. Project Development, Practical Session, Research Work"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                size="small"
                required
              />
            </>
          ) : (
           
            <>
              
              <TextField
                select
                fullWidth
                label="Service Type / Purpose"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                size="small"
                required
              >
                {currentCategoryObj.subTypes.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </TextField>

             
              <TextField
                fullWidth
                label="Subject / Title"
                placeholder={currentPlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                required
              />

              
              <TextField
                select
                fullWidth
                label="Priority / Urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                size="small"
              >
                <MenuItem value="Standard">Standard Institutional Processing</MenuItem>
                <MenuItem value="Urgent">Urgent (Requires Timely Endorsement)</MenuItem>
              </TextField>

             
              <TextField
                fullWidth
                label="Detailed Description"
                placeholder="Provide context, required semester/details, roll numbers, or specific instructions..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                multiline
                rows={4}
                required
              />
            </>
          )}
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
            startIcon={<Send sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: "#14213d",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2.5,
              "&:hover": { backgroundColor: "#0f172a" },
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
