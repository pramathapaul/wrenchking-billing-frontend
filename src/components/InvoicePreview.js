import React, { useRef } from 'react';
import { format, parseISO } from 'date-fns';
import './InvoicePreview.css';

const InvoicePreview = ({ invoice, onClose, onEdit, onMarkAsPaid }) => {
  const invoiceRef = useRef();

  const handlePrint = () => {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      if (window.confirm('📱 Mobile Printing\n\nFor best results:\n• Take a screenshot\n• Use share to save/print\n• Or continue with browser print\n\nContinue with browser print?')) {
        performPrint();
      }
      return;
    }
    
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
                padding: 15px; 
                color: #1e293b; 
                background: white;
                font-size: 12px;
                line-height: 1.3;
              }
              
              .invoice-container { 
                max-width: 100%;
                margin: 0 auto;
                padding: 0;
              }
              
              .company-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #2563eb;
              }
              
              .logo-section {
                flex: 1;
              }
              
              .logo {
                max-width: 150px;
                height: auto;
                margin-bottom: 10px;
              }
              
              .company-info h1 {
                color: #2563eb;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 5px;
              }
              
              .company-info p {
                color: #64748b;
                font-size: 11px;
                margin: 2px 0;
              }
              
              .invoice-title-section {
                text-align: right;
                flex: 1;
              }
              
              .invoice-title {
                color: #2563eb;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
              }
              
              .invoice-meta {
                background: #f8fafc;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #2563eb;
              }
              
              .invoice-meta p {
                margin: 3px 0;
                font-size: 11px;
              }
              
              .details-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                gap: 20px;
              }
              
              .from-section, .to-section {
                flex: 1;
                padding: 12px;
                background: #f8fafc;
                border-radius: 6px;
              }
              
              .from-section h3, .to-section h3 {
                color: #1e293b;
                font-size: 13px;
                margin-bottom: 8px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 5px;
              }
              
              .from-address p, .to-address p {
                margin: 3px 0;
                font-size: 11px;
                color: #475569;
              }
              
              .invoice-items {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 11px;
              }
              
              .invoice-items th {
                background: #2563eb;
                color: white;
                padding: 8px 6px;
                text-align: left;
                font-weight: 600;
                font-size: 10px;
              }
              
              .invoice-items td {
                padding: 6px;
                border-bottom: 1px solid #e2e8f0;
                font-size: 10px;
              }
              
              .invoice-totals {
                margin-left: auto;
                width: 250px;
                background: #f8fafc;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
              }
              
              .totals-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 11px;
              }
              
              .grand-total {
                font-weight: bold;
                font-size: 13px;
                border-top: 1px solid #cbd5e1;
                padding-top: 8px;
                margin-top: 5px;
              }
              
              .invoice-notes {
                margin-top: 15px;
                padding: 12px;
                background: #fff3cd;
                border-radius: 6px;
                border-left: 3px solid #f59e0b;
              }
              
              .invoice-notes h3 {
                color: #92400e;
                margin-bottom: 5px;
                font-size: 12px;
              }
              
              .invoice-notes p {
                color: #92400e;
                line-height: 1.4;
                margin: 0;
                font-size: 11px;
              }
              
              .invoice-footer {
                margin-top: 20px;
                text-align: center;
                color: #64748b;
                font-style: italic;
                font-size: 10px;
                padding-top: 10px;
                border-top: 1px solid #e2e8f0;
              }
              
              .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
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
              
              .status-overdue {
                background: #fee2e2;
                color: #991b1b;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 10px;
                  font-size: 11px;
                }
                
                .invoice-container {
                  max-width: 100%;
                  margin: 0;
                  padding: 0;
                }
                
                .no-print {
                  display: none !important;
                }
                
                /* Ensure everything fits on one page */
                .company-header {
                  margin-bottom: 15px;
                  padding-bottom: 10px;
                }
                
                .details-section {
                  margin-bottom: 15px;
                }
                
                .invoice-items {
                  margin: 10px 0;
                }
                
                /* Prevent page breaks inside key sections */
                .company-header,
                .details-section,
                .invoice-totals,
                .invoice-notes {
                  page-break-inside: avoid;
                }
                
                /* Force the content to stay together */
                .invoice-content {
                  page-break-inside: avoid;
                }
              }

              /* Mobile-specific styles */
              @media (max-width: 768px) {
                body {
                  padding: 10px;
                  font-size: 11px;
                }
                
                .company-header {
                  flex-direction: column;
                  gap: 15px;
                }
                
                .invoice-title-section {
                  text-align: left;
                }
                
                .details-section {
                  flex-direction: column;
                  gap: 15px;
                }
                
                .invoice-totals {
                  width: 100%;
                  margin: 15px 0;
                }
                
                .invoice-items {
                  font-size: 10px;
                }
                
                .invoice-items th,
                .invoice-items td {
                  padding: 4px;
                  font-size: 9px;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceRef.current.innerHTML}
            </div>
            <script>
              // Better mobile handling
              setTimeout(() => {
                try {
                  window.print();
                  // Don't auto-close on mobile - let user decide
                  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    setTimeout(() => {
                      window.close();
                    }, 1000);
                  }
                } catch (error) {
                  console.log('Print completed or cancelled');
                }
              }, 500);
            </script>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert('⚠️ Please allow popups for this site to enable printing. On mobile, try taking a screenshot instead.');
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Focus the window to help with mobile browsers
      printWindow.focus();
      
    } catch (error) {
      console.error('Print error:', error);
      alert('Printing failed. Please try taking a screenshot of the invoice instead.');
    }
  };

  const getStatus = () => {
    if (invoice.status === 'paid') return 'paid';
    return 'pending';
  };

  const getStatusText = () => {
    if (invoice.status === 'paid') return 'Paid';
    return 'Pending';
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
          <button onClick={handlePrint} className="btn btn-primary">
            🖨️ Print Invoice
          </button>
        </div>
      </div>

      <div ref={invoiceRef} className="invoice-document">
        <div className="company-header">
          <div className="logo-section">
            <img 
              src="/logo.jpeg" 
              alt="Company Logo" 
              className="logo"
              onError={(e) => {
                e.target.style.display = 'none';
                const companyInfo = document.querySelector('.company-info');
                if (companyInfo) {
                  companyInfo.style.display = 'block';
                }
              }}
            />
            <div className="company-info" style={{display: 'none'}}>
              <h1>{invoice.from.name}</h1>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.city}</p>
              <p>{invoice.from.email}</p>
              <p>{invoice.from.phone}</p>
              <p>{invoice.from.website}</p>
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

        <div className="details-section">
          <div className="from-section">
            <h3>From</h3>
            <div className="from-address">
              <p><strong>{invoice.from.name}</strong></p>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.city}</p>
              <p>{invoice.from.email}</p>
              <p>{invoice.from.phone}</p>
              <p>{invoice.from.website}</p>
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
            </div>
          </div>
        </div>

        <div className="invoice-content">
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Service Charge (₹)</th>
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

          <div className="invoice-totals">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
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
  );
};

export default InvoicePreview;
