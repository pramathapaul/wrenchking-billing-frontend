import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoicePreview from './components/InvoicePreview';
import { invoiceAPI } from './services/api';
import { getTodayDateString } from './utils/dateUtils';
import './App.css';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default invoice structure for data validation
  const getDefaultInvoiceStructure = () => ({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: getTodayDateString(),
    from: {
      name: 'Your Company Name',
      address: '123 Business Street',
      city: 'City, State 12345',
      email: 'billing@yourcompany.com',
      phone: '(555) 123-4567',
      website: 'www.yourcompany.com'
    },
    to: {
      name: '',
      address: '',
      city: '',
      phone: '',
      vehicleName: '',
      vehicleNumber: ''
    },
    items: [{ 
      id: Date.now(), 
      description: '', 
      quantity: 1, 
      price: 0, 
      total: 0,
      serviceCharge: 0
    }],
    notes: 'Thank you for your business!',
    taxRate: 10,
    currency: 'INR',
    status: 'pending',
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Enhanced data validation and transformation
  const validateAndTransformInvoice = (invoice) => {
    if (!invoice) return getDefaultInvoiceStructure();

    // Ensure all required fields exist with proper fallbacks
    return {
      _id: invoice._id || null,
      invoiceNumber: invoice.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      date: invoice.date || getTodayDateString(),
      from: {
        name: invoice.from?.name || 'Your Company Name',
        address: invoice.from?.address || '123 Business Street',
        city: invoice.from?.city || 'City, State 12345',
        email: invoice.from?.email || 'billing@yourcompany.com',
        phone: invoice.from?.phone || '(555) 123-4567',
        website: invoice.from?.website || 'www.yourcompany.com'
      },
      to: {
        name: invoice.to?.name || '',
        address: invoice.to?.address || '',
        city: invoice.to?.city || '',
        phone: invoice.to?.phone || '',
        vehicleName: invoice.to?.vehicleName || '',
        vehicleNumber: invoice.to?.vehicleNumber || ''
      },
      items: Array.isArray(invoice.items) && invoice.items.length > 0
        ? invoice.items.map(item => ({
            id: item.id || Date.now() + Math.random(),
            description: item.description || '',
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            price: typeof item.price === 'number' ? item.price : 0,
            serviceCharge: typeof item.serviceCharge === 'number' ? item.serviceCharge : 0,
            total: typeof item.total === 'number' ? item.total : 0
          }))
        : [{ 
            id: Date.now(), 
            description: '', 
            quantity: 1, 
            price: 0, 
            total: 0,
            serviceCharge: 0
          }],
      notes: invoice.notes || 'Thank you for your business!',
      taxRate: typeof invoice.taxRate === 'number' ? invoice.taxRate : 10,
      currency: invoice.currency || 'INR',
      status: invoice.status || 'pending',
      subtotal: typeof invoice.subtotal === 'number' ? invoice.subtotal : 0,
      tax: typeof invoice.tax === 'number' ? invoice.tax : 0,
      total: typeof invoice.total === 'number' ? invoice.total : 0,
      createdAt: invoice.createdAt || new Date().toISOString(),
      updatedAt: invoice.updatedAt || new Date().toISOString()
    };
  };

  // Load invoices from MongoDB with enhanced error handling - WRAPPED IN useCallback
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getAll();
      
      // Validate and transform all invoices
      const validatedInvoices = response.data.map(invoice => 
        validateAndTransformInvoice(invoice)
      );
      
      setInvoices(validatedInvoices);
      setError(null);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setError(error.userMessage || 'Failed to load invoices. Please check your connection.');
      // Fallback to empty array
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on component state

  // Load invoices on component mount - NOW INCLUDES loadInvoices IN DEPENDENCIES
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]); // Fixed: Added loadInvoices to dependency array

  const handleCreateInvoice = () => {
    setCurrentInvoice(null);
    setView('form');
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      setLoading(true);
      let savedInvoice;

      if (currentInvoice && currentInvoice._id) {
        // Update existing invoice
        const response = await invoiceAPI.update(currentInvoice._id, invoiceData);
        savedInvoice = validateAndTransformInvoice(response.data);
        setInvoices(prev => prev.map(inv => 
          inv._id === currentInvoice._id ? savedInvoice : inv
        ));
      } else {
        // Create new invoice
        const response = await invoiceAPI.create(invoiceData);
        savedInvoice = validateAndTransformInvoice(response.data);
        setInvoices(prev => [savedInvoice, ...prev]);
      }
      
      setView('list');
      setError(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
      setError(error.userMessage || 'Failed to save invoice. Please try again.');
      throw error; // Re-throw to handle in form component
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    const validatedInvoice = validateAndTransformInvoice(invoice);
    setCurrentInvoice(validatedInvoice);
    setView('form');
  };

  const handleViewInvoice = (invoice) => {
    const validatedInvoice = validateAndTransformInvoice(invoice);
    setCurrentInvoice(validatedInvoice);
    setView('preview');
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      try {
        setLoading(true);
        await invoiceAPI.delete(invoiceId);
        setInvoices(prev => prev.filter(inv => inv._id !== invoiceId));
        setError(null);
        
        // If we're viewing the deleted invoice, go back to list
        if (currentInvoice && currentInvoice._id === invoiceId) {
          setCurrentInvoice(null);
          setView('list');
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
        setError(error.userMessage || 'Failed to delete invoice. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await invoiceAPI.markAsPaid(invoiceId);
      const updatedInvoice = validateAndTransformInvoice(response.data);
      
      setInvoices(prev => prev.map(inv => 
        inv._id === invoiceId ? updatedInvoice : inv
      ));
      
      // Update current invoice if it's being viewed
      if (currentInvoice && currentInvoice._id === invoiceId) {
        setCurrentInvoice(updatedInvoice);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      setError(error.userMessage || 'Failed to mark invoice as paid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = invoices.length;
    const paid = invoices.filter(inv => inv.status === 'paid').length;
    const pending = invoices.filter(inv => inv.status === 'pending').length;
    const overdue = 0; // Since we removed due date
    
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidAmount = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    return { total, paid, pending, overdue, totalAmount, paidAmount };
  };

  // Enhanced loading state
  if (loading && invoices.length === 0 && view === 'list') {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Billing App...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🧾</div>
            <h1>TheWrenchKing</h1>
          </div>
          <nav className="nav-menu">
            <button 
              onClick={() => setView('list')}
              className={`nav-btn ${view === 'list' ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Invoices</span>
            </button>
            <button 
              onClick={handleCreateInvoice}
              className={`nav-btn ${view === 'form' ? 'active' : ''}`}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">New Invoice</span>
            </button>
          </nav>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn-close">×</button>
        </div>
      )}

      <main className="app-main">
        {view === 'list' && (
          <InvoiceList
            invoices={invoices}
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
            onDelete={handleDeleteInvoice}
            onCreateNew={handleCreateInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            stats={getStats()}
            loading={loading}
          />
        )}

        {view === 'form' && (
          <InvoiceForm
            invoice={currentInvoice}
            onSave={handleSaveInvoice}
            onCancel={() => setView('list')}
            loading={loading}
          />
        )}

        {view === 'preview' && currentInvoice && (
          <InvoicePreview
            invoice={currentInvoice}
            onClose={() => setView('list')}
            onEdit={() => handleEditInvoice(currentInvoice)}
            onMarkAsPaid={() => handleMarkAsPaid(currentInvoice._id)}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 The Wrench King. Professional billing made simple.</p>
      </footer>
    </div>
  );
}

export default App;