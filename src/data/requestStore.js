
import { initialMockRequests, initialMockAuditEvents } from "./mockData";

export const STORAGE_KEY_REQUESTS = "campus_ai_requests";
export const STORAGE_KEY_AUDIT = "campus_ai_audit_events";
export const EVENT_STORE_UPDATED = "campus_ai_store_updated";


export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) return null;

    return JSON.parse(user);
  } catch (error) {
    console.error("Error reading logged-in user:", error);
    return null;
  }
};


export const getUserRequestStorageKey = () => {
  const user = getCurrentUser();

  if (!user) {
    return `${STORAGE_KEY_REQUESTS}_guest`;
  }

  const userId =
   user.Registration ||
    user.name ||
    "unknown";

  return `${STORAGE_KEY_REQUESTS}_${String(userId)
    .replace(/\s+/g, "_")
    .toLowerCase()}`;
};


export const getFormattedTimestamp = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toISOString().split("T")[0];
  return `${dateString} ${timeString}`;
};


export const normalizeRequest = (req) => {
  const category = req.category || req.service || "Certificate";
  const isLab = category === "Laboratory Booking" || category === "Laboratory & Equipment Access";
  const subType = req.subType || req.lab || req.title || "Institutional Request";
  const date = req.submittedDate || req.submittedOn || new Date().toISOString().split("T")[0];

  let desc = req.description || req.details || "";
  if (isLab && (!desc || desc.trim() === "")) {
    desc = `Lab: ${req.lab || subType} · Date: ${req.date || date} · Slot: ${req.slot || "N/A"}${req.purpose ? ` · Purpose: ${req.purpose}` : ""}`;
  }

  const title = req.title || req.subject || (isLab ? `Lab Booking: ${req.lab || subType}` : subType);

  const defaultExtractedInfo = isLab
    ? [
        { label: "Student Identity", value: `${req.student || req.studentName || "Unknown Student"} (Roll: ${req.studentId || req.Registration|| "N/A"})` },
        { label: "Student Section", value: req.studentSection || "N/A" },
        { label: "Department", value: req.department || "Computer Science & Engineering" },
        { label: "Laboratory", value: req.lab || subType },
        { label: "Booking Date", value: req.date || date },
        { label: "Time Slot", value: req.slot || "N/A" },
        { label: "Purpose", value: req.purpose || "Academic / Research Session" },
      ]
    : [
        { label: "Student Identity", value: `${req.student || req.studentName || "Unknown Student"} (Roll: ${req.studentId || req.Registration|| "N/A"})` },
        { label: "Student Section", value: req.studentSection || req.section|| "N/A" },
        { label: "Department", value: req.department || "Computer Science & Engineering" },
        { label: "Service Category", value: category },
        { label: "Specific Type", value: subType },
        { label: "Fee / Dues Status", value: "Verified Cleared" },
      ];

  return {
    ...req,
    id: req.id,
    service: category,
    category: category,
    subType: subType,
    lab: req.lab || (isLab ? subType : undefined),
    date: req.date || (isLab ? date : undefined),
    slot: req.slot,
    purpose: req.purpose,
    title: title,
    subject: req.subject || title,
    student: req.student || req.studentName || "Unknown Student",
    studentName: req.studentName || req.student || "Unknown Student",
    studentId: req.studentId || req.Registration || "N/A",
    Registration: req.Registration || req.studentId || "N/A",
    studentSection: req.studentSection || req.section|| "N/A",
    department: req.department || "Computer Science & Engineering",
    submittedDate: date,
    submittedOn: date,
    status: req.status || "Pending",
    lastUpdated: req.lastUpdated || "Just now",
    priority: req.priority || req.urgency || "Standard",
    urgency: req.urgency || req.priority || "Standard",
    description: desc,
    details: desc,
    officer: req.officer || "Pending Human Review Assignment",
    evidence: req.evidence || {
      fileName: `${category.toLowerCase().replace(/\s+/g, "_")}_document.pdf`,
      fileSize: "1.4 MB",
      uploadedOn: date,
      evidenceStatus: "Available for Review",
      verificationStatus: "Integrity Verified (Digital Seal Match)",
    },
    aiVerification: req.aiVerification || {
      intent: isLab
        ? `Laboratory Access — ${req.lab || subType}`
        : `${category} Request — ${subType}`,
      extractedInformation: defaultExtractedInfo,
      policyCheck: {
        status: "Passed",
        rule: isLab
          ? "Laboratory Scheduling Policy §2.4 — Departmental Lab Access"
          : `Institutional ${category} SOP §3.1`,
        details: isLab
          ? "Lab timetable slot availability and student departmental safety prerequisites verified."
          : "Student active enrollment and prerequisite clearance verified.",
      },
      evidenceCheck: {
        status: "Verified",
        details: "Institutional digital identity record and registration slip matched.",
      },
      confidence: 95,
      confidenceLabel: "High Confidence",
      risk: {
        level: "LOW",
        reason: isLab
          ? "Standard student laboratory slot reservation within permissible academic hours."
          : `Standard ${category.toLowerCase()} request with fully validated student records.`,
      },
      recommendation:
        "Request appears consistent with the submitted information and applicable service requirements. Human review required.",
    },
    policyVerification: req.policyVerification || {
    status: "Pending",
    score: null,
    reason: null,
    violations: [],
    checkedAt: null,
  },
  };
 
};


