import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, init?: ResponseInit) => {
        return {
          json: () => Promise.resolve(body),
          ...init
        };
      }
    }
  };
});

// Mock Request and Response
global.Request = class {
  constructor(public url: string, public init?: RequestInit) {}
  json() {
    return Promise.resolve(this.init?.body ? JSON.parse(this.init.body as string) : {});
  }
} as unknown as typeof Request;

global.Response = class {
  constructor(public body?: BodyInit | null, public init?: ResponseInit) {}
  json() {
    return Promise.resolve(this.body ? JSON.parse(this.body as string) : {});
  }
  static json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), init);
  }
} as unknown as typeof Response;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/generate-script',
  useParams: () => ({
    locale: 'en'
  }),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (str: string) => str,
}));

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  ELEVENLABS_API_KEY: 'test_key',
  GCS_PROJECT_ID: 'test_project',
  GCS_BUCKET_NAME: 'test_bucket',
  GEMINI_API_KEY: 'test_key',
};

// Suppress console errors in tests
global.console.error = jest.fn(); 