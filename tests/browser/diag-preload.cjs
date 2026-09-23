// TEMPORARY DIAGNOSTIC, NOT FOR MERGE: one Playwright protocol log file per process.
const fs = require('node:fs');
const path = require('node:path');
if (process.env.KEW_DIAG_DIR) fs.mkdirSync(process.env.KEW_DIAG_DIR, { recursive: true });
if (process.env.KEW_DIAG_PROTOCOL === '1' && process.env.KEW_DIAG_DIR) {
  process.env.DEBUG = 'pw:protocol';
  process.env.DEBUG_COLORS = '0';
  process.env.DEBUG_FILE = path.join(process.env.KEW_DIAG_DIR, `protocol-${process.pid}.log`);
}
