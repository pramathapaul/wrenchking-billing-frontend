import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaCheckCircle, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { safeFormatDate } from '../utils/dateUtils';
import './InvoiceList.css';

const InvoiceList = ({ invoices, onEdit, onView, onDelete, onCreateNew, onMarkAsPaid, stats }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getSafeValue = (obj, path, def = '') => {
    try {
      const value = path.split('.').reduce((a, b) => (a && a[b] ? a[b] : null), obj);
      return value ?? def;
    } catch {
      return def;
    }
  };

  const formatCurrency = (amt) =>
    typeof amt !== 'number' || isNaN(amt)
      ? '₹0.00'
      : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

  const getStatus = (inv) => (getSafeValue(inv, 'status') === 'paid' ? 'paid' : 'pending');
  const getStatusText = (inv) => (getStatus(inv) === 'paid' ? 'Paid' : 'Pending');

  // ✅ Apply Search + Filter + Date Range + Sort
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filter === 'all' ? true : getStatus(inv) === filter;
    const lowerSearch = searchTerm.toLowerCase();
    const invoiceNum = String(getSafeValue(inv, 'invoiceNumber', '')).toLowerCase();
    const vehicleNum = String(getSafeValue(inv, 'to.vehicleNumber', '')).toLowerCase();
    const contactNum = String(getSafeValue(inv, 'to.phone', '')).toLowerCase();

    const matchesSearch =
      lowerSearch === '' ||
      invoiceNum.includes(lowerSearch) ||
      vehicleNum.includes(lowerSearch) ||
      contactNum.includes(lowerSearch);

    // ✅ Date range filter
    const invDate = new Date(getSafeValue(inv, 'date'));
    const startOk = !startDate || invDate >= new Date(startDate);
    const endOk = !endDate || invDate <= new Date(endDate);

    return matchesStatus && matchesSearch && startOk && endOk;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const aVal =
      sortBy === 'date'
        ? new Date(getSafeValue(a, 'date'))
        : sortBy === 'client'
        ? getSafeValue(a, 'to.name', '').toLowerCase()
        : getSafeValue(a, 'total', 0);
    const bVal =
      sortBy === 'date'
        ? new Date(getSafeValue(b, 'date'))
        : sortBy === 'client'
        ? getSafeValue(b, 'to.name', '').toLowerCase()
        : getSafeValue(b, 'total', 0);
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  return (
    <div className="invoice-list-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Invoice Dashboard</h1>
          <p className="header-subtitle">Track, manage, and analyze your invoices efficiently.</p>
        </div>
        <button onClick={onCreateNew} className="btn btn-primary create-btn">
          + New Invoice
        </button>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Invoices</p>
            </div>
          </div>

          <div className="stat-card stat-paid">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{stats.paid}</h3>
              <p>Paid Invoices</p>
              <span>{formatCurrency(stats.paidAmount)} collected</span>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Invoices</p>
            </div>
          </div>

          <div className="stat-card stat-revenue">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalAmount)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="controls-bar">
        <div className="control">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="control">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="total">Amount</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className="control">
          <label>Order:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        {/* 🔍 Search Bar */}
        <div className="control search-control">
          <label>Search:</label>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by invoice, vehicle, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 📅 Date Range Filter */}
        <div className="control date-filter">
          <label>Date Range:</label>
          <div className="date-range">
            <div className="date-input">
              <FaCalendarAlt className="calendar-icon" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <span className="to-text">to</span>
            <div className="date-input">
              <FaCalendarAlt className="calendar-icon" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="invoice-table-section">
        {sortedInvoices.length === 0 ? (
          <div className="empty-state">
            <div>📄</div>
            <h3>No invoices found</h3>
            <p>Create your first invoice to start billing your clients</p>
            <button onClick={onCreateNew} className="btn btn-primary">
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="invoice-table">
            <div className="table-header">
              <span>Invoice #</span>
              <span>Client</span>
              <span>Vehicle</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {sortedInvoices.map((inv) => (
              <div key={inv._id} className="table-row">
                <span>{getSafeValue(inv, 'invoiceNumber', 'N/A')}</span>
                <span>{getSafeValue(inv, 'to.name', 'Unnamed Client')}</span>
                <span>{getSafeValue(inv, 'to.vehicleName', 'N/A')}</span>
                <span>{safeFormatDate(getSafeValue(inv, 'date'))}</span>
                <span>{formatCurrency(getSafeValue(inv, 'total', 0))}</span>
                <span className={`badge ${getStatus(inv)}`}>{getStatusText(inv)}</span>
                <div className="row-actions">
                  <button className="icon-btn view" onClick={() => onView(inv)}>
                    <FaEye />
                  </button>
                  <button className="icon-btn edit" onClick={() => onEdit(inv)}>
                    <FaEdit />
                  </button>
                  {getStatus(inv) !== 'paid' && (
                    <button className="icon-btn mark-paid" onClick={() => onMarkAsPaid(inv._id)}>
                      <FaCheckCircle />
                    </button>
                  )}
                  <button className="icon-btn delete" onClick={() => onDelete(inv._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default InvoiceList;
