import type { Event } from '../../../schemas/event';

export const POSITIVES: ReadonlyArray<Event> = [
  // Anthropic (12)
  { id: 'a1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'key: sk-ant-abcdefghij1234567890' },
  { id: 'a2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-ZZZZZZZZZZZZZZZZZZZZ' },
  { id: 'a3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-_-_-_-_-_-_-_-_-_-_-' },
  { id: 'a4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { secret: 'sk-ant-abc123def456ghi789jkl012' } },
  { id: 'a5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'debug: sk-ant-loremipsumdolorsit' },
  { id: 'a6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-AAA_BBB-CCC_DDD-EEE' },
  { id: 'a7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'old sk-ant-12345678901234567890a' },
  { id: 'a8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-aaaa-bbbb-cccc-dddd-' },
  { id: 'a9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'config: sk-ant-xyz_xyz_xyz_xyz_xyz' },
  { id: 'a10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-1a2b3c4d5e6f7g8h9i0j' },
  { id: 'a11', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-testtesttesttesttest' },
  { id: 'a12', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-qwertyuiopasdfghjklzxc' },

  // OpenAI (12)
  { id: 'o1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'key sk-AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHII' },
  { id: 'o2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-0000000000000000000000000000000000' },
  { id: 'o3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { token: 'sk-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz' } },
  { id: 'o4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-abcdefghijklmnopqrstuvwxyz012345' },
  { id: 'o5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'exposed sk-MMMMNNNNOOOOppppqqqqrrrrssssuuuu' },
  { id: 'o6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-1234567890ABCDEFGHIJKLMNOPQRSTUV' },
  { id: 'o7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'token: sk-abcd1234efgh5678ijkl9012mnop3456' },
  { id: 'o8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-xyzXYZ0123456789ABCDEFGHIJKLMNOPQ' },
  { id: 'o9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api sk-wwwwxxxyyyzzz0011223344556677888899' },
  { id: 'o10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-VVVVWWWWXXXXYYYYZZZZaaaabbbbccccdd' },
  { id: 'o11', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-testingtestingtestingtestingtestin' },
  { id: 'o12', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-randomrandomrandomrandomrandomrndm' },

  // AWS (12)
  { id: 'w1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAIOSFODNN7EXAMPLE' },
  { id: 'w2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { key: 'AKIA1234567890ABCDEF' } },
  { id: 'w3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'aws_key: AKIAZZZZZZZZZZZZZZZZ' },
  { id: 'w4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIA0000000000000000' },
  { id: 'w5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAVVVVVVVVVVVVVVVV' },
  { id: 'w6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'old AKIAXXXXXXXXXXXXXX' },
  { id: 'w7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIALLLLLLLLLLLLLLLL' },
  { id: 'w8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAMMMMMMMMMMMMMMMMM' },
  { id: 'w9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'key AKIANNNNNNNNNNNNNNNN' },
  { id: 'w10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAOOOOOOOOOOOOOOOO' },
  { id: 'w11', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAPPPPPPPPPPPPPPPPP' },
  { id: 'w12', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAQQQQQQQQQQQQQQQQQQ' },

  // JWT (10)
  { id: 'j1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U' },
  { id: 'j2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0In0.abcdefghijklmnopqrstuv' } },
  { id: 'j3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'jwt: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLmNvbSIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIn0.aaaa' },
  { id: 'j4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJpc3N1ZXIiLCJzdWIiOiJzdWJqZWN0In0.signature123' },
  { id: 'j5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJhbGciOiJFUzI1NiJ9.eyJkYXRhIjoidmFsdWUifQ.xxxx' },
  { id: 'j6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJBZlhSIn0.eyJhYmMiOiJkZWYifQ.sig' },
  { id: 'j7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'bearer eyJ1c2VyIjoibmFtZSJ9.eyJpZCI6IjEifQ.abcdef' },
  { id: 'j8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJ0eXAiOiJKV1QifQ.eyJzdWIiOiJ0ZXN0In0.signaturePart' },
  { id: 'j9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'token eyJ4eHgiOiJ5eSJ9.eyJkYXRhIn0.sig123' },
  { id: 'j10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJhYmMiOiIxMjMifQ.eyJkZWYiOiI0NTYifQ.ghi' },

  // GitHub PAT (10)
  { id: 'gh1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghp_16C7e42F292c6912E7710c838347Ae178B4a' },
  { id: 'gh2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { token: 'gho_AAAAAAAABBBBBBBBCCCCCCCCDDDDDDDDEEEEEEEE' } },
  { id: 'gh3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghu_1234567890ABCDEFGHIJKLMNOPQRSTUV' },
  { id: 'gh4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'github token ghs_0123456789abcdefghijklmnopqrstuvwx' },
  { id: 'gh5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghr_ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' },
  { id: 'gh6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghp_aaaaaaaabbbbbbbbccccccccddddddddeeeeee' },
  { id: 'gh7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'gho_something1234567890abcdefghijk123456789012' },
  { id: 'gh8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghu_AAAAAABBBBBBCCCCCCDDDDDDEEEEEEFFFFFFFFGG' },
  { id: 'gh9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'pat ghs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { id: 'gh10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghr_1111111111111111111111111111111111111' },

  // RSA PEM (5)
  { id: 'r1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '-----BEGIN PRIVATE KEY-----' },
  { id: 'r2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { key: '-----BEGIN RSA PRIVATE KEY-----' } },
  { id: 'r3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '-----BEGIN OPENSSH PRIVATE KEY-----' },
  { id: 'r4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ssh -----BEGIN EC PRIVATE KEY-----' },
  { id: 'r5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '-----BEGIN DSA PRIVATE KEY-----' },

  // Password KV (7)
  { id: 'p1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'password=SuperSecret123!' },
  { id: 'p2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'passwd=myPass@1234' },
  { id: 'p3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'pwd=LongPassword123456' },
  { id: 'p4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'secret=hidden_value_here' },
  { id: 'p5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api-key=1234567890abcdef' },
  { id: 'p6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api_key=superlongsecret12345' },
  { id: 'p7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'token : SuperSecret123456' },
];

export const NEGATIVES: ReadonlyArray<Event> = [
  // Not-quite-anthropic
  { id: 'n1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-abc' },
  { id: 'n2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-abc-def-ghi-jkl-mno' },
  { id: 'n3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'antenna sk-ant' },

  // Not-quite-openai
  { id: 'n4', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-abcd1234' },
  { id: 'n5', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-' },
  { id: 'n6', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'skate-ABC123DEF456' },

  // Not-quite-AWS
  { id: 'n7', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIA123456789' },
  { id: 'n8', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAabcdefghijklm' },
  { id: 'n9', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIZ' },

  // Not-quite-JWT
  { id: 'n10', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJhYmMifQ.payload' },
  { id: 'n11', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'eyJ0eXAifQ.only.twoParts' },
  { id: 'n12', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'notJWT.atAll.xyz' },

  // Not-quite-GitHub
  { id: 'n13', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'gh_short' },
  { id: 'n14', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'ghx_1234567890abcdefghijk' },
  { id: 'n15', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'github_ABC123' },

  // Not-quite-RSA
  { id: 'n16', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '-----BEGIN PUBLIC KEY-----' },
  { id: 'n17', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '-----BEGIN CERTIFICATE-----' },
  { id: 'n18', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'BEGIN PRIVATE KEY' },

  // Not-quite-password (all too short)
  { id: 'n19', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'password=short' },
  { id: 'n20', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'passwd=ab' },
  { id: 'n21', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'pwd=12345' },
  { id: 'n22', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api_key=short' },

  // Common false positives
  { id: 'n23', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sky-blue-and-green' },
  { id: 'n24', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'skating-ABCD1234567890' },
  { id: 'n25', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'password hint remember the dog' },
  { id: 'n26', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api documentation here' },
  { id: 'n27', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'secret message in code' },
  { id: 'n28', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'token accepted from server' },
  { id: 'n29b', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'secret place stored somewhere' },
  { id: 'n30b', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'api call was made' },

  // Empty or null
  { id: 'n31a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: '' },
  { id: 'n32a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: null },
  { id: 'n33a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: undefined },
  { id: 'n34a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'normal log message' },

  // Edge cases
  { id: 'n35a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: { nested: { data: 'no secrets here' } } },
  { id: 'n36a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: [1, 2, 3, 4, 5] },
  { id: 'n37a', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: true },
];