export const getUserAuditStorageKey = () => {
  const user = getCurrentUser();

  if (!user) {
    return `${STORAGE_KEY_AUDIT}_guest`;
  }

  const userId =
    user.Registration ||
    user.id ||
    user._id ||
    user.name ||
    "unknown";

  return `${STORAGE_KEY_AUDIT}_${String(userId)
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase()}`;
};

export const initStore = () => {
  try {
    const requestKey = getUserRequestStorageKey();

    const existingReqs = localStorage.getItem(requestKey);

   
    if (!existingReqs) {
      localStorage.setItem(requestKey, JSON.stringify([]));
    }

   const auditKey = getUserAuditStorageKey();

const existingAudit = localStorage.getItem(auditKey);

if (!existingAudit) {
  localStorage.setItem(
    auditKey,
    JSON.stringify([])
  );
}
  } catch (err) {
    console.error(
      "Failed to initialize request store in localStorage:",
      err
    );
  }
};


export const notifyStoreUpdated = () => {
  try {
    window.dispatchEvent(new CustomEvent(EVENT_STORE_UPDATED));
  } catch (err) {
    console.error("Failed to dispatch store update event:", err);
  }
};


export const getRequests = () => {
  initStore();
  try {
    const requestKey = getUserRequestStorageKey();
    const raw = localStorage.getItem(requestKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeRequest);
      }
    }
  } catch (err) {
    console.error("Error reading requests from localStorage:", err);
  }
  return [];
};


export const getAllRequestsForAdmin = () => {
  const allRequests = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (
        key &&
        key.startsWith(`${STORAGE_KEY_REQUESTS}_`) &&
        key !== `${STORAGE_KEY_REQUESTS}_guest`
      ) {
        const raw = localStorage.getItem(key);

        if (raw) {
          const parsed = JSON.parse(raw);

          if (Array.isArray(parsed)) {
            allRequests.push(...parsed);
          }
        }
      }
    }

    return allRequests.map(normalizeRequest);
  } catch (err) {
    console.error("Error reading all student requests:", err);
    return [];
  }
};


export const findRequestStorageKey = (requestId) => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (
        key &&
        key.startsWith(`${STORAGE_KEY_REQUESTS}_`) &&
        key !== `${STORAGE_KEY_REQUESTS}_guest`
      ) {
        const raw = localStorage.getItem(key);

        if (raw) {
          const requests = JSON.parse(raw);

          if (
            Array.isArray(requests) &&
            requests.some((request) => request.id === requestId)
          ) {
            return key;
          }
        }
      }
    }
  } catch (err) {
    console.error("Error finding request storage key:", err);
  }

  return null;
};

