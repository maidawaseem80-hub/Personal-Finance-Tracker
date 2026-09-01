// import crypto from 'crypto';
// import bcrypt from 'bcrypt';
// import User from '../models/user.js';
// import generateToken from '../utils/generateToken.js';
// import asyncHandler from '../middleware/asyncHandler.js';
// import sendEmail from '../utils/sendEmail.js'; 

// export const updateProfile = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and email are required." });
//     }

//     const user = await User.findById(req.user._id ?? req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

   
//     if (email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Email is already in use." });
//       }
//     }

//     user.name = name;
//     user.email = email;

//     await user.save();

//     res.status(200).json({
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("updateProfile error:", error);
//     res.status(500).json({ message: "Failed to update profile." });
//   }
// };
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Current and new password are required." });
//     }

//     const user = await User.findById(req.user._id ?? req.user.id).select("+password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password is incorrect." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     res.status(200).json({ message: "Password changed successfully." });
//   } catch (error) {
//     console.error("changePassword error:", error);
//     res.status(500).json({ message: "Failed to change password." });
//   }
// };

// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists with this email');
//   }

//   const salt = await bcrypt.genSalt(10);
//   const passwordHash = await bcrypt.hash(password, salt);

//   const user = await User.create({ name, email, passwordHash });

//   res.status(201).json({
//     success: true,
//     data: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//     token: generateToken(user._id),
//   });
// });

// export const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }

//   const isMatch = await bcrypt.compare(password, user.passwordHash);
//   if (!isMatch) {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }

//   res.status(200).json({
//     success: true,
//     data: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//     token: generateToken(user._id),
//   });
// });

// export const getMe = asyncHandler(async (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: req.user,
//   });
// });

// export const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
  
//     return res.status(200).json({
//       success: true,
//       message: 'If that email exists, a reset link has been sent',
//     });
//   }

//   const resetToken = crypto.randomBytes(32).toString('hex');

//   user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

//   await user.save();

 
// const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
//   try {
//     await sendEmail({
//       to: user.email,
//       subject: 'Password Reset Request',
//       html: `
//         <p>Hi ${user.name || ''},</p>
//         <p>You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.</p>
//         <p><a href="${resetUrl}">${resetUrl}</a></p>
//         <p>If you didn't request this, you can safely ignore this email.</p>
//       `,
//       text: `You requested a password reset. Visit this link within 15 minutes: ${resetUrl}`,
//     });

//   }catch (err) {
//   console.error("EMAIL ERROR:");
//   console.error(err);

//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();

//   res.status(500).json({
//     success: false,
//     message: err.message,
//     error: err,
//   });
// };
//   res.status(200).json({
//     success: true,
//     message: 'If that email exists, a reset link has been sent',
//   });
// });


// export const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;

//   if (!password) {
//     res.status(400);
//     throw new Error("Password is required");
//   }

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken: hashedToken,
//     resetPasswordExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     res.status(400);
//     throw new Error("Invalid or expired reset token");
//   }

//   const salt = await bcrypt.genSalt(10);

//   user.passwordHash = await bcrypt.hash(password, salt);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;

//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Password reset successfully",
//   });
// });
import crypto from "crypto";
import bcrypt from "bcrypt";

import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// =========================================================
// Update Logged-in User Profile
// PUT /api/auth/profile
// =========================================================

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const user = await User.findById(
      req.user._id ?? req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({
        email,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use.",
        });
      }
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error);

    res.status(500).json({
      message: "Failed to update profile.",
    });
  }
};

// =========================================================
// Get User Preferences
// GET /api/auth/preferences
// =========================================================

export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id ?? req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,

      data: {
        currency:
          user.preferences?.currency || "PKR",

        emailNotifications:
          user.preferences?.emailNotifications ?? true,
      },
    });
  } catch (error) {
    console.error(
      "getPreferences error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch preferences.",
    });
  }
};

// =========================================================
// Update User Preferences
// PUT /api/auth/preferences
// =========================================================

