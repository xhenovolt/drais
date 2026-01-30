/**
 * Receipt and Invoice Service - DRAIS v0.0.0046
 * 
 * Generates PDF receipts and invoices with school branding
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import db from '../db/index.js';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e40af',
    marginBottom: 4,
  },
  schoolInfo: {
    fontSize: 9,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  receiptNumber: {
    fontSize: 11,
    textAlign: 'center',
    backgroundColor: '#dbeafe',
    padding: 6,
    marginBottom: 12,
    color: '#1e40af',
  },
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    width: '60%',
    color: '#0f172a',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 6,
    fontWeight: 'bold',
    borderBottom: 1,
    borderBottomColor: '#cbd5e1',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCol: {
    flex: 1,
  },
  total: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    borderTop: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
  },
  signature: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 5,
    width: '40%',
  },
});

/**
 * Receipt PDF Document
 */
const ReceiptDocument = ({ receipt, school, student, transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>{school.name || 'School Name'}</Text>
        <Text style={styles.schoolInfo}>
          {school.address || ''} {school.city ? `| ${school.city}` : ''}
        </Text>
        <Text style={styles.schoolInfo}>
          {school.phone ? `Tel: ${school.phone}` : ''} {school.email ? `| Email: ${school.email}` : ''}
        </Text>
      </View>

      <Text style={styles.title}>Official Receipt</Text>

      <Text style={styles.receiptNumber}>
        Receipt No: {receipt.receiptNumber}
      </Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(transaction.transaction_date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>
            {student.first_name} {student.last_name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Admission No:</Text>
          <Text style={styles.value}>{student.admission_no}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Class:</Text>
          <Text style={styles.value}>{student.class_name || 'N/A'}</Text>
        </View>
        {transaction.payer_name && (
          <View style={styles.row}>
            <Text style={styles.label}>Paid By:</Text>
            <Text style={styles.value}>{transaction.payer_name}</Text>
          </View>
        )}
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCol, { flex: 3 }]}>Description</Text>
          <Text style={styles.tableCol}>Amount</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { flex: 3 }]}>
            {transaction.fee_item_name || 'School Fees Payment'}
          </Text>
          <Text style={styles.tableCol}>
            {school.currency || 'UGX'} {Number(transaction.amount).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Paid:</Text>
        <Text style={styles.totalAmount}>
          {school.currency || 'UGX'} {Number(transaction.amount).toLocaleString()}
        </Text>
      </View>

      {transaction.payment_method && (
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{transaction.payment_method}</Text>
          </View>
          {transaction.reference_number && (
            <View style={styles.row}>
              <Text style={styles.label}>Reference:</Text>
              <Text style={styles.value}>{transaction.reference_number}</Text>
            </View>
          )}
        </View>
      )}

      {receipt.balance !== undefined && (
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Previous Balance:</Text>
            <Text style={styles.value}>
              {school.currency || 'UGX'} {Number(receipt.previousBalance || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Current Balance:</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>
              {school.currency || 'UGX'} {Number(receipt.balance).toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.signature}>
        <Text style={{ fontSize: 9, color: '#64748b', textAlign: 'center' }}>
          Authorized Signature
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer-generated receipt. Valid without signature.
        </Text>
        <Text style={styles.footerText}>
          Generated: {new Date().toLocaleString()}
        </Text>
      </View>
    </Page>
  </Document>
);

/**
 * Invoice PDF Document
 */
const InvoiceDocument = ({ invoice, school, student, feeItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>{school.name || 'School Name'}</Text>
        <Text style={styles.schoolInfo}>
          {school.address || ''} {school.city ? `| ${school.city}` : ''}
        </Text>
        <Text style={styles.schoolInfo}>
          {school.phone ? `Tel: ${school.phone}` : ''} {school.email ? `| Email: ${school.email}` : ''}
        </Text>
      </View>

      <Text style={styles.title}>Fee Invoice</Text>

      <Text style={styles.receiptNumber}>
        Invoice No: {invoice.invoiceNumber}
      </Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(invoice.invoice_date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>
            {student.first_name} {student.last_name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Admission No:</Text>
          <Text style={styles.value}>{student.admission_no}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Class:</Text>
          <Text style={styles.value}>{student.class_name || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Term/Year:</Text>
          <Text style={styles.value}>
            Term {invoice.term}, {invoice.year}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCol, { flex: 3 }]}>Fee Item</Text>
          <Text style={styles.tableCol}>Amount</Text>
          <Text style={styles.tableCol}>Paid</Text>
          <Text style={styles.tableCol}>Balance</Text>
        </View>
        {feeItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCol, { flex: 3 }]}>{item.item_name}</Text>
            <Text style={styles.tableCol}>
              {Number(item.amount).toLocaleString()}
            </Text>
            <Text style={styles.tableCol}>
              {Number(item.amount_paid || 0).toLocaleString()}
            </Text>
            <Text style={styles.tableCol}>
              {Number(item.balance || 0).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Outstanding:</Text>
        <Text style={styles.totalAmount}>
          {school.currency || 'UGX'} {Number(invoice.total_balance).toLocaleString()}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Please ensure payment is made before the end of term.
        </Text>
        <Text style={styles.footerText}>
          Generated: {new Date().toLocaleString()}
        </Text>
      </View>
    </Page>
  </Document>
);

/**
 * Generate receipt for a transaction
 */
export async function generateReceipt(transactionId, schoolId) {
  try {
    // Get transaction details
    const transactionQuery = `
      SELECT 
        t.*,
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        pm.method_name as payment_method,
        fi.item_name as fee_item_name,
        sa.balance as current_balance
      FROM transactions t
      JOIN student s ON t.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
      LEFT JOIN student_fees sf ON t.student_fee_id = sf.id
      LEFT JOIN fee_items fi ON sf.fee_item_id = fi.id
      LEFT JOIN student_account sa ON s.id = sa.student_id 
        AND sa.term = t.term AND sa.year = t.year
      WHERE t.id = ? AND t.school_id = ?
    `;

    const transactions = await db.query(transactionQuery, [transactionId, schoolId]);
    
    if (!transactions || transactions.length === 0) {
      throw new Error('Transaction not found');
    }

    const transaction = transactions[0];

    // Get school info
    const schoolQuery = `SELECT * FROM schools WHERE id = ? LIMIT 1`;
    const schools = await db.query(schoolQuery, [schoolId]);
    const school = schools[0] || {};

    // Calculate previous balance
    const previousBalance = (transaction.current_balance || 0) + Number(transaction.amount);

    // Generate receipt number
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(transactionId).padStart(6, '0')}`;

    const receiptData = {
      receiptNumber,
      balance: transaction.current_balance || 0,
      previousBalance
    };

    const student = {
      first_name: transaction.first_name,
      last_name: transaction.last_name,
      admission_no: transaction.admission_no,
      class_name: transaction.class_name
    };

    // Generate PDF
    const receiptDoc = <ReceiptDocument 
      receipt={receiptData} 
      school={school} 
      student={student}
      transaction={transaction}
    />;

    const pdfBlob = await pdf(receiptDoc).toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Save to file system
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `receipt-${transactionId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, pdfBuffer);

    const fileUrl = `/uploads/receipts/${fileName}`;

    // Save receipt record
    const insertQuery = `
      INSERT INTO receipts (
        transaction_id, school_id, student_id, receipt_number,
        amount, file_url, file_size, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.query(insertQuery, [
      transactionId,
      schoolId,
      transaction.student_id,
      receiptNumber,
      transaction.amount,
      fileUrl,
      pdfBuffer.length
    ]);

    return {
      receiptNumber,
      fileUrl,
      fileName
    };
  } catch (error) {
    console.error('Generate receipt error:', error);
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
}

/**
 * Generate invoice for a student
 */
export async function generateInvoice(studentId, schoolId, term, year) {
  try {
    // Get student details
    const studentQuery = `
      SELECT 
        s.id, s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name
      FROM student s
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      WHERE s.id = ? AND s.school_id = ?
    `;

    const students = await db.query(studentQuery, [studentId, schoolId]);
    
    if (!students || students.length === 0) {
      throw new Error('Student not found');
    }

    const student = students[0];

    // Get school info
    const schoolQuery = `SELECT * FROM schools WHERE id = ? LIMIT 1`;
    const schools = await db.query(schoolQuery, [schoolId]);
    const school = schools[0] || {};

    // Get fee items with balances
    const feeItemsQuery = `
      SELECT 
        fi.item_name,
        sf.amount,
        COALESCE(SUM(t.amount), 0) as amount_paid,
        (sf.amount - COALESCE(SUM(t.amount), 0)) as balance
      FROM student_fees sf
      JOIN fee_items fi ON sf.fee_item_id = fi.id
      LEFT JOIN transactions t ON sf.id = t.student_fee_id AND t.status = 'completed'
      WHERE sf.student_id = ? AND sf.school_id = ? 
        AND sf.term = ? AND sf.year = ?
        AND sf.deleted_at IS NULL
      GROUP BY sf.id
      HAVING balance > 0
    `;

    const feeItems = await db.query(feeItemsQuery, [studentId, schoolId, term, year]);

    if (!feeItems || feeItems.length === 0) {
      throw new Error('No outstanding fees found');
    }

    const totalBalance = feeItems.reduce((sum, item) => sum + Number(item.balance), 0);

    // Generate invoice number
    const invoiceNumber = `INV-${year}-${term}-${String(studentId).padStart(6, '0')}-${Date.now()}`;

    const invoiceData = {
      invoiceNumber,
      invoice_date: new Date(),
      term,
      year,
      total_balance: totalBalance
    };

    // Generate PDF
    const invoiceDoc = <InvoiceDocument 
      invoice={invoiceData} 
      school={school} 
      student={student}
      feeItems={feeItems}
    />;

    const pdfBlob = await pdf(invoiceDoc).toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Save to file system
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'invoices');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `invoice-${studentId}-${term}-${year}-${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, pdfBuffer);

    const fileUrl = `/uploads/invoices/${fileName}`;

    // Save invoice record
    const insertQuery = `
      INSERT INTO invoices (
        school_id, student_id, invoice_number, term, year,
        total_amount, file_url, file_size, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.query(insertQuery, [
      schoolId,
      studentId,
      invoiceNumber,
      term,
      year,
      totalBalance,
      fileUrl,
      pdfBuffer.length
    ]);

    return {
      invoiceNumber,
      fileUrl,
      fileName,
      totalBalance
    };
  } catch (error) {
    console.error('Generate invoice error:', error);
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }
}

/**
 * Get receipts for a student
 */
export async function getStudentReceipts(studentId, schoolId, options = {}) {
  try {
    const { term, year } = options;

    let conditions = ['r.student_id = ?', 'r.school_id = ?'];
    let params = [studentId, schoolId];

    if (term) {
      conditions.push('t.term = ?');
      params.push(term);
    }

    if (year) {
      conditions.push('t.year = ?');
      params.push(year);
    }

    const query = `
      SELECT r.*, t.transaction_date
      FROM receipts r
      JOIN transactions t ON r.transaction_id = t.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY r.generated_at DESC
    `;

    const receipts = await db.query(query, params);

    return {
      success: true,
      data: receipts || []
    };
  } catch (error) {
    console.error('Get student receipts error:', error);
    throw new Error(`Failed to fetch receipts: ${error.message}`);
  }
}

/**
 * Get invoices for a student
 */
export async function getStudentInvoices(studentId, schoolId, options = {}) {
  try {
    const { term, year } = options;

    let conditions = ['student_id = ?', 'school_id = ?'];
    let params = [studentId, schoolId];

    if (term) {
      conditions.push('term = ?');
      params.push(term);
    }

    if (year) {
      conditions.push('year = ?');
      params.push(year);
    }

    const query = `
      SELECT * FROM invoices
      WHERE ${conditions.join(' AND ')}
      ORDER BY generated_at DESC
    `;

    const invoices = await db.query(query, params);

    return {
      success: true,
      data: invoices || []
    };
  } catch (error) {
    console.error('Get student invoices error:', error);
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
}
