import { InspectionRecord, ReportFilter } from '../types';
import { getLocationName } from '../data/locations';

// Filter records according to location, category, status, date range, search query
export function filterRecords(
  records: InspectionRecord[],
  filters: ReportFilter
): InspectionRecord[] {
  return records.filter((rec) => {
    // Location filter
    if (filters.locationId !== 'ALL' && rec.locationId !== filters.locationId) {
      return false;
    }

    // Category filter
    if (filters.category !== 'ALL' && rec.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate && rec.inspectionDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && rec.inspectionDate > filters.endDate) {
      return false;
    }

    // Status filter (check if overall status or task status matches)
    if (filters.status !== 'ALL') {
      const hasTaskWithStatus = rec.tasks.some((t) => t.status === filters.status);
      if (!hasTaskWithStatus && rec.overallStatus !== filters.status) {
        return false;
      }
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = rec.title.toLowerCase().includes(q);
      const matchRef = rec.referenceNo.toLowerCase().includes(q);
      const matchLoc = rec.locationName.toLowerCase().includes(q);
      const matchSub = (rec.subLocation || '').toLowerCase().includes(q);
      const matchInsp = rec.inspectorName.toLowerCase().includes(q);
      const matchTask = rec.tasks.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.remarks || '').toLowerCase().includes(q)
      );

      if (!matchTitle && !matchRef && !matchLoc && !matchSub && !matchInsp && !matchTask) {
        return false;
      }
    }

    return true;
  });
}