export const getAuditEvents = () => {
  initStore();
  try {
    const auditKey = getUserAuditStorageKey();
    const raw = localStorage.getItem(auditKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading audit events from localStorage:", err);
  }
  return initialMockAuditEvents;
};


export const generateNextRequestId = () => {
  const currentRequests = getAllRequestsForAdmin();
  let maxNum = 1005;

  currentRequests.forEach((r) => {
    if (r.id) {
      const match = r.id.match(/^REQ-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  return `REQ-${maxNum + 1}`;
};


export const saveRequests = (updatedRequests) => {
  try {
    localStorage.setItem(
      getUserRequestStorageKey(),
      JSON.stringify(updatedRequests)
    );

    notifyStoreUpdated();
  } catch (err) {
    console.error("Error saving requests to localStorage:", err);
  }
};


export const saveAuditEvents = (updatedAuditEvents) => {
  try {
    localStorage.setItem(getUserAuditStorageKey(), JSON.stringify(updatedAuditEvents));
    notifyStoreUpdated();
  } catch (err) {
    console.error("Error saving audit events to localStorage:", err);
  }
};


export const addStudentRequest = (payload = {}) => {
  const currentUser = getCurrentUser();

const studentName =
  currentUser?.name ||
  currentUser?.studentName ||
  "Unknown Student";

const studentRegistration =
  currentUser?.Registration ||
  currentUser?.registration ||
  "N/A";

const studentSection =
  currentUser?.section ||
  "N/A";
  const {
    category = "Certificate",
    subType = "",
    title = "",
    urgency = "Standard",
    details = "",
    priority = "Standard",
    subject = "",
    lab,
    date,
    slot,
    purpose,
  } = payload;

  const isLab = category === "Laboratory Booking" || category === "Laboratory & Equipment Access";
  const resolvedSubType = subType || lab || title || "Institutional Request";
  const resolvedTitle = title || subject || (isLab ? `Lab Booking: ${resolvedSubType}` : resolvedSubType);
  const resolvedUrgency = urgency || priority || "Standard";
  const resolvedDetails = details || (isLab ? `Lab: ${resolvedSubType} · Date: ${date} · Slot: ${slot} · Purpose: ${purpose}` : "");

  const nextId = generateNextRequestId();
  const timestamp = getFormattedTimestamp();
  const dateString = timestamp.split(" ")[0];

  const extractedInfo = isLab
    ? [
        { label: "Student Identity", value: `${studentName} (Roll: ${studentRegistration})` },
        { label: "Student Section", value: studentSection },
        { label: "Department", value: "Computer Science & Engineering" },
        { label: "Laboratory", value: lab || resolvedSubType },
        { label: "Booking Date", value: date || dateString },
        { label: "Time Slot", value: slot || "N/A" },
        { label: "Purpose", value: purpose || "Lab Session" },
      ]
    : [
        { label: "Student Identity", value: `${studentName} (Roll: ${studentRegistration})` },
         { label: "Student Section", value: studentSection },
        { label: "Department", value: "Computer Science & Engineering" },
        { label: "Service Category", value: category },
        { label: "Service SubType", value: resolvedSubType },
        { label: "Priority / Urgency", value: resolvedUrgency },
        { label: "Fee Clearance Status", value: "Cleared (Verified)" },
      ];

  const newReq = normalizeRequest({
    ...payload,

    id: payload.id || nextId,
    _id:payload._id,
    service: category,
    category: category,
    subType: resolvedSubType,
    lab: lab || (isLab ? resolvedSubType : undefined),
    date: date || (isLab ? dateString : undefined),
    slot,
    purpose,
    title: resolvedTitle,
    subject: resolvedTitle,
    student: studentName,
    studentName: studentName,
    studentId: studentRegistration,
    studentSection: studentSection,
    department: "Computer Science & Engineering",
    submittedDate: dateString,
    submittedOn: dateString,
    status: "Pending",
    lastUpdated: "Just now",
    priority: resolvedUrgency,
    urgency: resolvedUrgency,
    description: resolvedDetails,
    details: resolvedDetails,
    officer: "Pending Human Review Assignment",
    evidence: {
      fileName: `${category.toLowerCase().replace(/\s+/g, "_")}_document.pdf`,
      fileSize: "1.2 MB",
      uploadedOn: timestamp,
      evidenceStatus: "Available for Review",
      verificationStatus: "Integrity Verified (Digital Seal Match)",
    },
    aiVerification: {
  status: payload.aiVerification?.status || "Pending",
  score: payload.aiVerification?.score ?? null,
  reason: payload.aiVerification?.reason || null,
  missingFields: payload.aiVerification?.missingFields || [],
  checkedAt: payload.aiVerification?.checkedAt || null,

  intent: payload.aiVerification?.intent ||
    (isLab
      ? `Laboratory Access — ${lab || resolvedSubType}`
      : `${category} Request — ${resolvedSubType}`),

  extractedInformation:
    payload.aiVerification?.extractedInformation ||
    extractedInfo,

  policyCheck:
    payload.aiVerification?.policyCheck || {
      status: "Passed",
      rule: isLab
        ? "Laboratory Scheduling Policy §2.4 — Departmental Lab Access"
        : `Institutional ${category} SOP §3.1`,
      details: isLab
        ? "Lab timetable slot availability and student departmental safety prerequisites verified."
        : "Student active enrollment and prerequisite clearance verified.",
    },

  evidenceCheck:
    payload.aiVerification?.evidenceCheck || {
      status: "Verified",
      details:
        "Institutional digital identity record and registration slip matched.",
    },

  confidence:
    payload.aiVerification?.confidence ??
    payload.aiVerification?.score ??
    0,

  confidenceLabel:
    payload.aiVerification?.confidenceLabel || "High Confidence",

  risk:
    payload.aiVerification?.risk || {
      level: "LOW",
      reason: isLab
        ? "Standard student laboratory slot reservation within permissible academic hours."
        : `Standard ${category.toLowerCase()} request with fully validated student records.`,
    },

  recommendation:
    payload.aiVerification?.recommendation ||
    "Request appears consistent with the submitted information and applicable service requirements. Human review required.",
},

     
    
    slotAvailability: payload.slotAvailability || {
  status: "Not Applicable",
  checkedAt: null,
    },
    policyVerification: payload.policyVerification || {
  status: "Pending",
  score: null,
  reason: null,
  violations: [],
  checkedAt: null,
    }

  });

 
  const studentAuditEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp,
    actor: studentName,
    actorType: "STUDENT",
    action: "Request Submitted",
    requestId: nextId,
    details: isLab
      ? `Student submitted Laboratory Booking request: ${lab || resolvedSubType} on ${date || dateString} (${slot}).`
      : `Student submitted ${category} request: ${resolvedTitle || resolvedSubType}.`,
  };

  const aiAuditEvent = {
    id: `AUD-${(Date.now() + 1).toString().slice(-4)}`,
    timestamp,
    actor: "Agentic AI Core",
    actorType: "SYSTEM",
    action: "AI Verification Completed",
    requestId: nextId,
    details: `Intent: ${newReq.aiVerification?.intent || "Request verification"}. Policy: Passed. Confidence: ${newReq.aiVerification?.confidence ?? newReq.aiVerification?.score ?? "N/A"}%. Risk: ${newReq.aiVerification?.risk?.level || "N/A"}.`,
  };

  const currentRequests = getRequests();
  const updatedRequests = [newReq, ...currentRequests];

  const currentAudit = getAuditEvents();
  const updatedAudit = [studentAuditEvent, aiAuditEvent, ...currentAudit];

  localStorage.setItem(getUserRequestStorageKey(), JSON.stringify(updatedRequests));
  localStorage.setItem(getUserAuditStorageKey(), JSON.stringify(updatedAudit));

  notifyStoreUpdated();

  return newReq;
};


export const markRequestUnderReview = (
  requestId,
  adminName = getCurrentUser()?.name || "Admin"
) => {
  const timestamp = getFormattedTimestamp();

  const storageKey = findRequestStorageKey(requestId);

  if (!storageKey) {
    console.error("Request not found:", requestId);
    return;
  }

  const raw = localStorage.getItem(storageKey);
  const currentRequests = raw ? JSON.parse(raw) : [];

  const target = currentRequests.find((r) => r.id === requestId);

  if (!target || target.status !== "Pending") return;

  const updatedRequests = currentRequests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "Under Review",
          lastUpdated: "Just now",
        }
      : r
  );

  const reviewAuditEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp,
    actor: adminName,
    actorType: "ADMINISTRATOR",
    action: "Request Opened for Review",
    requestId,
    details: `Administrator initiated review of ${requestId} (${target.category}).`,
  };

  
  const auditKey = storageKey.replace(
    STORAGE_KEY_REQUESTS,
    STORAGE_KEY_AUDIT
  );

  const auditRaw = localStorage.getItem(auditKey);
  const currentAudit = auditRaw ? JSON.parse(auditRaw) : [];

  const updatedAudit = [reviewAuditEvent, ...currentAudit];

  localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
  localStorage.setItem(auditKey, JSON.stringify(updatedAudit));

  notifyStoreUpdated();
};

export const approveRequest = (
  requestId,
  adminName = getCurrentUser()?.name || "Admin"
) => {
  const timestamp = getFormattedTimestamp();

  const storageKey = findRequestStorageKey(requestId);

  if (!storageKey) {
    console.error("Request not found:", requestId);
    return;
  }

  const raw = localStorage.getItem(storageKey);
  const currentRequests = raw ? JSON.parse(raw) : [];

  const updatedRequests = currentRequests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "Completed",
          lastUpdated: "Just now",
        }
      : r
  );

  const approvalAuditEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp,
    actor: adminName,
    actorType: "ADMINISTRATOR",
    action: "Request Approved",
    requestId,
    details: `Request ${requestId} approved by Admin. Authorized for institutional execution.`,
  };

  const auditKey = storageKey.replace(
    STORAGE_KEY_REQUESTS,
    STORAGE_KEY_AUDIT
  );

  const auditRaw = localStorage.getItem(auditKey);
  const currentAudit = auditRaw ? JSON.parse(auditRaw) : [];

  const updatedAudit = [approvalAuditEvent, ...currentAudit];

  localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
  localStorage.setItem(auditKey, JSON.stringify(updatedAudit));

  notifyStoreUpdated();
};


