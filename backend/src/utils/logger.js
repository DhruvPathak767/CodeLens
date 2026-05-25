/**
 * Premium ANSI-Colorized Console Logging System
 * Bypasses library overhead with direct terminal codes.
 */

const COLORS = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
  GRAY: "\x1b[90m",
};

const formatTime = () => {
  return `${COLORS.GRAY}[${new Date().toISOString()}]${COLORS.RESET}`;
};

const logger = {
  info: (message) => {
    console.log(`${formatTime()} ${COLORS.BLUE}[INFO]${COLORS.RESET} ${message}`);
  },

  success: (message) => {
    console.log(`${formatTime()} ${COLORS.GREEN}[SUCCESS]${COLORS.RESET} ${message}`);
  },

  warn: (message) => {
    console.log(`${formatTime()} ${COLORS.YELLOW}[WARN]${COLORS.RESET} ${message}`);
  },

  error: (message, trace = "") => {
    console.error(
      `${formatTime()} ${COLORS.RED}[ERROR]${COLORS.RESET} ${message}` +
        (trace ? `\n${COLORS.RED}${trace}${COLORS.RESET}` : "")
    );
  },

  ai: (message) => {
    console.log(`${formatTime()} ${COLORS.MAGENTA}[GEMINI AI]${COLORS.RESET} ${message}`);
  },

  db: (message) => {
    console.log(`${formatTime()} ${COLORS.CYAN}[DATABASE]${COLORS.RESET} ${message}`);
  },

  // Stopwatch timings
  timers: new Map(),

  time: (label) => {
    logger.timers.set(label, process.hrtime());
  },

  timeEnd: (label) => {
    const startTime = logger.timers.get(label);
    if (!startTime) {
      logger.warn(`No timer active for label: '${label}'`);
      return;
    }
    const diff = process.hrtime(startTime);
    const ms = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    logger.timers.delete(label);
    console.log(
      `${formatTime()} ${COLORS.BLUE}[TIMER]${COLORS.RESET} ${label}: ${COLORS.YELLOW}${ms}ms${COLORS.RESET}`
    );
  },
};

module.exports = logger;
