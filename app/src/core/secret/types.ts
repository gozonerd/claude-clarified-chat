export type SecretPattern = 'anthropic' | 'openai' | 'aws' | 'jwt' | 'github-pat' | 'rsa-pem' | 'password-kv';
export type Detection = {
  readonly eventId: string;
  readonly pattern: SecretPattern;
  readonly start: number;
  readonly end: number;
  readonly preview: string;
};