export const rejectRequest = (
  requestId,
  reason,
  adminName = getCurrentUser()?.name || "Admin"
) => {
  const timestamp = getFormattedTimestamp();

  const storageKey = findRequestStorageKey(requestId);

  if (!storageKey) {
    console.error("Request not found:", requestId);
    return;
  }

  const raw = localStorage.getItem(storageKey);
  const currentRequests = raw ? JSON.parse(raw) : [];

  const updatedRequests = currentRequests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "Rejected",
          lastUpdated: "Just now",
          rejectionReason: reason,
        }
      : r
  );

  const rejectionAuditEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp,
    actor: adminName,
    actorType: "ADMINISTRATOR",
    action: "Request Rejected",
    requestId,
    details: `Request ${requestId} rejected by Admin. Reason: ${reason}`,
  };

  const auditKey = storageKey.replace(
    STORAGE_KEY_REQUESTS,
    STORAGE_KEY_AUDIT
  );

  const auditRaw = localStorage.getItem(auditKey);
  const currentAudit = auditRaw ? JSON.parse(auditRaw) : [];

  const updatedAudit = [rejectionAuditEvent, ...currentAudit];

  localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
  localStorage.setItem(auditKey, JSON.stringify(updatedAudit));

  notifyStoreUpdated();
};

