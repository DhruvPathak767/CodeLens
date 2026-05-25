export const mockReviews = [
  {
    id: 'rev-001',
    title: 'auth-service.ts',
    language: 'typescript',
    status: 'completed',
    createdAt: '2026-05-22T14:30:00Z',
    summary: { critical: 2, warning: 5, suggestion: 8 },
    score: 72,
  },
  {
    id: 'rev-002',
    title: 'payment-handler.py',
    language: 'python',
    status: 'completed',
    createdAt: '2026-05-21T09:15:00Z',
    summary: { critical: 0, warning: 3, suggestion: 12 },
    score: 88,
  },
  {
    id: 'rev-003',
    title: 'api-routes.js',
    language: 'javascript',
    status: 'completed',
    createdAt: '2026-05-20T16:45:00Z',
    summary: { critical: 1, warning: 4, suggestion: 6 },
    score: 79,
  },
  {
    id: 'rev-004',
    title: 'database-pool.go',
    language: 'go',
    status: 'completed',
    createdAt: '2026-05-19T11:20:00Z',
    summary: { critical: 0, warning: 2, suggestion: 5 },
    score: 91,
  },
  {
    id: 'rev-005',
    title: 'user-controller.java',
    language: 'java',
    status: 'completed',
    createdAt: '2026-05-18T08:00:00Z',
    summary: { critical: 3, warning: 7, suggestion: 4 },
    score: 65,
  },
]

export const mockReviewDetail = {
  id: 'rev-001',
  title: 'auth-service.ts',
  language: 'typescript',
  status: 'completed',
  createdAt: '2026-05-22T14:30:00Z',
  score: 72,
  originalCode: `async function authenticateUser(email: string, password: string) {
  const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
  if (!user) return null;
  
  const token = jwt.sign({ id: user.id }, 'hardcoded-secret-key');
  return { user, token };
}`,
  optimizedCode: `async function authenticateUser(email: string, password: string) {
  const user = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;
  
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  return { user, token };
}`,
  issues: {
    security: [
      {
        id: 'sec-1',
        severity: 'critical',
        title: 'SQL Injection Vulnerability',
        line: 2,
        description: 'User input is directly interpolated into SQL query without parameterization.',
        suggestion: 'Use parameterized queries with prepared statements.',
        fix: "await db.query('SELECT * FROM users WHERE email = $1', [email])",
      },
      {
        id: 'sec-2',
        severity: 'critical',
        title: 'Hardcoded JWT Secret',
        line: 5,
        description: 'JWT secret is hardcoded in source code, exposing tokens if code is leaked.',
        suggestion: 'Store JWT secret in environment variables.',
        fix: "jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })",
      },
      {
        id: 'sec-3',
        severity: 'warning',
        title: 'Missing Password Verification',
        line: 3,
        description: 'Authentication proceeds without verifying the password hash.',
        suggestion: 'Compare provided password against stored bcrypt hash.',
        fix: 'const isValid = await bcrypt.compare(password, user.password_hash)',
      },
    ],
    performance: [
      {
        id: 'perf-1',
        severity: 'suggestion',
        title: 'Add Connection Pooling',
        line: 2,
        description: 'Database queries could benefit from connection pooling for high traffic.',
        suggestion: 'Configure a connection pool with appropriate min/max connections.',
        fix: null,
      },
    ],
    'best-practices': [
      {
        id: 'bp-1',
        severity: 'warning',
        title: 'Missing Error Handling',
        line: 1,
        description: 'Function lacks try-catch for database and JWT operations.',
        suggestion: 'Wrap async operations in try-catch and return appropriate error responses.',
        fix: null,
      },
      {
        id: 'bp-2',
        severity: 'suggestion',
        title: 'Add Input Validation',
        line: 1,
        description: 'Email and password parameters are not validated before use.',
        suggestion: 'Validate email format and password strength requirements.',
        fix: null,
      },
    ],
    scalability: [
      {
        id: 'scale-1',
        severity: 'suggestion',
        title: 'Consider Token Refresh Strategy',
        line: 5,
        description: 'Short-lived tokens without refresh mechanism may impact UX at scale.',
        suggestion: 'Implement refresh token rotation pattern.',
        fix: null,
      },
    ],
  },
}

