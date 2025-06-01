const functions = require('@google-cloud/functions-framework');

// Register a CloudEvent function for handling storage events
functions.cloudEvent('processUploadedFile', cloudEvent => {
  // The CloudEvent object contains information about the event
  console.log('Event ID:', cloudEvent.id);
  console.log('Event Type:', cloudEvent.type);

  // The data contains information about the storage object
  const file = cloudEvent.data;
  console.log('Bucket:', file.bucket);
  console.log('File:', file.name);
  console.log('Metadata:', file.metadata);

  // Here you would add your file processing logic
  console.log('Processing file:', file.name);

  // Example: you could analyze images, generate thumbnails, extract text, etc.
  return Promise.resolve();
});