// Generate CSV export for filtered task entries
export function exportToCSV(records: InspectionRecord[], filters: ReportFilter) {
  const filtered = filterRecords(records, filters);

  const headers = [
    'Reference No',
    'Inspection Title',
    'Category',
    'Site Location',
    'Sub Location / Unit',
    'Inspection Date',
    'Task Title',
    'Task Status',
    'Inspector Name',
    'Task Timestamp',
    'Last Updated',
    'Remarks / Findings',
    'Photo Count',
  ];

  const rows: string[][] = [];

  filtered.forEach((rec) => {
    rec.tasks.forEach((task) => {
      // Apply status filter to individual tasks if specified
      if (filters.status !== 'ALL' && task.status !== filters.status) {
        return;
      }

      rows.push([
        rec.referenceNo,
        rec.title,
        rec.category,
        rec.locationName,
        rec.subLocation || '-',
        rec.inspectionDate,
        task.title,
        task.status,
        rec.inspectorName,
        new Date(task.timestamp).toLocaleString(),
        new Date(task.lastUpdated).toLocaleString(),
        (task.remarks || '').replace(/"/g, '""'),
        task.photos.length.toString(),
      ]);
    });
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `CheckList_Report_${filters.startDate || 'All'}_to_${filters.endDate || 'All'}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export raw JSON backup
export function exportToJSON(records: InspectionRecord[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `CheckList_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate standalone printable & downloadable HTML report document
export function generateReportHTML(records: InspectionRecord[], filters: ReportFilter): string {
  const filtered = filterRecords(records, filters);

  let totalTasks = 0;
  let okTasks = 0;
  let notOkTasks = 0;
  let pendingTasks = 0;
  let naTasks = 0;

  filtered.forEach((rec) => {
    rec.tasks.forEach((t) => {
      if (filters.status !== 'ALL' && t.status !== filters.status) return;
      totalTasks++;
      if (t.status === 'OK') okTasks++;
      if (t.status === 'Not OK') notOkTasks++;
      if (t.status === 'Pending') pendingTasks++;
      if (t.status === 'N/A') naTasks++;
    });
  });

  const okPct = totalTasks ? Math.round((okTasks / totalTasks) * 100) : 0;
  const notOkPct = totalTasks ? Math.round((notOkTasks / totalTasks) * 100) : 0;
  const pendingPct = totalTasks ? Math.round((pendingTasks / totalTasks) * 100) : 0;
  const naPct = totalTasks ? Math.round((naTasks / totalTasks) * 100) : 0;

  const filterLocText = filters.locationId === 'ALL' ? 'All Site Locations' : getLocationName(filters.locationId);
  const filterCatText = filters.category === 'ALL' ? 'All Categories (Cleaning, MEP, Landscape)' : filters.category;
  const filterDateText =
    filters.startDate || filters.endDate
      ? `${filters.startDate || 'Earliest'} to ${filters.endDate || 'Latest'}`
      : 'All Recorded Dates';

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inspection Checklist Report - ${filterLocText}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .logo-area h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .logo-area p {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 13px;
      font-weight: 500;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #475569;
      line-height: 1.6;
    }
    .meta-box strong { color: #0f172a; }

    .filters-banner {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .filter-item .label {
      text-transform: uppercase;
      font-size: 10px;
      color: #64748b;
      font-weight: 700;
      display: block;
    }
    .filter-item .val {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 2px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 24px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 8px;
      text-align: center;
    }
    .kpi-card.total { background: #f8fafc; border-color: #cbd5e1; }
    .kpi-card.ok { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
    .kpi-card.not-ok { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
    .kpi-card.pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }
    .kpi-card.na { background: #f1f5f9; border-color: #e2e8f0; color: #475569; }
    .kpi-val { font-size: 24px; font-weight: 800; line-height: 1.1; }
    .kpi-sub { font-size: 11px; font-weight: 600; margin-top: 2px; }
    .kpi-label { font-size: 10px; text-transform: uppercase; font-weight: 700; margin-top: 4px; letter-spacing: 0.5px; }

    .progress-bar-container {
      background: #e2e8f0;
      border-radius: 999px;
      height: 10px;
      display: flex;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .prog-ok { background: #10b981; height: 100%; }
    .prog-notok { background: #ef4444; height: 100%; }
    .prog-pending { background: #f59e0b; height: 100%; }
    .prog-na { background: #94a3b8; height: 100%; }

    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 28px 0 14px 0;
      border-left: 4px solid #0284c7;
      padding-left: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rec-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 24px;
      page-break-inside: avoid;
      background: #ffffff;
      overflow: hidden;
    }
    .rec-header {
      background: #f8fafc;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .rec-title { font-size: 14px; font-weight: 800; color: #0f172a; }
    .rec-meta { font-size: 11px; color: #64748b; margin-top: 2px; }

    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      padding: 9px 12px;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-ok { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .badge-not-ok { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-pending { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-na { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

    .photo-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
    .photo-thumb {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      width: 120px;
      background: #000;
    }
    .photo-thumb img { width: 120px; height: 90px; object-fit: cover; display: block; }
    .photo-cap {
      font-size: 9px;
      color: #64748b;
      padding: 4px 6px;
      background: #f8fafc;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .footer-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 2px solid #e2e8f0;
      page-break-inside: avoid;
    }
    .sig-box {
      width: 44%;
      border-top: 1px dashed #94a3b8;
      padding-top: 8px;
      text-align: center;
      font-size: 11px;
      color: #475569;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .report-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div class="logo-area">
        <h1>CHECK LIST</h1>
        <p>Site Facility Audit &amp; Task Inspection Report</p>
      </div>
      <div class="meta-box">
        <div>Report Ref: <strong>RPT-${Date.now().toString().slice(-6)}</strong></div>
        <div>Generated: <strong>${new Date().toLocaleString()}</strong></div>
        <div>Total Inspection Sessions: <strong>${filtered.length}</strong></div>
      </div>
    </div>

    <div class="filters-banner">
      <div class="filter-item">
        <span class="label">Categorized Site Location</span>
        <span class="val">${filterLocText}</span>
      </div>
      <div class="filter-item">
        <span class="label">Checklist Scope</span>
        <span class="val">${filterCatText}</span>
      </div>
      <div class="filter-item">
        <span class="label">Date Range Filter</span>
        <span class="val">${filterDateText}</span>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card total">
        <div class="kpi-val">${totalTasks}</div>
        <div class="kpi-label">Total Audit Tasks</div>
      </div>
      <div class="kpi-card ok">
        <div class="kpi-val">${okTasks}</div>
        <div class="kpi-sub">${okPct}%</div>
        <div class="kpi-label">OK (Passed)</div>
      </div>
      <div class="kpi-card not-ok">
        <div class="kpi-val">${notOkTasks}</div>
        <div class="kpi-sub">${notOkPct}%</div>
        <div class="kpi-label">Not OK (Defect)</div>
      </div>
      <div class="kpi-card pending">
        <div class="kpi-val">${pendingTasks}</div>
        <div class="kpi-sub">${pendingPct}%</div>
        <div class="kpi-label">Pending Action</div>
      </div>
      <div class="kpi-card na">
        <div class="kpi-val">${naTasks}</div>
        <div class="kpi-sub">${naPct}%</div>
        <div class="kpi-label">N/A</div>
      </div>
    </div>

    <div class="progress-bar-container" title="Status Distribution: ${okPct}% OK, ${notOkPct}% Defect, ${pendingPct}% Pending">
      <div class="prog-ok" style="width: ${okPct}%;"></div>
      <div class="prog-notok" style="width: ${notOkPct}%;"></div>
      <div class="prog-pending" style="width: ${pendingPct}%;"></div>
      <div class="prog-na" style="width: ${naPct}%;"></div>
    </div>

    <div class="section-title">Site Location Audit Records (${filtered.length})</div>
`;

  if (filtered.length === 0) {
    html += `<div style="padding: 40px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">No inspection entries match the selected filter criteria.</div>`;
  } else {
    filtered.forEach((rec) => {
      html += `
    <div class="rec-card">
      <div class="rec-header">
        <div>
          <div class="rec-title">${rec.referenceNo} - ${rec.title}</div>
          <div class="rec-meta">📍 <strong>${rec.locationName}</strong> ${rec.subLocation ? `(${rec.subLocation})` : ''} | 🏷️ ${rec.category} | 📅 ${rec.inspectionDate}</div>
        </div>
        <div>
          <span class="badge ${rec.overallStatus === 'Pass' ? 'badge-ok' : rec.overallStatus === 'Fail' ? 'badge-not-ok' : 'badge-pending'}">Overall: ${rec.overallStatus}</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Task Description</th>
            <th style="width: 12%;">Status</th>
            <th style="width: 18%;">Timestamp</th>
            <th style="width: 22%;">Inspector &amp; Remarks</th>
            <th style="width: 23%;">Attached Photos</th>
          </tr>
        </thead>
        <tbody>
      `;

      rec.tasks.forEach((t) => {
        if (filters.status !== 'ALL' && t.status !== filters.status) return;

        const badgeClass =
          t.status === 'OK'
            ? 'badge-ok'
            : t.status === 'Not OK'
            ? 'badge-not-ok'
            : t.status === 'Pending'
            ? 'badge-pending'
            : 'badge-na';

        let photosHtml = '';
        if (t.photos && t.photos.length > 0) {
          photosHtml = `<div class="photo-grid">`;
          t.photos.forEach((pho) => {
            photosHtml += `
              <div class="photo-thumb">
                <img src="${pho.dataUrl}" alt="${pho.fileName}" />
                <div class="photo-cap">${pho.caption || pho.fileName}</div>
              </div>
            `;
          });
          photosHtml += `</div>`;
        } else {
          photosHtml = `<span style="color: #94a3b8; font-style: italic;">No photo</span>`;
        }

        html += `
          <tr>
            <td>
              <strong>${t.title}</strong>
              ${t.description ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${t.description}</div>` : ''}
            </td>
            <td><span class="badge ${badgeClass}">${t.status}</span></td>
            <td style="font-size: 11px; color: #475569;">
              <div>🕒 ${new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div style="font-size: 10px; color: #94a3b8;">${new Date(t.timestamp).toLocaleDateString()}</div>
            </td>
            <td>
              <div style="font-weight: 600; color: #1e293b; font-size: 11px;">👤 ${rec.inspectorName}</div>
              <div style="color: #475569; margin-top: 2px;">${t.remarks || '<em>No remarks</em>'}</div>
            </td>
            <td>${photosHtml}</td>
          </tr>
        `;
      });

      html += `
        </tbody>
      </table>
    </div>
      `;
    });
  }

  html += `
    <div class="footer-signatures">
      <div class="sig-box">
        <div><strong>Site Inspector Signature</strong></div>
        <div style="margin-top: 4px; font-size: 10px; color: #94a3b8;">Date &amp; Time Sign-off</div>
      </div>
      <div class="sig-box">
        <div><strong>Facility Manager / QA Approval</strong></div>
        <div style="margin-top: 4px; font-size: 10px; color: #94a3b8;">Date &amp; Time Sign-off</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
}

// Download standalone HTML report file
export function exportToHTML(records: InspectionRecord[], filters: ReportFilter) {
  const htmlContent = generateReportHTML(records, filters);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `CheckList_Inspection_Report_${filters.startDate || 'All'}_to_${filters.endDate || 'All'}.html`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate printable HTML PDF report safely using an iframe to avoid window.open pop-up blocking
export function triggerPrintReport(records: InspectionRecord[], filters: ReportFilter) {
  const htmlContent = generateReportHTML(records, filters);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print trigger error', err);
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }
    }, 400);
  }
}

