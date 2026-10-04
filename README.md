# ServiceAI

**ServiceAI** is an AI-assisted institutional service request management system designed to streamline how students submit service requests and how administrators verify, review, approve, or reject them.

The system follows a **Human-in-the-Loop** workflow where AI helps verify request completeness and policy compliance, while the final decision remains with an authorized administrator.

---

## 🚀 Features

### 👨‍🎓 Student

- Student registration and login
- Submit institutional service requests
- Track submitted requests
- View request status and verification results
- AI-based request verification
- Policy verification
- Laboratory booking with slot availability checking
- View request workflow from submission to completion

### 👨‍💼 Administrator

- Admin login
- View requests from multiple students
- Open requests for human review
- Approve requests
- Reject requests with a reason
- Edit and approve requests
- View audit events
- Monitor request status

### 🤖 AI Verification

ServiceAI uses Groq-powered AI to analyze submitted requests and determine:

- Whether required information is present
- Request completeness
- Missing fields
- Verification confidence
- Reason for the verification result

### 📋 Policy Verification

After AI verification, the request is checked against institutional policy rules.

The policy verification can return:

- `Passed`
- `Failed`
- `Needs Review`
- `Pending`

### 🧑‍⚖️ Human-in-the-Loop

The final workflow is:

```text
Student Submission
        ↓
AI Verification
        ↓
Policy Check
        ↓
Human/Admin Review
        ↓
Completed / Rejected



🛠️ Tech Stack
Frontend
React.js
Vite
Material UI (MUI)
JavaScript
React Router
Local Storage
Backend
Node.js
Express.js
MongoDB
Mongoose
CORS
dotenv
Groq SDK
AI
Groq API
LLM-based request verification


ServiceAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   │   └── requestStore.js
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── Routes/
│   │   ├── Api.js
│   │   ├── SubmitApi.js
│   │   ├── verifyApi.js
│   │   └── policyApi.js
│   │
│   ├── model/
│   │   └── Request.js
│   │
│   ├── uptoskills.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore


🎯 Project Objective
The main objective of ServiceAI is to reduce manual effort in institutional service delivery while maintaining human oversight.
Instead of completely automating institutional decisions, the system uses AI as an assistive verification layer.
AI assists
   +
Policy validates
   +
Human decides
   =
Reliable Institutional Service Delivery


⭐ ServiceAI
AI-Assisted Human-in-the-Loop Institutional Service Delivery