export type CorpusEntry = {
  content: string;
  pattern: 'anthropic' | 'openai' | 'aws' | 'jwt' | 'github-pat' | 'rsa-pem' | 'password-kv';
};

export const positives: ReadonlyArray<CorpusEntry> = [
  // Anthropic keys (10)
  { content: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop', pattern: 'anthropic' },
  { content: 'sk-ant-v1-0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', pattern: 'anthropic' },
  { content: 'sk-ant-XyZ1234567890-_AaBbCcDdEeFf', pattern: 'anthropic' },
  { content: 'sk-ant-prod-1234567890-AbCdEfGhIjKlMnOpQrStUvWx', pattern: 'anthropic' },
  { content: 'sk-ant-2024-test-key-1234567890abcdef', pattern: 'anthropic' },
  { content: 'sk-ant-sandbox-QwErTyUiOpAsdfGhjKl1234567890', pattern: 'anthropic' },
  { content: 'sk-ant-dev-zZxXcCvVbBnNmMqQwWeEr1234567890ab', pattern: 'anthropic' },
  { content: 'sk-ant-staging-AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp', pattern: 'anthropic' },
  { content: 'sk-ant-integration-test-1234567890-abcd', pattern: 'anthropic' },
  { content: 'sk-ant-_-_-_-_1234567890-AbCdEfGh-_-_-_-_', pattern: 'anthropic' },

  // OpenAI keys (8)
  { content: 'sk-proj-abcdef1234567890abcdef1234567890', pattern: 'openai' },
  { content: 'sk-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', pattern: 'openai' },
  { content: 'sk-TeSt1234567890AbCdEfGhIjKlMnOpQr', pattern: 'openai' },
  { content: 'sk-xxxxxxxxyyyyyyyyyzzzzzzzzwwwwwwww', pattern: 'openai' },
  { content: 'sk-1111111111111111111111111111111111', pattern: 'openai' },
  { content: 'sk-AaBbCcDdEeFfGgHhIiJjKkLlMmNn', pattern: 'openai' },
  { content: 'sk-00112233445566778899aabbccddeeff', pattern: 'openai' },
  { content: 'sk-9876543210fedcba9876543210fedcba', pattern: 'openai' },

  // AWS access keys (8)
  { content: 'AKIA1A2B3C4D5E6F7G8H', pattern: 'aws' },
  { content: 'AKIA0000111122223333', pattern: 'aws' },
  { content: 'AKIAZZZZ999911112222', pattern: 'aws' },
  { content: 'AKIABCDEFGHIJKLMNOPQ', pattern: 'aws' },
  { content: 'AKIA12AB34CD56EF78GH', pattern: 'aws' },
  { content: 'AKIA9999888877776666', pattern: 'aws' },
  { content: 'AKIATESTKEY1234567890', pattern: 'aws' },
  { content: 'AKIA0101010101010101', pattern: 'aws' },

  // JWT tokens (8)
  { content: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', pattern: 'jwt' },
  { content: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoidGVzdCJ9.EoiLJ7F2qKLyFfDMhZwXaAfqV6Jg6Y6J8dXxYZXnYzs', pattern: 'jwt' },
  { content: 'eyJSNjZiIjoiTW9kdWxpIiwibm9uIjoidGllbmUifQ.eyJjbGFpbSI6InZhbHVlIn0.xyz1234567890abcdefghijklmnopqrst', pattern: 'jwt' },
  { content: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIn0.abcdefghijklmnopqrstuvwxyz0123456789', pattern: 'jwt' },
  { content: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0MjMsImlhdCI6MTYyMzY4NzYwMH0.ABCDEFG_HIJKLMNOPQRSTUVWXYZabcdefghij', pattern: 'jwt' },
  { content: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vZXhhbXBsZS5vcmciLCJhdWQiOiJodHRwOi8vZXhhbXBsZS5jb20ifQ.test1234567890abcdefghijklmnopqrstuv', pattern: 'jwt' },
  { content: 'eyJhbGciOiJub25lIn0.eyJzb21lIjoicGF5bG9hZCJ9.test_signature_here_1234567890abc', pattern: 'jwt' },
  { content: 'eyJraWQiOiJrZXkxIiwiYWxnIjoiRVMzODQifQ.eyJodHRwOi8vY2xhaW1zLmV4YW1wbGUuY29tL25hbWUiOiJKb2huIn0.test1234567890abcdefghijklmnopqrstuvwxyz0', pattern: 'jwt' },

  // GitHub PATs (10)
  { content: 'ghp_1234567890abcdefghijklmnopqrstuvwx', pattern: 'github-pat' },
  { content: 'gho_0123456789abcdefghijklmnopqrstuv', pattern: 'github-pat' },
  { content: 'ghu_0123456789abcdefghijklmnopqrstuv', pattern: 'github-pat' },
  { content: 'ghs_0123456789abcdefghijklmnopqrstuv', pattern: 'github-pat' },
  { content: 'ghr_0123456789abcdefghijklmnopqrstuv', pattern: 'github-pat' },
  { content: 'ghp_testtoken1234567890testtoken123456', pattern: 'github-pat' },
  { content: 'gho_aabbccddeeffgghhiijjkkllmmnnoopp', pattern: 'github-pat' },
  { content: 'ghu_123456789012345678901234567890123456', pattern: 'github-pat' },
  { content: 'ghs_xyz1234567890abc1234567890abc1234', pattern: 'github-pat' },
  { content: 'ghr_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s', pattern: 'github-pat' },

  // RSA PEM keys (8)
  { content: '-----BEGIN RSA PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: '-----BEGIN OPENSSH PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: '-----BEGIN EC PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: '-----BEGIN DSA PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: '-----BEGIN PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: 'Here is my key: -----BEGIN RSA PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: 'export const key = `-----BEGIN OPENSSH PRIVATE KEY-----', pattern: 'rsa-pem' },
  { content: '{"privateKey": "-----BEGIN EC PRIVATE KEY-----', pattern: 'rsa-pem' },

  // Password key-value patterns (10)
  { content: 'password=MySecurePass123!', pattern: 'password-kv' },
  { content: 'password: "MySecurePass123!"', pattern: 'password-kv' },
  { content: 'passwd = "test1234pass"', pattern: 'password-kv' },
  { content: 'pwd:SuperSecret999!!!', pattern: 'password-kv' },
  { content: 'secret="my_secret_key_123"', pattern: 'password-kv' },
  { content: 'token = abcdef123456token', pattern: 'password-kv' },
  { content: 'api_key: "sk_test_abc123def456"', pattern: 'password-kv' },
  { content: 'api-key=testkey123testkey', pattern: 'password-kv' },
  { content: 'PASSWORD=Admin@1234', pattern: 'password-kv' },
  { content: 'SECRET_TOKEN = "my_very_secure_token_123"', pattern: 'password-kv' },
];

export const negatives: ReadonlyArray<string> = [
  // Too short to be valid secrets
  'sk-tooshort',
  'AKIA1234',
  'ghp_short',
  'eyJhbGciOiJIUzI1NiJ9.short',

  // Version strings
  'v1.2.3-abc',
  'version-2.0.0-rc1',
  '1.0.0-beta',
  'release-3.5.2',

  // Hex strings that look secret-like but don't match patterns
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',

  // Base64-like but not JWT (missing dots)
  'aGVsbG8gd29ybGQgdGhpcyBpcyBiYXNlNjQ=',
  'dGhpcyBpcyBub3QgYSB0b2tlbiBhdCBhbGw=',
  'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo=',

  // Random-looking but too short
  'sk-abc123',
  'ghp_abc',
  'AKIA00',

  // Markdown code fences
  '```javascript',
  '```',
  '~~~python',
  '~~~',

  // Password-like but missing required length
  'pass=123',
  'pwd:ab',
  'secret=x',

  // Similar to JWT but malformed
  'eyJhbGciOiJIUzI1NiJ9.incomplete',
  'header.payload.with.too.many.parts',
  'notavalidjwt.atall',

  // Config strings that look like keys
  'sk_',
  'AKIA',
  'ghp_',

  // Real-world non-secret strings
  'https://api.openai.com/v1/models',
  'POST /api/v2/auth/token',
  'Authorization: Bearer',
  'Content-Type: application/json',

  // ID-like but not secrets
  'user-id-12345',
  'request-id-abc123def456',
  'trace-id-00001111',

  // Email addresses
  'user@example.com',
  'admin@company.org',
  'test.user@domain.co.uk',

  // URLs
  'https://github.com/user/repo',
  'http://example.com:3000/api',
  'ftp://files.example.org/path',

  // UUID-like
  '550e8400-e29b-41d4-a716-446655440000',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',

  // Database connection strings
  'postgresql://user:pass@localhost/db',
  'mysql://root@127.0.0.1:3306/database',

  // Common config keys (not secrets)
  'DEBUG=true',
  'ENV=production',
  'TIMEOUT=5000',
  'PORT=8080',

  // Words that contain secret-related keywords but aren't secrets
  'The password policy requires 8 characters',
  'My API key is stored securely',
  'Token expiration in 30 days',
  'This password is temporary',

  // Partial patterns
  'sk',
  'password',
  'secret',
  'token',

  // Special characters only
  '!@#$%^&*()',
  '___---___---',
  '......',

  // Numbers only
  '1234567890',
  '9999999999999999999999',

  // Mixed but too short
  'abc123',
  'xyz-789',
  'test_key',

  // Valid-looking format but obviously fake
  'sk-definitely-not-a-real-key-too-obvious',
  'password=hunter2',
  'api_key=example123example',

  // Regex matching False positives
  'password123', // has 'password' prefix but only 9 chars
  'pwdsomethingshort', // has 'pwd' but short
];
