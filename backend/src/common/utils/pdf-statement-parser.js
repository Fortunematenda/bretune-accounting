/**
 * Extracts transaction lines from bank statement PDF text.
 * Strict heuristics to capture only actual transactions, not balances, refs, or headers.
 */

// Amount with decimal: 1,234.56  -500.00  R 1234.56
const AMOUNT_WITH_DECIMAL = /(?:^|\s)([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*|\d{1,9})(?:\.\d{1,2}))\s*(?:ZAR|R|USD|\$|EUR|€)?\s*$/i;
// Amount without decimal (whole number): only if reasonable
const AMOUNT_WHOLE = /(?:^|\s)([+-]?\s*\d{1,6})\s*(?:ZAR|R|USD|\$|EUR|€)\s*$/i;

// Opening/closing balance extraction (no /g - we want first match with captures)
const OPENING_BALANCE_PATTERNS = [
  /opening\s+balance\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))\s*(?:ZAR|R|USD|\$|EUR|€)?/i,
  /balance\s+brought\s+forward\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))/i,
  /brought\s+forward\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))/i,
];
const CLOSING_BALANCE_PATTERNS = [
  /closing\s+balance\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))\s*(?:ZAR|R|USD|\$|EUR|€)?/i,
  /balance\s+carried\s+forward\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))/i,
  /carried\s+forward\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))/i,
  /available\s+balance\s*:?\s*([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?))/i,
];

const SKIP_PATTERNS = [
  /^(date|description|reference|debit|credit|balance|particulars|details)\s*$/i,
  /^opening\s+balance[:]?\s*[\d,.\s+-]+$/i,
  /^closing\s+balance[:]?\s*[\d,.\s+-]+$/i,
  /^brought\s+forward[:]?\s*[\d,.\s+-]+$/i,
  /^carried\s+forward[:]?\s*[\d,.\s+-]+$/i,
  /^balance\s+brought\s+forward/i,
  /^balance\s+carried\s+forward/i,
  /^total\s+(credits|debits|deposits|withdrawals)/i,
  /^statement\s+of\s+account/i,
  /^page\s+\d+(\s+of\s+\d+)?/i,
  /^account\s+(number|holder)/i,
  /^branch\s+code/i,
  /^details\s+service\s+fee\s+debits\s+credits\s+date\s+balance/i,
  /^statement\s+from\s+\d/i,
  /^\d{10,}\s*$/,
  // Rate notices, disclaimers - not transactions
  /prime\s+lending\s+rate/i,
  /lending\s+rate\s+changed/i,
  /changed\s+to\s*$/i,
  /interest\s+rate/i,
  /repo\s+rate/i,
  /percentage\s+points/i,
];

