import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long."]
  },

  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long."]
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(v);
      },
      message: "Enter a valid email address."
    }
  },

  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return !v || /^\d{10}$/.test(v); // ✅ allow blank or 10-digit
      },
      message: "Enter a valid 10-digit phone number."
    }
  },

  // ================== ADDRESS DETAILS ==================
  address: {
    houseNumber: {
      type: String,
      trim: true,
      maxlength: [20, "House number cannot exceed 20 characters."]
    },
    street: {
      type: String,
      trim: true,
      maxlength: [100, "Street cannot exceed 100 characters."]
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, "City name cannot exceed 50 characters."]
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, "State name cannot exceed 50 characters."]
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\d{6}$/.test(v); // ✅ allow blank or 6-digit
        },
        message: "Enter a valid 6-digit pincode."
      }
    }
  },

  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."]
  },

  resetToken: {
    type: String,
    default: null
  },

  resetTokenExpiry: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ================== PASSWORD HASHING ==================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ================== COMPARE PASSWORD ==================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);