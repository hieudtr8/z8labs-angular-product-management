const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'product-management',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

