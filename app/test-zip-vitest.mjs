import { zipSync } from 'fflate';

const files = {
  'test.txt': new TextEncoder().encode('test content'),
};

const zipBytes = zipSync(files);
console.log('Zip bytes created:', zipBytes.length);
console.log('Type:', zipBytes.constructor.name);
console.log('First 20 bytes:', Array.from(zipBytes.slice(0, 20)));