export const mockMovieReviews = [
  {
    id: 1,
    movieName: 'The Matrix (2026)',
    posterGradient: 'from-emerald-950 to-green-900 border-green-500/20',
    posterCode: 'MTX',
    rating: 5,
    quote: 'An absolute masterpiece of cyberpunk cinema. The philosophy of simulation and reality holds up perfectly.',
    name: 'Neo Smith',
    role: 'Cybersecurity Analyst',
    avatar: 'NS'
  },
  {
    id: 2,
    movieName: 'Blade Runner 2049 (2026)',
    posterGradient: 'from-pink-950 via-purple-950 to-indigo-950 border-pink-500/20',
    posterCode: 'BR2',
    rating: 5,
    quote: 'A visual triumph. The scale, neon cinematography, and sound design create an incredibly immersive dystopian future.',
    name: 'Rachel K',
    role: 'AI Ethics Researcher',
    avatar: 'RK'
  },
  {
    id: 3,
    movieName: 'Ex Machina (2026)',
    posterGradient: 'from-slate-800 to-slate-950 border-slate-500/20',
    posterCode: 'EXM',
    rating: 5,
    quote: 'A chilling and tightly written exploration of consciousness, Turing tests, and corporate AI manipulation.',
    name: 'Caleb Nathan',
    role: 'Full Stack Engineer',
    avatar: 'CN'
  },
  {
    id: 4,
    movieName: 'Interstellar (2026)',
    posterGradient: 'from-indigo-950 via-violet-950 to-black border-indigo-500/20',
    posterCode: 'INT',
    rating: 5,
    quote: 'Epic in scope yet deeply emotional. The scientific accuracy of relativity and black holes is mind-bending.',
    name: 'Murph Cooper',
    role: 'Data Scientist',
    avatar: 'MC'
  },
  {
    id: 5,
    movieName: 'The Social Network (2026)',
    posterGradient: 'from-blue-950 to-cyan-950 border-blue-500/20',
    posterCode: 'TSN',
    rating: 4,
    quote: 'Brilliant pacing and sharp dialog. A fascinating look at software scaling, friendship, and litigation.',
    name: 'Eduardo S',
    role: 'Growth Hacker',
    avatar: 'ES'
  },
  {
    id: 6,
    movieName: 'Tron: Legacy (2026)',
    posterGradient: 'from-cyan-950 via-sky-950 to-amber-950 border-cyan-500/20',
    posterCode: 'TRN',
    rating: 4,
    quote: 'The Daft Punk soundtrack alone makes this a masterpiece. An visual representation of computer grids.',
    name: 'Sam Flynn',
    role: 'Systems Architect',
    avatar: 'SF'
  }
]

export const mockFeatures = [
  {
    icon: 'Brain',
    title: 'AI-Powered Analysis',
    description: 'Deep learning models trained on millions of code reviews detect bugs, vulnerabilities, and anti-patterns.',
  },
  {
    icon: 'Shield',
    title: 'Security First',
    description: 'OWASP-aligned security scanning catches injection flaws, auth issues, and data exposure risks.',
  },
  {
    icon: 'Zap',
    title: 'Instant Feedback',
    description: 'Get comprehensive review results in seconds, not hours. Ship code with confidence.',
  },
  {
    icon: 'GitBranch',
    title: 'Git Integration',
    description: 'Seamlessly integrates with GitHub, GitLab, and Bitbucket for automated PR reviews.',
  },
  {
    icon: 'BarChart3',
    title: 'Team Analytics',
    description: 'Track code quality trends, team performance, and improvement over time.',
  },
  {
    icon: 'Code2',
    title: 'Multi-Language',
    description: 'Support for 20+ programming languages with language-specific best practice rules.',
  },
]

export const mockHowItWorks = [
  { step: 1, title: 'Paste or Upload Code', description: 'Drop your code snippet, upload a file, or connect your repository.' },
  { step: 2, title: 'AI Deep Analysis', description: 'Our models scan for security, performance, and quality issues in real-time.' },
  { step: 3, title: 'Review & Fix', description: 'Get actionable suggestions with one-click fixes and optimized code.' },
  { step: 4, title: 'Ship with Confidence', description: 'Export reports, share with your team, and merge knowing your code is solid.' },
]

export const mockStats = {
  totalReviews: 1247,
  issuesFound: 3891,
  avgScore: 84,
  timeSaved: '312h',
}
