import express from "express";
import Request from "../Model/Request.js";

const router = express.Router();

router.post("/request", async (req, res) => {
  try {
    const {
      name,
      Registration,
      section,
      category,
      subType,
      title,
      urgency,
      details,
      lab,
      date,
      slot,
      purpose,
    } = req.body;

    

    if (!name || !Registration || !section || !category) {
      return res.status(400).json({
        error:
          "Name, Registration, Section and Category are required.",
      });
    }
    
      let aiStatus = "Verified"
   

    if (category === "Laboratory Booking") {
      if (!lab || !date || !slot || !purpose?.trim()) {
        return res.status(400).json({
          error:
            "Lab, date, slot and purpose are required for laboratory booking.",
        });
      }

      const selectedDate = new Date(date);

      if (isNaN(selectedDate.getTime())) {
        return res.status(400).json({
          error: "Invalid laboratory booking date.",
        });
      }

     

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBooking = await Request.findOne({
        category: "Laboratory Booking",

        lab: lab,

        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },

        slot: slot,

        
        status: {
          $ne: "Rejected",
        },
      });

      let slotStatus = "Available";
     

      if (existingBooking) {
        slotStatus = "Already Booked";
      }

      

      const newRequest = await Request.create({
        name,
        Registration,
        section,

        category,

        
        subType: null,
        title: null,
        urgency: "Standard",
        details: null,

        lab,
        date: selectedDate,
        slot,
        purpose: purpose.trim(),

        slotAvailability: {
          status: slotStatus,
          checkedAt: new Date(),
        },

        aiVerification: {
          status: aiStatus,
        },

        status: "Pending",
      });

      return res.status(201).json({
        msg: "Laboratory booking request submitted successfully.",

        request: newRequest,

        slotAvailability: {
          status: slotStatus,
        },
      });
    }

    

    if (!subType || !title?.trim() || !details?.trim()) {
      return res.status(400).json({
        error:
          "Sub Type, Title and Details are required.",
      });
    }

    const newRequest = await Request.create({
      name,
      Registration,
      section,

      category,
      subType,
      title: title.trim(),
      urgency: urgency || "Standard",
      details: details.trim(),

      
      lab: null,
      date: null,
      slot: null,
      purpose: null,

      slotAvailability: {
        status: "Not Applicable",
        checkedAt: null,
      },

      aiVerification: {
        status: aiStatus,
      },

      status: "Pending",
    });

    return res.status(201).json({
      msg: "Request submitted successfully.",

      request: newRequest,

      slotAvailability: {
        status: "Not Applicable",
      },
    });
  } catch (error) {
    console.error("Request submission error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

export default router;