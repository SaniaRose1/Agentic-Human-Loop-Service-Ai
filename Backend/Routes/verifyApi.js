import express from "express";
import Groq from "groq-sdk";
import Request from "../Model/Request.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/verify/:id", async (req, res) => {
  try {
    

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    console.log("Request received:", request);

    

    if (
      request.category === "Laboratory Booking" &&
      request.lab &&
      request.date &&
      request.slot
    ) {
      const selectedDate = new Date(request.date);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBooking = await Request.findOne({
        _id: {
          $ne: request._id,
        },

        category: "Laboratory Booking",

        lab: request.lab,

        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },

        slot: request.slot,

        status: {
          $ne: "Rejected",
        },
      });

      if (existingBooking) {
        request.slotAvailability = {
          status: "Already Booked",
          checkedAt: new Date(),
        };
      } else {
        request.slotAvailability = {
          status: "Available",
          checkedAt: new Date(),
        };
      }

      await request.save();

      console.log(
        "Lab slot availability:",
        request.slotAvailability.status
      );
    }

   

    const prompt = `
You are an AI verification assistant for an institutional student service portal.

Your job is to perform a PRELIMINARY verification of the following student service request.

You must check:

1. Whether the required information for the selected category is present.
2. Whether the information is logically consistent.
3. Whether the request purpose/details are understandable.
4. Whether the request appears to be a genuine institutional service request.
5. Whether any important information is missing.

IMPORTANT:
- Do not make assumptions about information that is not provided.
- Do not invent information.
- Do not make the final institutional approval decision.
- If information is missing or unclear, return "Needs Review".
- Return "Verified" only when the submitted information is sufficiently complete and consistent.
- Return "Invalid" when the request contains clearly invalid or contradictory information.
- Laboratory slot availability is checked separately by the database.
- Do NOT decide whether a laboratory slot is available.
- Do NOT change the slot availability status.

STUDENT REQUEST:

Name: ${request.name}

Registration: ${request.Registration}

Section: ${request.section}

Category: ${request.category}

Sub Type: ${request.subType || "Not provided"}

Title: ${request.title || "Not provided"}

Urgency: ${request.urgency || "Not provided"}

Details: ${request.details || "Not provided"}

Laboratory: ${request.lab || "Not applicable"}

Date: ${
      request.date
        ? request.date.toISOString().split("T")[0]
        : "Not applicable"
    }

Slot: ${request.slot || "Not applicable"}

Purpose: ${request.purpose || "Not applicable"}

DATABASE SLOT STATUS:
${
  request.category === "Laboratory Booking"
    ? request.slotAvailability?.status || "Not checked"
    : "Not Applicable"
}

CATEGORY RULES:

Certificate:
Required:
- subType
- title
- details

Maintenance:
Required:
- subType
- title
- details

Grievance:
Required:
- subType
- title
- details

Laboratory Booking:
Required:
- lab
- date
- slot
- purpose

For Laboratory Booking:
- Check that lab is provided.
- Check that date is provided and valid.
- Check that slot is provided.
- Check that purpose is understandable.
- Do not determine whether the slot is available.
- The database slot status is handled separately.

Return ONLY valid JSON in this exact format:

{
  "status": "Verified",
  "score": 95,
  "reason": "The request contains all required information and is internally consistent.",
  "missingFields": []
}

Possible status values:
"Verified"
"Needs Review"
"Invalid"

Score must be between 0 and 100.
`;

   
    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        temperature: 0,

        messages: [
          {
            role: "system",
            content:
              "You are a careful institutional request verification assistant. Always return valid JSON.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const aiText =
      completion.choices[0].message.content;

    console.log("AI verification:", aiText);

    

    let verification;

    try {
      verification = JSON.parse(aiText);
    } catch (parseError) {
      console.error(
        "AI JSON parsing failed:",
        aiText
      );

      return res.status(500).json({
        error:
          "AI returned invalid verification data",
      });
    }

    

    const allowedStatuses = [
      "Verified",
      "Needs Review",
      "Invalid",
    ];

    if (!allowedStatuses.includes(verification.status)) {
      return res.status(500).json({
        error:
          "AI returned an invalid verification status",
      });
    }

    

    request.aiVerification = {
      status: verification.status,

      score:
        typeof verification.score === "number"
          ? verification.score
          : 0,

      reason:
        verification.reason ||
        "No reason provided.",

      missingFields:
        Array.isArray(verification.missingFields)
          ? verification.missingFields
          : [],

      checkedAt: new Date(),
    };

    await request.save();

   

    return res.status(200).json({
      message: "AI verification completed",

      verification: request.aiVerification,

      slotAvailability:
        request.slotAvailability,
    });
  } catch (error) {
    console.error(
      "AI verification error:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
});

export default router;