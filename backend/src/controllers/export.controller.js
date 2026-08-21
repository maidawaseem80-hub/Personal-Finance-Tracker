import { Parser } from "json2csv";
import Transaction from "../models/transaction.js";
import Category from "../models/category.js";
import PDFDocument from "pdfkit";

const exportTransactionsCSV = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const transactions = await Transaction.find({ user }).sort({ date: -1 });

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category = await Category.findById(t.category);
        return {
          date: t.date.toISOString().split("T")[0],
          type: t.type,
          category: category ? category.name : "Unknown",
          amount: t.amount,
          note: t.note || "",
        };
      })
    );

    const fields = ["date", "type", "category", "amount", "note"];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportTransactionsPDF = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const transactions = await Transaction.find({ user }).sort({ date: -1 });

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category = await Category.findById(t.category);
        return {
          date: t.date.toISOString().split("T")[0],
          type: t.type,
          category: category ? category.name : "Unknown",
          amount: t.amount,
          note: t.note || "",
        };
      })
    );

    res.header("Content-Type", "application/pdf");
    res.attachment("transactions.pdf");

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(18).text("Transaction Report", { align: "center" });
    doc.moveDown();

    rows.forEach((row) => {
      doc
        .fontSize(11)
        .text(
          `${row.date}  |  ${row.type}  |  ${row.category}  |  Rs. ${row.amount}  |  ${row.note}`
        );
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { exportTransactionsCSV, exportTransactionsPDF };