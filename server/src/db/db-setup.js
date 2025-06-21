const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('../../knexfile');
const logger = require('../utils/logger');

function setupDb() {
  const env = process.env.NODE_ENV || 'development';
  const config = knexConfig[env];
  
  const knex = Knex(config);
  
  // Bind all Models to the knex instance
  Model.knex(knex);
  
  logger.info(`Database connection established (${env} environment)`);
  
  return knex;
}

module.exports = { setupDb };