function parseDate(s, defaultYear) {
  if (!s || typeof s !== 'string') return null;
  const t = s.trim();
  const year = defaultYear || new Date().getFullYear();
  const dmy = t.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (dmy) {
    const year = dmy[3].length === 2 ? 2000 + parseInt(dmy[3], 10) : parseInt(dmy[3], 10);
    const month = parseInt(dmy[2], 10) - 1;
    const day = parseInt(dmy[1], 10);
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const ymd = t.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymd) {
    const d = new Date(parseInt(ymd[1], 10), parseInt(ymd[2], 10) - 1, parseInt(ymd[3], 10));
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const wordDate = t.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*(\d{2,4})?/i);
  if (wordDate) {
    const months = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
    const m = months[wordDate[2].toLowerCase().slice(0, 3)];
    const y = wordDate[3] ? (wordDate[3].length === 2 ? 2000 + parseInt(wordDate[3], 10) : parseInt(wordDate[3], 10)) : year;
    const d = new Date(y, m, parseInt(wordDate[1], 10));
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  // Capitec/MYMO style: MM DD (e.g. "01 27" for Jan 27)
  const mmdd = t.match(/^(\d{1,2})\s+(\d{1,2})$/);
  if (mmdd) {
    const month = parseInt(mmdd[1], 10) - 1;
    const day = parseInt(mmdd[2], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const d = new Date(year, month, day);
      if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
  }
  return null;
}

/** Infer statement year from text. Use the MOST RECENT year found (not the first) so that
 * statements spanning Dec 2025–Jan 2026 correctly use 2026 for Jan transactions. */
function inferStatementYear(text) {
  if (!text) return new Date().getFullYear();
  const years = [];
  // Month+year patterns: "Jan 2026", "January 2026", "31 January 2026"
  const monthMatches = text.matchAll(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+20(\d{2})/gi);
  for (const m of monthMatches) years.push(2000 + parseInt(m[1], 10));
  // Any 20XX year
  const yearMatches = text.matchAll(/20(\d{2})/g);
  for (const m of yearMatches) years.push(2000 + parseInt(m[1], 10));
  if (years.length > 0) return Math.max(...years);
  return new Date().getFullYear();
}

function parseAmount(s) {
  if (s == null || s === '') return 0;
  const t = String(s).trim().replace(/\s/g, '').replace(/,/g, '');
  const m = t.match(/^([+-]?)(\d+(?:\.\d{1,2})?)$/);
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    return sign * parseFloat(m[2]);
  }
  return 0;
}

function shouldSkip(line) {
  for (const pat of SKIP_PATTERNS) {
    if (pat.test(line.trim())) return true;
  }
  return false;
}

function extractAmountFromMatch(m) {
  if (!m) return null;
  const s = m[1].replace(/\s/g, '').replace(/,/g, '');
  const n = parseFloat(s.replace(/[^\d.-]/g, ''));
  return Number.isNaN(n) ? null : n;
}

/**
 * Extract opening and closing balance from statement text.
 */
function extractBalances(text) {
  if (!text || typeof text !== 'string') return { openingBalance: null, closingBalance: null };
  let opening = null;
  let closing = null;
  for (const pat of OPENING_BALANCE_PATTERNS) {
    const m = text.match(pat);
    if (m) {
      const val = extractAmountFromMatch(m);
      if (val !== null) { opening = val; break; }
    }
  }
  for (const pat of CLOSING_BALANCE_PATTERNS) {
    const m = text.match(pat);
    if (m) {
      const val = extractAmountFromMatch(m);
      if (val !== null) { closing = val; break; }
    }
  }
  return { openingBalance: opening, closingBalance: closing };
}

const DATE_PATTERN = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})|(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?(?:\s+\d{2,4})?)|(\b\d{1,2}\s+\d{1,2}\b)/i;

// All amount-like numbers on a line (for tables with debit/credit/balance columns)
// Also matches trailing minus: 100.00- or 2,000.00- (Capitec debit format)
const ALL_AMOUNTS = /([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*|\d{1,9})(?:\.\d{1,2}))\s*(?:[-])?\s*(?:ZAR|R|USD|\$|EUR|€)?/gi;
/**
 * Find transaction amount on a line. Handles:
 * - FNB-style: [Date | Description | Amount | Balance | Charges] - Amount may have "Cr" (positive) or none (negative)
 * - Capitec/MYMO: [Details | Debits | Credits | Date | Balance] - Debits col first, Credits col second.
 *   For credits, Debits=0 so first amount is 0; we must use the second (non-zero) amount.
 * - Single signed amount
 */
function findBestAmount(line) {
  const matches = [...line.matchAll(ALL_AMOUNTS)];
  if (matches.length === 0) return null;

  let matchIndex = 0;
  let amt = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    amt = parseAmount(m[1].replace(/\s/g, '').replace(/,/g, ''));
    if (amt !== 0 && Math.abs(amt) <= 99_999_999.99) {
      matchIndex = i;
      break;
    }
  }
  if (amt === 0 || Math.abs(amt) > 99_999_999.99) return null;

  const amountMatch = matches[matchIndex];
  const lineBeforeAmt = line.slice(0, amountMatch.index).toLowerCase();
  const endIdx = matches[matchIndex + 1] ? matches[matchIndex + 1].index : amountMatch.index + amountMatch[0].length + 30;
  const afterFirst = line.slice(amountMatch.index + amountMatch[0].length, endIdx);
  const fullContext = (lineBeforeAmt + ' ' + afterFirst).toLowerCase();

  const fullMatch = amountMatch[0] || '';
  const hasTrailingMinus = /-\s*$/.test(fullMatch);

  let isCredit = /\bCr\b/i.test(afterFirst);
  if (hasTrailingMinus) {
    isCredit = false;
  } else if (!isCredit && !/(?:deposit\s+fee|fee\s+[:\-]\s*(?:cash\s+)?deposit)/i.test(fullContext) &&
    /(?:credit\s+transfer|magtape\s+credit|autobank\s+cash\s+deposit|cash\s+deposit\b|deposit\b|received|inward|payment\s+received|eft\s+credit|bank\s+deposit|transfer\s+in)/i.test(fullContext)) {
    isCredit = true;
  } else if (!isCredit && matchIndex > 0) {
    isCredit = true;
  }

  let amount = Math.abs(amt);
  amount = isCredit ? amount : -amount;

  if (matches.length === 1 || matchIndex === 0) {
    const explicitSign = amountMatch[1].trim().startsWith('-') || hasTrailingMinus;
    if (explicitSign) amount = -Math.abs(amount);
    else if (!isCredit && !amountMatch[1].includes('+')) amount = -Math.abs(amount);
    return { match: amountMatch, amount };
  }

  return { match: amountMatch, amount };
}

