import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import './InvoiceForm.css';

const InvoiceForm = ({ invoice, onSave, onCancel }) => {
  // Initialize with proper data structure
  const getInitialFormData = () => ({
    invoiceNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    from: {
      name: 'The Wrench King',
      address: 'Charakdanga, Natun Pukur Rd, Barasat',
      city: 'Kolkata, West Bengal 700124',
      email: 'thewrenchking00@gmail.com',
      phone: '82760 76909',
      website: 'https://thewrenchking.netlify.app'
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
    taxRate: 0,
    currency: 'INR',
    status: 'pending'
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    items: []
  });

  // Safe data validation and transformation - WRAPPED IN useCallback
  const validateAndTransformInvoiceData = useCallback((invoiceData) => {
    if (!invoiceData) return getInitialFormData();
    
    return {
      invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      date: invoiceData.date || format(new Date(), 'yyyy-MM-dd'),
      from: {
        name: invoiceData.from?.name || 'The Wrench King',
        address: invoiceData.from?.address || 'Charakdanga, Natun Pukur Rd, Barasat',
        city: invoiceData.from?.city || 'Kolkata, West Bengal 700124',
        email: invoiceData.from?.email || 'thewrenchking00@gmail.com',
        phone: invoiceData.from?.phone || '82760 76909',
        website: invoiceData.from?.website || 'https://thewrenchking.netlify.app'
      },
      to: {
        name: invoiceData.to?.name || '',
        address: invoiceData.to?.address || '',
        city: invoiceData.to?.city || '',
        phone: invoiceData.to?.phone || '',
        vehicleName: invoiceData.to?.vehicleName || '',
        vehicleNumber: invoiceData.to?.vehicleNumber || ''
      },
      // Ensure items is always an array with proper structure
      items: Array.isArray(invoiceData.items) && invoiceData.items.length > 0
        ? invoiceData.items.map(item => ({
            id: item.id || Date.now() + Math.random(),
            description: item.description || '',
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            price: typeof item.price === 'number' ? item.price : 0,
            total: typeof item.total === 'number' ? item.total : 0,
            serviceCharge: typeof item.serviceCharge === 'number' ? item.serviceCharge : 0
          }))
        : [{ 
            id: Date.now(), 
            description: '', 
            quantity: 1, 
            price: 0, 
            total: 0,
            serviceCharge: 0
          }],
      notes: invoiceData.notes || 'Thank you for your business!',
      taxRate: typeof invoiceData.taxRate === 'number' ? invoiceData.taxRate : 0,
      currency: 'INR',
      status: invoiceData.status || 'pending'
    };
  }, []);

  useEffect(() => {
    if (invoice) {
      const validatedData = validateAndTransformInvoiceData(invoice);
      setFormData(validatedData);
      
      // Initialize touched state with proper structure
      const initialItems = validatedData.items || [];
      setTouched({
        items: initialItems.map(() => ({})),
        to: {},
        from: {}
      });
    } else {
      // Generate new invoice number for new invoices
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({
        ...prev,
        invoiceNumber
      }));
      
      // Initialize touched for new form
      setTouched({
        items: [{}],
        to: {},
        from: {}
      });
    }
  }, [invoice, validateAndTransformInvoiceData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.to.name?.trim()) {
      newErrors.to = { ...newErrors.to, name: 'Client name is required' };
    }

    if (!formData.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    // Safe item validation
    const currentItems = Array.isArray(formData.items) ? formData.items : [];
    const itemErrors = currentItems.map((item, index) => {
      const itemError = {};
      if (!item.description?.trim()) {
        itemError.description = 'Item description is required';
      }
      if (item.quantity <= 0) {
        itemError.quantity = 'Quantity must be greater than 0';
      }
      if (item.price < 0) {
        itemError.price = 'Price cannot be negative';
      }
      if (item.serviceCharge < 0) {
        itemError.serviceCharge = 'Service charge cannot be negative';
      }
      return itemError;
    });

    if (itemErrors.some(error => Object.keys(error).length > 0)) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));

      // Mark field as touched
      setTouched(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: true
        }
      }));

      // Clear errors when user starts typing
      if (errors[section]?.[field]) {
        setErrors(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: null
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Mark field as touched
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));

      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    // Ensure items array exists
    const currentItems = Array.isArray(formData.items) ? formData.items : [];
    const updatedItems = [...currentItems];
    
    // Ensure the item at index exists
    if (!updatedItems[index]) {
      updatedItems[index] = { 
        id: Date.now() + Math.random(), 
        description: '', 
        quantity: 1, 
        price: 0, 
        total: 0,
        serviceCharge: 0
      };
    }
    
    const numericValue = field === 'quantity' || field === 'price' || field === 'serviceCharge' ? parseFloat(value) || 0 : value;
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: numericValue
    };
    
    // Calculate total
    if (field === 'quantity' || field === 'price' || field === 'serviceCharge') {
      const quantity = updatedItems[index].quantity;
      const price = updatedItems[index].price;
      const serviceCharge = updatedItems[index].serviceCharge;
      updatedItems[index].total = (quantity * price) + serviceCharge;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));

    // Safe touched update for items
    setTouched(prev => {
      const currentTouchedItems = Array.isArray(prev.items) ? prev.items : [];
      const updatedTouchedItems = [...currentTouchedItems];
      
      // Ensure the touched item at index exists
      if (!updatedTouchedItems[index]) {
        updatedTouchedItems[index] = {};
      }
      
      updatedTouchedItems[index] = {
        ...updatedTouchedItems[index],
        [field]: true
      };
      
      return {
        ...prev,
        items: updatedTouchedItems
      };
    });

    // Clear item errors
    if (errors.items?.[index]?.[field]) {
      setErrors(prev => ({
        ...prev,
        items: (prev.items || []).map((itemError, i) => 
          i === index ? { ...itemError, [field]: null } : itemError
        )
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...(Array.isArray(prev.items) ? prev.items : []),
        {
          id: Date.now() + Math.random(),
          description: '',
          quantity: 1,
          price: 0,
          total: 0,
          serviceCharge: 0
        }
      ]
    }));

    // Add new touched item
    setTouched(prev => ({
      ...prev,
      items: [
        ...(Array.isArray(prev.items) ? prev.items : []),
        {}
      ]
    }));
  };

  const removeItem = (index) => {
    const currentItems = Array.isArray(formData.items) ? formData.items : [];
    if (currentItems.length > 1) {
      const updatedItems = currentItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));

      // Remove from errors and touched
      setErrors(prev => ({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index)
      }));
      
      setTouched(prev => ({
        ...prev,
        items: (Array.isArray(prev.items) ? prev.items : []).filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    const currentItems = Array.isArray(formData.items) ? formData.items : [];
    return currentItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * ((formData.taxRate || 0) / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.error');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onSave({
      ...formData,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      updatedAt: new Date().toISOString()
    });

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    const currentItems = Array.isArray(formData.items) ? formData.items : [];
    const hasUnsavedChanges = currentItems.some(item => item.description || item.price > 0) || formData.to.name;
    
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleBlur = (section, field) => {
    setTouched(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: true
      }
    }));
  };

  // REMOVED: getCurrencySymbol function since it's unused

  // Safe items array for rendering
  const itemsToRender = Array.isArray(formData.items) ? formData.items : [];

  return (
    <div className="invoice-form slide-up">
      <div className="form-header">
        <div className="header-content">
          <h1>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</h1>
          <p className="subtitle">
            {invoice ? 'Update invoice details' : 'Fill in the details to create a new invoice'}
          </p>
        </div>
        <div className="header-actions desktop-only">
          <button 
            type="button" 
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="invoice-form"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner-small"></div>
                {invoice ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              invoice ? 'Update Invoice' : 'Create Invoice'
            )}
          </button>
        </div>
      </div>

      <form id="invoice-form" onSubmit={handleSubmit} className="form-container">
        {/* Basic Information */}
        <div className="form-section card">
          <div className="section-header">
            <h2>Basic Information</h2>
            <div className="section-badge">Required</div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Invoice Number *</label>
              <input
                type="text"
                value={formData.invoiceNumber || ''}
                onChange={(e) => handleInputChange(null, 'invoiceNumber', e.target.value)}
                onBlur={() => handleBlur(null, 'invoiceNumber')}
                className={`form-input ${errors.invoiceNumber && touched.invoiceNumber ? 'error' : ''}`}
                placeholder="e.g., INV-001"
                disabled={!!invoice}
              />
              {errors.invoiceNumber && touched.invoiceNumber && (
                <div className="error-message">{errors.invoiceNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Date *</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange(null, 'date', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                value="INR"
                className="form-input"
                disabled
              >
                <option value="INR">INR (₹)</option>
              </select>
              <div className="helper-text">Indian Rupee (₹) is the only supported currency</div>
            </div>
          </div>
        </div>

        {/* From/To Sections */}
        <div className="form-columns">
          <div className="form-section card">
            <div className="section-header">
              <h2>From</h2>
              <div className="section-badge">Your Business</div>
            </div>
            
            {Object.keys(formData.from || {}).map(field => (
              <div key={field} className="form-group">
                <label className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {field === 'name' && ' *'}
                </label>
                <input
                  type="text"
                  value={formData.from?.[field] || ''}
                  onChange={(e) => handleInputChange('from', field, e.target.value)}
                  className="form-input"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          <div className="form-section card">
            <div className="section-header">
              <h2>Client Information *</h2>
              <div className="section-badge">Vehicle Details</div>
            </div>
            
            {Object.keys(formData.to || {}).map(field => (
              <div key={field} className="form-group">
                <label className="form-label">
                  {field === 'vehicleName' ? 'Vehicle Name' : 
                   field === 'vehicleNumber' ? 'Vehicle Number' :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                  {field === 'name' && ' *'}
                </label>
                <input
                  type="text"
                  value={formData.to?.[field] || ''}
                  onChange={(e) => handleInputChange('to', field, e.target.value)}
                  onBlur={() => handleBlur('to', field)}
                  className={`form-input ${errors.to?.[field] && touched.to?.[field] ? 'error' : ''}`}
                  placeholder={
                    field === 'vehicleName' ? 'e.g., Honda City' :
                    field === 'vehicleNumber' ? 'e.g., DL01AB1234' :
                    `Client ${field}`
                  }
                  required={field === 'name'}
                />
                {errors.to?.[field] && touched.to?.[field] && (
                  <div className="error-message">{errors.to?.[field]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items Section */}
        <div className="form-section card">
          <div className="section-header">
            <div>
              <h2>Items & Services</h2>
              <p className="section-description">Add items, services, or products for this invoice</p>
            </div>
            <button type="button" onClick={addItem} className="btn btn-outline">
              + Add Item
            </button>
          </div>

          <div className="items-container">
            <div className="items-header">
              <div className="item-col description">Description *</div>
              <div className="item-col quantity">Quantity</div>
              <div className="item-col price">Price (₹)</div>
              <div className="item-col service-charge">Service Charge (₹)</div>
              <div className="item-col total">Total (₹)</div>
              <div className="item-col action"></div>
            </div>

            {itemsToRender.map((item, index) => (
              <div key={item.id || index} className="item-row">
                <div className="item-col description">
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className={`form-input ${errors.items?.[index]?.description && touched.items?.[index]?.description ? 'error' : ''}`}
                    placeholder="Item description"
                  />
                  {errors.items?.[index]?.description && touched.items?.[index]?.description && (
                    <div className="error-message">{errors.items[index].description}</div>
                  )}
                </div>
                <div className="item-col quantity">
                  <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className={`form-input ${errors.items?.[index]?.quantity ? 'error' : ''}`}
                    min="1"
                    step="1"
                  />
                </div>
                <div className="item-col price">
                  <div className="price-input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={item.price || 0}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className={`form-input ${errors.items?.[index]?.price ? 'error' : ''}`}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="item-col service-charge">
                  <div className="price-input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={item.serviceCharge || 0}
                      onChange={(e) => handleItemChange(index, 'serviceCharge', e.target.value)}
                      className={`form-input ${errors.items?.[index]?.serviceCharge ? 'error' : ''}`}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="item-col total">
                  <div className="item-total">
                    ₹{(item.total || 0).toFixed(2)}
                  </div>
                </div>
                <div className="item-col action">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn btn-error btn-sm"
                    disabled={itemsToRender.length === 1}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax and Notes */}
        <div className="form-section card">
          <div className="section-header">
            <h2>Additional Information</h2>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={formData.taxRate || 0}
                  onChange={(e) => handleInputChange(null, 'taxRate', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <span className="input-suffix">%</span>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange(null, 'notes', e.target.value)}
                className="form-input"
                rows="3"
                placeholder="Additional notes or terms..."
              />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section card">
          <div className="summary-header">
            <h3>Invoice Summary</h3>
          </div>
          
          <div className="summary-content">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>
                ₹{calculateSubtotal().toFixed(2)}
              </span>
            </div>
            
            <div className="summary-row">
              <span>Tax ({formData.taxRate || 0}%):</span>
              <span>
                ₹{calculateTax().toFixed(2)}
              </span>
            </div>
            
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Submit Footer */}
        <footer className="form-footer mobile-only">
          <div className="footer-content">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner-small"></div>
                  {invoice ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                invoice ? 'Update Invoice' : 'Create Invoice'
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default InvoiceForm;