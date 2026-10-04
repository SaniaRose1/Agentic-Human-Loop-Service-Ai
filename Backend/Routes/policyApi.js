import express from "express";
import mongoose from "mongoose";
import Request from "../Model/Request.js";

const router = express.Router();



router.post("/policy/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid request ID",
      });
    }

    
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    const violations = [];

    

    if (request.category === "Laboratory Booking") {
      
      if (!request.lab) {
        violations.push(
          "Laboratory must be selected."
        );
      }

     
      if (!request.date) {
        violations.push(
          "Laboratory booking date is required."
        );
      }

     
      if (!request.slot) {
        violations.push(
          "Laboratory time slot is required."
        );
      }

      
      if (
        !request.purpose ||
        request.purpose.trim() === ""
      ) {
        violations.push(
          "Booking purpose is required."
        );
      }

     
      if (request.date) {
        const requestedDate = new Date(request.date);

        requestedDate.setHours(0, 0, 0, 0);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
          violations.push(
            "Laboratory booking date cannot be in the past."
          );
        }
      }

     
      if (
        request.slotAvailability?.status ===
        "Already Booked"
      ) {
        violations.push(
          "The requested laboratory slot is already booked."
        );
      }

      
      if (
        request.slotAvailability?.status ===
        "Not Applicable"
      ) {
        violations.push(
          "Laboratory slot availability has not been verified."
        );
      }
    }

   

    else if (request.category === "Certificate") {
      if (!request.subType) {
        violations.push(
          "Certificate type must be selected."
        );
      }

      if (!request.title) {
        violations.push(
          "Certificate request title is required."
        );
      }

      if (
        !request.details ||
        request.details.trim() === ""
      ) {
        violations.push(
          "Certificate request details are required."
        );
      }
    }

    

    else if (request.category === "Maintenance") {
      if (!request.subType) {
        violations.push(
          "Maintenance issue type must be selected."
        );
      }

      if (!request.title) {
        violations.push(
          "Maintenance request title is required."
        );
      }

      if (
        !request.details ||
        request.details.trim() === ""
      ) {
        violations.push(
          "Maintenance issue details are required."
        );
      }
    }

    
    else if (request.category === "Grievance") {
      if (!request.subType) {
        violations.push(
          "Grievance type must be selected."
        );
      }

      if (!request.title) {
        violations.push(
          "Grievance title is required."
        );
      }

      if (
        !request.details ||
        request.details.trim() === ""
      ) {
        violations.push(
          "Grievance details are required."
        );
      }
    }

    

    else {
      violations.push(
        `No policy rules are configured for category: ${request.category}`
      );
    }

    

    let policyStatus;
    let score;
    let reason;

    if (violations.length === 0) {
      policyStatus = "Passed";
      score = 100;

      reason =
        "All applicable institutional policies have been satisfied.";
    } else {
      score = Math.max(
        0,
        100 - violations.length * 20
      );

     
      if (
        request.category === "Laboratory Booking" &&
        request.slotAvailability?.status ===
          "Already Booked"
      ) {
        policyStatus = "Failed";

        reason =
          "The request does not satisfy the laboratory booking policy.";
      } else {
        policyStatus = "Needs Review";

        reason =
          "One or more policy requirements need attention.";
      }
    }

  

    request.policyVerification = {
      status: policyStatus,
      score,
      reason,
      violations,
      checkedAt: new Date(),
    };

    await request.save();

   

    return res.status(200).json({
      message: "Policy verification completed",

      policyVerification:
        request.policyVerification,

      slotAvailability:
        request.slotAvailability,

      requestId: request._id,
    });
  } catch (error) {
    console.error(
      "POLICY VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      error: "Policy verification failed",
      details: error.message,
    });
  }
});

export default router;