export const updatePreferences = async (req, res) => {
  try {
    const {
      currency,
      emailNotifications,
    } = req.body;

    const allowedCurrencies = [
      "PKR",
      "USD",
      "EUR",
      "GBP",
    ];

    // -----------------------------------------
    // Validate currency
    // -----------------------------------------

    if (
      currency !== undefined &&
      !allowedCurrencies.includes(currency)
    ) {
      return res.status(400).json({
        message: "Invalid currency.",
      });
    }

    // -----------------------------------------
    // Validate email notification value
    // -----------------------------------------

    if (
      emailNotifications !== undefined &&
      typeof emailNotifications !== "boolean"
    ) {
      return res.status(400).json({
        message:
          "Email notifications must be a boolean.",
      });
    }

    const user = await User.findById(
      req.user._id ?? req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // -----------------------------------------
    // Ensure preferences object exists
    // -----------------------------------------

    if (!user.preferences) {
      user.preferences = {};
    }

    // -----------------------------------------
    // Update currency
    // -----------------------------------------

    if (currency !== undefined) {
      user.preferences.currency = currency;
    }

    // -----------------------------------------
    // Update email notifications
    // -----------------------------------------

    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications =
        emailNotifications;
    }

    await user.save();

    res.status(200).json({
      success: true,

      message:
        "Preferences updated successfully.",

      data: {
        currency:
          user.preferences.currency,

        emailNotifications:
          user.preferences.emailNotifications,
      },
    });
  } catch (error) {
    console.error(
      "updatePreferences error:",
      error
    );

    res.status(500).json({
      message: "Failed to update preferences.",
    });
  }
};

// =========================================================
// Change Password
// PUT /api/auth/password
// =========================================================

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current and new password are required.",
      });
    }

    const user = await User.findById(
      req.user._id ?? req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.passwordHash = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "changePassword error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to change password.",
    });
  }
};

// =========================================================
// Register User
// POST /api/auth/register
// =========================================================

export const registerUser = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      res.status(400);

      throw new Error(
        "User already exists with this email"
      );
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash =
      await bcrypt.hash(
        password,
        salt
      );

    const user = await User.create({
      name,
      email,
      passwordHash,

      preferences: {
        currency: "PKR",
        emailNotifications: true,
      },
    });

    // -----------------------------------------
    // Welcome Email
    // -----------------------------------------
    // This is NOT controlled by the
    // email notification preference.
    // -----------------------------------------

    try {
      await sendEmail({
        to: user.email,

        subject:
          "Welcome to Personal Finance Tracker!",

        html: `
          <p>Hi ${user.name || ""},</p>

          <p>
            Welcome to Personal Finance Tracker!
            Your account has been created successfully.
          </p>

          <p>
            Start tracking your income,
            expenses, and budgets right away.
          </p>
        `,

        text:
          `Welcome to Personal Finance Tracker, ${user.name || ""}! ` +
          `Your account has been created successfully.`,
      });
    } catch (err) {
      console.error(
        "Welcome email error:",
        err
      );

      // Don't block registration
      // if welcome email fails.
    }

    res.status(201).json({
      success: true,

      data: {
        id: user._id,
        name: user.name,
        email: user.email,

        preferences: {
          currency:
            user.preferences.currency,

          emailNotifications:
            user.preferences.emailNotifications,
        },
      },

      token: generateToken(user._id),
    });
  }
);

// =========================================================
// Login User
// POST /api/auth/login
// =========================================================

export const loginUser = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      res.status(401);

      throw new Error(
        "Invalid email or password"
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!isMatch) {
      res.status(401);

      throw new Error(
        "Invalid email or password"
      );
    }

    res.status(200).json({
      success: true,

      data: {
        id: user._id,
        name: user.name,
        email: user.email,

        preferences: {
          currency:
            user.preferences?.currency ||
            "PKR",

          emailNotifications:
            user.preferences
              ?.emailNotifications ??
            true,
        },
      },

      token: generateToken(user._id),
    });
  }
);

// =========================================================
// Get Current User
// GET /api/auth/me
// =========================================================

export const getMe = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);

// =========================================================
// Forgot Password
// POST /api/auth/forgot-password
// =========================================================

export const forgotPassword =
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,

        message:
          "If that email exists, a reset link has been sent",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpires =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,

        subject:
          "Password Reset Request",

        html: `
          <p>Hi ${user.name || ""},</p>

          <p>
            You requested a password reset.
            Click the link below to set a new password.
            This link expires in 15 minutes.
          </p>

          <p>
            <a href="${resetUrl}">
              ${resetUrl}
            </a>
          </p>

          <p>
            If you didn't request this,
            you can safely ignore this email.
          </p>
        `,

        text:
          `You requested a password reset. ` +
          `Visit this link within 15 minutes: ${resetUrl}`,
      });
    } catch (err) {
      console.error("EMAIL ERROR:");
      console.error(err);

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpires =
        undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }

    res.status(200).json({
      success: true,

      message:
        "If that email exists, a reset link has been sent",
    });
  });

// =========================================================
// Reset Password
// PUT /api/auth/reset-password/:token
// =========================================================

export const resetPassword =
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
      res.status(400);

      throw new Error(
        "Password is required"
      );
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });

    if (!user) {
      res.status(400);

      throw new Error(
        "Invalid or expired reset token"
      );
    }

    const salt =
      await bcrypt.genSalt(10);

    user.passwordHash =
      await bcrypt.hash(
        password,
        salt
      );

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    res.status(200).json({
      success: true,

      message:
        "Password reset successfully",
    });
  });