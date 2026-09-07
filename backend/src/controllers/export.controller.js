import { Parser } from "json2csv";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";

import Transaction from "../models/transaction.js";
import Category from "../models/category.js";
import User from "../models/user.js";

import formatCurrency from "../utils/currency.js";

// =========================
// Get User From Token
// =========================

const getUserFromToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  return decoded.id;
};

// =========================
// Export Transactions CSV
// =========================

const exportTransactionsCSV = async (
  req,
  res
) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    let user;

    try {
      user = getUserFromToken(token);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // =========================
    // Get User Currency
    // =========================

    const userData = await User.findById(
      user
    ).select("preferences");

    const currency =
      userData?.preferences?.currency ||
      "PKR";

    // =========================
    // Get Transactions
    // =========================

    const transactions =
      await Transaction.find({
        user,
      }).sort({
        date: -1,
      });

    // =========================
    // Build CSV Rows
    // =========================

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category =
          await Category.findById(
            t.category
          );

        return {
          date: t.date
            .toISOString()
            .split("T")[0],

          type: t.type,

          category: category
            ? category.name
            : "Unknown",

          amount: formatCurrency(
            t.amount,
            currency
          ),

          note: t.note || "",
        };
      })
    );

    // =========================
    // CSV Fields
    // =========================

    const fields = [
      {
        label: "Date",
        value: "date",
      },

      {
        label: "Type",
        value: "type",
      },

      {
        label: "Category",
        value: "category",
      },

      {
        label: `Amount (${currency})`,
        value: "amount",
      },

      {
        label: "Note",
        value: "note",
      },
    ];

    // =========================
    // Generate CSV
    // =========================

    const parser = new Parser({
      fields,
    });

    const csv = parser.parse(rows);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(
      "transactions.csv"
    );

    res.send(csv);
  } catch (error) {
    console.error(
      "Export transactions CSV error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Export Transactions PDF
// =========================

const exportTransactionsPDF = async (
  req,
  res
) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    let user;

    try {
      user = getUserFromToken(token);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // =========================
    // Get User Currency
    // =========================

    const userData = await User.findById(
      user
    ).select("preferences");

    const currency =
      userData?.preferences?.currency ||
      "PKR";

    // =========================
    // Get Transactions
    // =========================

    const transactions =
      await Transaction.find({
        user,
      }).sort({
        date: -1,
      });

    // =========================
    // Build Rows
    // =========================

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category =
          await Category.findById(
            t.category
          );

        return {
          date: t.date
            .toISOString()
            .split("T")[0],

          type: t.type,

          category: category
            ? category.name
            : "Unknown",

          amount: formatCurrency(
            t.amount,
            currency
          ),

          note: t.note || "",
        };
      })
    );

    // =========================
    // PDF Response Headers
    // =========================

    res.header(
      "Content-Type",
      "application/pdf"
    );

    res.attachment(
      "transactions.pdf"
    );

    // =========================
    // Create PDF
    // =========================

    const doc = new PDFDocument({
      margin: 40,
    });

    doc.pipe(res);

    // =========================
    // PDF Title
    // =========================

    doc
      .fontSize(18)
      .text(
        "Transaction Report",
        {
          align: "center",
        }
      );

    doc.moveDown();

    // =========================
    // Currency Information
    // =========================

    doc
      .fontSize(10)
      .text(
        `Currency: ${currency}`,
        {
          align: "center",
        }
      );

    doc.moveDown();

    // =========================
    // Transactions
    // =========================

    rows.forEach((row) => {
      doc
        .fontSize(11)
        .text(
          `Date: ${row.date}    Type: ${row.type}    Category: ${row.category}    Amount: ${row.amount}`
        );

      if (row.note) {
        doc
          .fontSize(9)
          .fillColor("gray")
          .text(
            `Note: ${row.note}`
          );

        doc.fillColor("black");
      }

      doc.moveDown(0.5);
    });

    // =========================
    // Finish PDF
    // =========================

    doc.end();
  } catch (error) {
    console.error(
      "Export transactions PDF error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Exports
// =========================

export {
  exportTransactionsCSV,
  exportTransactionsPDF,
};