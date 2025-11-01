import React, { useRef } from 'react';
import { format, parseISO } from 'date-fns';
import './InvoicePreview.css';

const InvoicePreview = ({ invoice, onClose, onEdit, onMarkAsPaid }) => {
  const invoiceRef = useRef();

  const handlePrint = () => {
    performPrint();
  };

  const performPrint = () => {
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body { 
                font-family: 'Inter', sans-serif; 
                margin: 0; 
                padding: 10px; 
                color: #1e293b; 
                background: white;
                font-size: 14px;
                line-height: 1.4;
              }
              
              .invoice-container { 
                max-width: 100%;
                margin: 0 auto;
                padding: 0;
              }
              
              /* Compact Header with Larger Fonts */
              .company-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #2563eb;
                gap: 15px;
              }
              
              .logo-section {
                flex: 1;
              }
              
              .logo {
                max-width: 100px;
                height: auto;
                margin-bottom: 8px;
              }
              
              .company-info h1 {
                color: #2563eb;
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 4px;
              }
              
              .company-info p {
                color: #64748b;
                font-size: 12px;
                margin: 2px 0;
                line-height: 1.3;
              }
              
              .invoice-title-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              }
              
              .invoice-title {
                color: #2563eb;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 8px;
                text-transform: uppercase;
              }
              
              .invoice-meta {
                background: #f8fafc;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #2563eb;
                width: 100%;
              }
              
              .invoice-meta p {
                margin: 3px 0;
                font-size: 12px;
                font-weight: 500;
              }
              
              /* From and To Sections with Larger Fonts */
              .details-section {
                display: flex;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 15px;
              }
              
              .from-section, .to-section {
                flex: 1;
                padding: 15px;
                background: #f8fafc;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
              }
              
              .from-section h3, .to-section h3 {
                color: #1e293b;
                font-size: 16px;
                margin-bottom: 8px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 5px;
                font-weight: 600;
              }
              
              .from-address p, .to-address p {
                margin: 4px 0;
                font-size: 13px;
                color: #475569;
                line-height: 1.3;
              }
              
              .from-address p:first-child, .to-address p:first-child {
                font-weight: 600;
                color: #1e293b;
                font-size: 14px;
              }
              
              /* Items Table with Larger Fonts */
              .invoice-items {
                width: 100%;
                border-collapse: collapse;
                margin: 12px 0;
                font-size: 13px;
              }
              
              .invoice-items th {
                background: #2563eb;
                color: white;
                padding: 10px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
              }
              
              .invoice-items td {
                padding: 8px;
                border-bottom: 1px solid #e2e8f0;
                font-size: 12px;
              }
              
              .invoice-items tr:nth-child(even) {
                background: #f8fafc;
              }
              
              /* Totals Section with Larger Fonts */
              .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-top: 12px;
              }
              
              .invoice-totals {
                width: 250px;
                background: #f8fafc;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
              }
              
              .totals-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 14px;
                padding: 3px 0;
              }
              
              .discount-row {
                color: #ef4444;
                font-weight: 500;
              }
              
              .grand-total {
                font-weight: bold;
                font-size: 16px;
                border-top: 2px solid #cbd5e1;
                padding-top: 8px;
                margin-top: 6px;
                color: #2563eb;
              }
              
              /* Notes and Footer with Larger Fonts */
              .footer-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 15px;
                margin-top: 15px;
              }
              
              .invoice-notes {
                flex: 2;
                padding: 15px;
                background: #fff3cd;
                border-radius: 6px;
                border-left: 3px solid #f59e0b;
              }
              
              .invoice-notes h3 {
                color: #92400e;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 600;
              }
              
              .invoice-notes p {
                color: #92400e;
                line-height: 1.4;
                margin: 0;
                font-size: 13px;
              }
              
              .invoice-footer {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                font-style: italic;
                font-size: 12px;
                padding: 15px;
                border-top: 1px solid #e2e8f0;
              }
              
              /* Status Badge with Larger Font */
              .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
              }
              
              .status-paid {
                background: #d1fae5;
                color: #065f46;
              }
              
              .status-pending {
                background: #fef3c7;
                color: #92400e;
              }
              
              /* Print Optimization with Larger Fonts */
              @media print {
                body {
                  margin: 0;
                  padding: 8px;
                  font-size: 13px;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .invoice-container {
                  max-width: 100%;
                  margin: 0;
                  padding: 0;
                }
                
                .no-print {
                  display: none !important;
                }
                
                /* Force single page with minimal margins */
                @page {
                  margin: 0.4cm;
                  size: A4;
                }
                
                html, body {
                  height: 99%;
                  overflow: hidden;
                }
                
                /* Prevent page breaks */
                .company-header,
                .details-section,
                .invoice-items,
                .totals-section,
                .footer-section {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                .invoice-items {
                  page-break-inside: avoid;
                }
                
                /* Ensure everything fits with larger fonts */
                .company-header {
                  margin-bottom: 12px;
                  padding-bottom: 8px;
                }
                
                .details-section {
                  margin-bottom: 12px;
                }
                
                .invoice-items {
                  margin: 10px 0;
                  font-size: 12px;
                }
                
                .invoice-items th {
                  font-size: 11px;
                  padding: 8px 6px;
                }
                
                .invoice-items td {
                  font-size: 11px;
                  padding: 6px;
                }
                
                .invoice-totals {
                  width: 220px;
                  padding: 12px;
                }
                
                .totals-row {
                  font-size: 13px;
                }
                
                .grand-total {
                  font-size: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceRef.current.innerHTML}
            </div>
            <script>
              setTimeout(() => {
                try {
                  window.print();
                  setTimeout(() => {
                    window.close();
                  }, 100);
                } catch (error) {
                  console.log('Print completed or cancelled');
                }
              }, 300);
            </script>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert('Please allow popups to enable printing.');
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();
      
    } catch (error) {
      console.error('Print error:', error);
      alert('Printing failed. Please try taking a screenshot instead.');
    }
  };

  // WhatsApp Sharing Function
  const handleSendWhatsApp = () => {
    if (!invoice.to.phone) {
      alert('Client phone number is required to send via WhatsApp.');
      return;
    }

    // Format phone number (remove any non-digit characters)
    const phoneNumber = invoice.to.phone.replace(/\D/g, '');
    
    // Create the message content
    const message = generateWhatsAppMessage();
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const generateWhatsAppMessage = () => {
    const itemsList = invoice.items.map(item => 
      `• ${item.description} - Qty: ${item.quantity} - ₹${item.total.toFixed(2)}`
    ).join('\n');

    const discountText = shouldShowDiscount() ? 
      `Discount: -₹${getDiscountAmount().toFixed(2)}` : '';

    return `Hello ${invoice.to.name},

Your invoice #${invoice.invoiceNumber} from ${invoice.from.name} is ready.

📅 Date: ${format(parseISO(invoice.date), 'MMM dd, yyyy')}
👤 Client: ${invoice.to.name}
🚗 Vehicle: ${invoice.to.vehicleName || 'N/A'} (${invoice.to.vehicleNumber || 'N/A'})

📋 Services/Items:
${itemsList}

💵 Summary:
Subtotal: ₹${invoice.subtotal.toFixed(2)}
${discountText}
Tax (${invoice.taxRate}%): ₹${invoice.tax.toFixed(2)}
*Total Amount: ₹${invoice.total.toFixed(2)}*

Status: ${getStatusText()}
${invoice.notes ? `\n📝 Notes: ${invoice.notes}` : ''}

Please review the attached invoice and let us know if you have any questions.

Thank you for your business!
${invoice.from.name}
${invoice.from.phone}`;
  };

  const getStatus = () => {
    if (invoice.status === 'paid') return 'paid';
    return 'pending';
  };

  const getStatusText = () => {
    if (invoice.status === 'paid') return 'Paid';
    return 'Pending';
  };

  const getDiscountAmount = () => {
    if (invoice.discountAmount && invoice.discountAmount > 0) {
      return invoice.discountAmount;
    }
    return 0;
  };

  const getDiscountDescription = () => {
    if (!invoice.discount || invoice.discount.type === 'none' || !invoice.discountAmount || invoice.discountAmount === 0) {
      return '';
    }
    
    if (invoice.discount.type === 'percentage') {
      return `Discount (${invoice.discount.value}%)`;
    } else if (invoice.discount.type === 'fixed') {
      return 'Discount';
    }
    
    return 'Discount';
  };

  const shouldShowDiscount = () => {
    return invoice.discount && 
           invoice.discount.type !== 'none' && 
           invoice.discountAmount && 
           invoice.discountAmount > 0;
  };

  return (
    <div className="invoice-preview">
      <div className="preview-header no-print">
        <div className="header-content">
          <div className="header-info">
            <h1>Invoice Preview</h1>
            <p>Review and manage your invoice</p>
          </div>
          <div className="invoice-status">
            <span className={`status-badge status-${getStatus()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <button onClick={onClose} className="btn btn-secondary">
            ← Back to List
          </button>
          {getStatus() !== 'paid' && (
            <button 
              onClick={onMarkAsPaid} 
              className="btn btn-success"
              title="Mark invoice as paid"
            >
              ✅ Mark as Paid
            </button>
          )}
          <button onClick={onEdit} className="btn btn-outline">
            ✏️ Edit Invoice
          </button>
          <button 
            onClick={handleSendWhatsApp} 
            className="btn btn-whatsapp"
            title="Send invoice via WhatsApp"
            disabled={!invoice.to.phone}
          >
            💬 Send via WhatsApp
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            🖨️ Print Invoice
          </button>
        </div>
      </div>

      <div ref={invoiceRef} className="invoice-document">
        {/* Compact Header with Flexbox */}
        <div className="company-header">
          <div className="logo-section">
            <img 
              src="/logo.jpeg" 
              alt="Company Logo" 
              className="logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="company-info">
              <h1>{invoice.from.name}</h1>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.city}</p>
              <p>{invoice.from.email}</p>
              <p>{invoice.from.phone}</p>
            </div>
          </div>
          
          <div className="invoice-title-section">
            <div className="invoice-title">INVOICE</div>
            <div className="invoice-meta">
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {format(parseISO(invoice.date), 'MMM dd, yyyy')}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${getStatus()}`}>{getStatusText()}</span></p>
              {invoice.status === 'paid' && invoice.paidDate && (
                <p><strong>Paid Date:</strong> {format(parseISO(invoice.paidDate), 'MMM dd, yyyy')}</p>
              )}
            </div>
          </div>
        </div>

        {/* From and To Sections Side by Side */}
        <div className="details-section">
          <div className="from-section">
            <h3>From</h3>
            <div className="from-address">
              <p><strong>{invoice.from.name}</strong></p>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.city}</p>
              <p>{invoice.from.email}</p>
              <p>{invoice.from.phone}</p>
            </div>
          </div>

          <div className="to-section">
            <h3>Client & Vehicle Details</h3>
            <div className="to-address">
              <p><strong>{invoice.to.name}</strong></p>
              <p>{invoice.to.address}</p>
              <p>{invoice.to.city}</p>
              <p>{invoice.to.phone}</p>
              {invoice.to.vehicleName && <p><strong>Vehicle Name:</strong> {invoice.to.vehicleName}</p>}
              {invoice.to.vehicleNumber && <p><strong>Vehicle Number:</strong> {invoice.to.vehicleNumber}</p>}
              {(invoice.to.serviceAtKm !== undefined && invoice.to.serviceAtKm !== null && invoice.to.serviceAtKm !== '') && (
                <p><strong>Service at (KM):</strong> {invoice.to.serviceAtKm} KM</p>
              )}
              {(invoice.to.nextServiceAtKm !== undefined && invoice.to.nextServiceAtKm !== null && invoice.to.nextServiceAtKm !== '') && (
                <p><strong>Next Service at (KM):</strong> {invoice.to.nextServiceAtKm} KM</p>
              )}
            </div>
          </div>
        </div>

        <div className="invoice-content">
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price (₹)</th>
                <th>Service (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{item.serviceCharge.toFixed(2)}</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals-section">
            <div className="invoice-totals">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              
              {shouldShowDiscount() && (
                <div className="totals-row discount-row">
                  <span>{getDiscountDescription()}:</span>
                  <span style={{ color: '#ef4444' }}>-₹{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="totals-row">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>₹{invoice.tax.toFixed(2)}</span>
              </div>
              
              <div className="totals-row grand-total">
                <span>Total Amount:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Footer in Single Row */}
        <div className="footer-section">
          {invoice.notes && (
            <div className="invoice-notes">
              <h3>Notes</h3>
              <p>{invoice.notes}</p>
            </div>
          )}
          <div className="invoice-footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;