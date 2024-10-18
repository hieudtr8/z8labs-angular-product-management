const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;

// Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  require('dotenv').config({
    path: 'src/environments/.env'
  });
// `environment.ts` file structure
  const envConfigFile = `export const environment = {
    apiUrl: '${process.env['API_URL']}',
    firebase: {
      projectId: '${process.env['FIREBASE_PROJECT_ID']}',
      appId: '${process.env['FIREBASE_APP_ID']}',
      storageBucket: '${process.env['FIREBASE_STORAGE_BUCKET']}',
      apiKey: '${process.env['FIREBASE_API_KEY']}',
      authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
      messagingSenderId: '${process.env['FIREBASE_MESSAGING_SENDER_ID']}',
      measurementId: '${process.env['FIREBASE_MEASUREMENT_ID']}'
    },
    production: true,
  };`;
  console.log('The file `environment.ts` will be written with the following content: \n');
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
  });
};

setEnv();