/**
 * Skip if line/block looks like a rate notice, summary box, or disclaimer (not a transaction).
 */
function shouldSkipContent(text) {
  if (!text || text.length < 10) return true;
  const lower = text.toLowerCase();
  if (/prime\s+lending\s+rate|rate\s+changed\s+to|lending\s+rate\s+changed/i.test(lower)) return true;
  if (/interest\s+rate|repo\s+rate|percentage\s+points/i.test(lower)) return true;
  if (/^on\s*,\s*the\s+/i.test(text.trim())) return true;
  // Skip summary/header boxes: "Statement Date : Statement Balances Opening Balance"
  if (/statement\s+date\s*:?\s*statement\s+balances/i.test(lower)) return true;
  if (/statement\s+balances\s+opening\s+balance/i.test(lower)) return true;
  if (/statement\s+balances\s+closing\s+balance/i.test(lower)) return true;
  return false;
}

/**
 * Try to parse a single block of text as a transaction. Returns null if not valid.
 * Supports both: [Date Description Amount] (FNB) and [Description Amount Date Balance] (Capitec/MYMO).
 */
function parseBlockAsTransaction(block, statementYear) {
  if (shouldSkip(block) || shouldSkipContent(block)) return null;

  const found = findBestAmount(block);
  if (!found) return null;

  const { match: amountMatch, amount } = found;
  const dateMatch = block.match(DATE_PATTERN);
  if (!dateMatch) return null;

  const dateStr = dateMatch[0];
  const date = parseDate(dateStr.trim(), statementYear);
  if (!date) return null;

  let description = block
    .replace(dateStr, ' ')
    .replace(amountMatch[0], ' ')
    .replace(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d{1,2})?\s*(?:Cr|Dr|ZAR|R|USD|\$|EUR|€)?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  if (!description) description = 'Transaction';

  return { date, description, reference: '', amount };
}

/**
 * Capitec/MYMO table: Details | Service Fee | Debits | Credits | Date | Balance.
 * Transaction amount is the number immediately BEFORE the date (MM DD). Trailing minus = debit.
 */
