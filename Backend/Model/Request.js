import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    Registration: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },
  
    category: {
      type: String,
     default:null,
      trim: true,
    },

    subType: {
      type: String,
      default:null,
      trim: true,
    },

    title: {
      type: String,
      default:null,
      trim: true,
    },

   

    urgency: {
      type: String,
      default: "Standard",
      trim: true,
    },

    

    details: {
      type: String,
      default:null,
      trim: true,
    },

    

    
    lab: {
      type: String,
      default: null,
      trim: true,
    },

    date: {
      type: Date,
      default: null,
    },

    slot: {
      type: String,
      default: null,
      trim: true,
    },

    purpose: {
      type: String,
      default: null,
      trim: true,
    },
    slotAvailability: {
      status: {
        type: String,
        enum: [
          "Not Applicable",
          "Available",
          "Already Booked",
        ],
        default: "Not Applicable",
      },

      checkedAt: {
        type: Date,
        default: null,
      },
    },

     aiVerification: {
      status: {
        type: String,
        enum: ["Pending", "Verified", "Needs Review", "Invalid"],
        default: "Pending",
      },

      score: {
        type: Number,
        default: null,
      },

      reason: {
        type: String,
        default: null,
      },

      missingFields: {
        type: [String],
        default: [],
      },

      checkedAt: {
        type: Date,
        default: null,
      },
    },
    policyVerification: {
  status: {
    type: String,
    enum: ["Pending", "Passed", "Failed", "Needs Review"],
    default: "Pending",
  },

  score: {
    type: Number,
    default: null,
  },

  reason: {
    type: String,
    default: null,
  },

  violations: {
    type: [String],
    default: [],
  },

  checkedAt: {
    type: Date,
    default: null,
  },
},
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Completed", "Rejected"],
    },
},{
    timestamps: true,
  })
const Request = mongoose.model("Request" , RequestSchema)
export default Request;