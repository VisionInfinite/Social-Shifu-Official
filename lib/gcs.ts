import { Storage } from '@google-cloud/storage';

// Parse the private key properly
const privateKey = process.env.GCS_PRIVATE_KEY 
  ? process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/\n/g, '\n')
  : undefined;

if (!process.env.GCS_PROJECT_ID || !process.env.GCS_CLIENT_EMAIL || !privateKey || !process.env.GCS_BUCKET_NAME) {
  throw new Error('Missing required GCS environment variables');
}

// Create credentials object
const credentials = {
  client_email: process.env.GCS_CLIENT_EMAIL,
  private_key: privateKey,
};

// Initialize storage with explicit credentials
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// Test the connection
async function testGCSConnection() {
  try {
    await bucket.exists();
    console.log('✅ Successfully connected to Google Cloud Storage');
  } catch (error) {
    console.error('❌ Failed to connect to Google Cloud Storage:', error);
    throw error;
  }
}

// Call test connection on initialization
testGCSConnection().catch(console.error);

export const uploadToGCS = async (buffer: Buffer, destination: string): Promise<string> => {
  try {
    // Create a write stream
    const file = bucket.file(destination);
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/mpeg',
      },
      resumable: false,
    });

    // Write the buffer to GCS
    await new Promise((resolve, reject) => {
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.end(buffer);
    });

    // Generate a signed URL that expires in 1 hour
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    console.log(`File uploaded. Signed URL: ${signedUrl}`);
    
    return signedUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error uploading to GCS:', error.message);
    } else {
      console.error('Unknown error occurred while uploading to GCS:', error);
    }
    throw error;
  }
};