function parseTableRowFormat(block, statementYear) {
  const dateMatch = block.match(/\b(\d{1,2})\s+(\d{1,2})\b/);
  if (!dateMatch) return null;

  const dateStr = dateMatch[0];
  const month = parseInt(dateMatch[1], 10);
  if (month < 1 || month > 12) return null;

  const date = parseDate(dateStr.trim(), statementYear);
  if (!date) return null;

  const dateIdx = block.indexOf(dateStr);
  const beforeDate = block.slice(0, dateIdx);
  const afterDate = block.slice(dateIdx + dateStr.length);

  const amountsBefore = [...beforeDate.matchAll(/([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*|\d{1,9})(?:\.\d{1,2}))\s*(-)?/gi)];
  const amountsAfter = [...afterDate.matchAll(/([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*|\d{1,9})(?:\.\d{1,2}))\s*(-)?/gi)];

  const isCreditContext = /deposit|credit|received|inward|transfer\s+in|magtape\s+credit|cash\s+deposit|autobank/i.test(beforeDate);

  let amount = null;

  if (amountsBefore.length > 0) {
    // Debits | Credits columns: use last non-zero amount (credit row has 0 in Debits)
    for (let j = amountsBefore.length - 1; j >= 0; j--) {
      const amtInfo = amountsBefore[j];
      const amtStr = amtInfo[1].replace(/\s/g, '').replace(/,/g, '');
      const amt = parseAmount(amtStr);
      if (amt !== 0 && Math.abs(amt) <= 99_999_999.99) {
        const hasTrailingMinus = amtInfo[2] === '-' || /-\s*$/.test(amtInfo[0]);
        amount = hasTrailingMinus ? -Math.abs(amt) : Math.abs(amt);
        break;
      }
    }
  }

  if (amount === null && amountsAfter.length > 0) {
    const firstAfter = amountsAfter[0];
    const amtStr = firstAfter[1].replace(/\s/g, '').replace(/,/g, '');
    const amt = parseAmount(amtStr);
    if (amt !== 0 && Math.abs(amt) <= 99_999_999.99) {
      const hasTrailingMinus = firstAfter[2] === '-' || /-\s*$/.test(firstAfter[0]);
      // Use amount after date as credit when: no trailing minus AND (credit keywords OR no amount before date)
      if (!hasTrailingMinus && (isCreditContext || amountsBefore.length === 0)) {
        amount = Math.abs(amt);
      }
    }
  }

  if (amount === null) return null;

  let description = beforeDate
    .replace(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d{1,2})?\s*-?/g, ' ')
    .replace(/#+/g, ' ')
    .replace(/\b(fee|debits|credits|date|balance)\b/gi, ' ')
    .replace(/\bbalance\s+brought\s+forward\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  if (!description) description = 'Transaction';

  if (shouldSkip(description) || shouldSkipContent(block)) return null;
  if (/^balance\s+brought\s+forward$/i.test(description.trim())) return null;

  return { date, description, reference: '', amount };
}

/**
 * Extract transaction lines from PDF text. Handles both:
 * - Single-line transactions (date, description, amount on one line)
 * - Multi-line transactions (span 2-4 lines - common in PDF extraction)
 * - Capitec/MYMO table: Details | Debits | Credits | Date | Balance
 */
function extractLinesFromText(text, overrideYear) {
  if (!text || typeof text !== 'string') return [];
  const inferred = inferStatementYear(text);
  let statementYear = inferred;
  if (overrideYear != null) {
    if (typeof overrideYear === 'number' && !Number.isNaN(overrideYear)) statementYear = overrideYear;
    else if (typeof overrideYear === 'string') {
      const y = parseInt(overrideYear.slice(0, 4), 10);
      if (!Number.isNaN(y)) statementYear = y;
    }
  }
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const result = [];
  const seen = new Set();

  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    blocks.push(lines[i]);
    if (i + 1 < lines.length) blocks.push(lines[i] + ' ' + lines[i + 1]);
    if (i + 2 < lines.length) blocks.push(lines[i] + ' ' + lines[i + 1] + ' ' + lines[i + 2]);
    if (i + 3 < lines.length) blocks.push(lines[i] + ' ' + lines[i + 1] + ' ' + lines[i + 2] + ' ' + lines[i + 3]);
  }

  const allBlocks = blocks;

  for (const block of allBlocks) {
    if (block.length < 8) continue;

    let tx = parseTableRowFormat(block, statementYear);
    if (!tx) tx = parseBlockAsTransaction(block, statementYear);
    if (!tx) continue;

    const key = `${tx.date}|${tx.amount}|${tx.description.slice(0, 50)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    result.push(tx);
  }

  // Fallback: scan for orphan credit lines (deposits) that main parser missed
  const creditPattern = /(?:credit\s+transfer|magtape\s+credit|autobank\s+cash\s+deposit|cash\s+deposit\b|deposit\b|salary\s+credit|interest\s+credit|received|inward|payment\s+received|eft\s+credit|bank\s+deposit|transfer\s+in)/i;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const block = i + 1 < lines.length ? line + ' ' + lines[i + 1] : line;
    if (!creditPattern.test(block)) continue;
    if (shouldSkip(line) || shouldSkipContent(block)) continue;

    const amountMatches = block.matchAll(/([+-]?\s*(?:\d{1,3}(?:[,\s]\d{3})*|\d{1,9})(?:\.\d{1,2}))\s*(-)?/gi);
    for (const m of amountMatches) {
      const amtStr = m[1].replace(/\s/g, '').replace(/,/g, '');
      const amt = parseAmount(amtStr);
      if (amt <= 0 || Math.abs(amt) > 99_999_999.99) continue;
      const hasTrailingMinus = m[2] === '-' || /-\s*$/.test(m[0]);
      if (hasTrailingMinus) continue;

      let date = null;
      const dateM = block.match(/\b(\d{1,2})\s+(\d{1,2})\b/);
      if (dateM) date = parseDate(dateM[0].trim(), statementYear);
      if (!date) {
        const fullDate = block.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/);
        if (fullDate) date = parseDate((fullDate[1] || fullDate[2] || fullDate[0]).trim(), statementYear);
      }
      if (!date) date = `${statementYear}-01-01`;

      let description = block
        .replace(m[0], ' ')
        .replace(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d{1,2})?/g, ' ')
        .replace(/\b(fee|debits|credits|date|balance)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);
      if (!description) description = 'Deposit';

      const key = `${date}|${amt}|${description.slice(0, 50)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      result.push({ date, description, reference: '', amount: amt });
      break;
    }
  }

  result.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return result;
}

module.exports = {
  extractLinesFromText,
  extractBalances,
  parseDate,
  parseAmount,
};