export const editAndApproveRequest = (
  requestId,
  editedData,
  adminName = getCurrentUser()?.name || "Admin"
) => {
  const timestamp = getFormattedTimestamp();

  const storageKey = findRequestStorageKey(requestId);

  if (!storageKey) {
    console.error("Request not found:", requestId);
    return;
  }

  const raw = localStorage.getItem(storageKey);
  const currentRequests = raw ? JSON.parse(raw) : [];

  const updatedRequests = currentRequests.map((r) => {
    if (r.id === requestId) {
      const category = editedData.category || r.category;
      const subType = editedData.subType || r.subType;
      const desc = editedData.description || r.description;

      return {
        ...r,
        category,
        service: category,
        subType,
        description: desc,
        details: desc,
        adminEditNotes: editedData.adminEditNotes || "",
        status: "Completed",
        lastUpdated: "Just now",
      };
    }

    return r;
  });

  const editAuditEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp,
    actor: adminName,
    actorType: "ADMINISTRATOR",
    action: "Request Edited & Approved",
    requestId,
    details: `Request ${requestId} parameters modified and approved by Admin. Category: ${editedData.category}; Details: ${editedData.subType}.`,
  };

  const auditKey = storageKey.replace(
    STORAGE_KEY_REQUESTS,
    STORAGE_KEY_AUDIT
  );

  const auditRaw = localStorage.getItem(auditKey);
  const currentAudit = auditRaw ? JSON.parse(auditRaw) : [];

  const updatedAudit = [editAuditEvent, ...currentAudit];

  localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
  localStorage.setItem(auditKey, JSON.stringify(updatedAudit));

  notifyStoreUpdated();
};


export const subscribeStore = (onUpdate) => {
  const handleCustomEvent = () => {
    onUpdate();
  };

  const handleStorageEvent = (event) => {
    if (
      !event.key ||
      event.key === getUserRequestStorageKey() ||
      event.key === getUserAuditStorageKey()
    ) {
      onUpdate();
    }
  };

  window.addEventListener(EVENT_STORE_UPDATED, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENT_STORE_UPDATED, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
};
