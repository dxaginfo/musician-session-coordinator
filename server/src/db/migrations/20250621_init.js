/**
 * Initial database schema migration
 */
exports.up = function(knex) {
  return knex.schema
    // Users table
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.enum('user_type', ['musician', 'producer', 'studio']).notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.text('bio');
      table.string('location');
      table.decimal('hourly_rate', 10, 2);
      table.string('profile_image_url');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Musician profiles
    .createTable('musician_profiles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('years_experience').unsigned().defaultTo(0);
      table.boolean('studio_experience').defaultTo(false);
      table.boolean('remote_recording_capability').defaultTo(false);
      table.string('portfolio_url');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Instruments
    .createTable('instruments', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('category').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Musician instruments (junction table)
    .createTable('musician_instruments', (table) => {
      table.increments('id').primary();
      table.integer('musician_profile_id').unsigned().notNullable().references('id').inTable('musician_profiles').onDelete('CASCADE');
      table.integer('instrument_id').unsigned().notNullable().references('id').inTable('instruments').onDelete('CASCADE');
      table.integer('proficiency_level').unsigned().defaultTo(1); // 1-5 scale
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['musician_profile_id', 'instrument_id']);
    })
    
    // Genres
    .createTable('genres', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Musician genres (junction table)
    .createTable('musician_genres', (table) => {
      table.increments('id').primary();
      table.integer('musician_profile_id').unsigned().notNullable().references('id').inTable('musician_profiles').onDelete('CASCADE');
      table.integer('genre_id').unsigned().notNullable().references('id').inTable('genres').onDelete('CASCADE');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['musician_profile_id', 'genre_id']);
    })
    
    // Projects
    .createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.integer('creator_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.enum('status', ['draft', 'open', 'in_progress', 'completed', 'cancelled']).notNullable().defaultTo('draft');
      table.date('start_date');
      table.date('end_date');
      table.decimal('budget', 10, 2);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Project genres (junction table)
    .createTable('project_genres', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
      table.integer('genre_id').unsigned().notNullable().references('id').inTable('genres').onDelete('CASCADE');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['project_id', 'genre_id']);
    })
    
    // Project instrument needs
    .createTable('project_instruments', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
      table.integer('instrument_id').unsigned().notNullable().references('id').inTable('instruments').onDelete('CASCADE');
      table.text('requirements');
      table.boolean('filled').defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['project_id', 'instrument_id']);
    })
    
    // Project invitations
    .createTable('project_invitations', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
      table.integer('musician_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('instrument_id').unsigned().notNullable().references('id').inTable('instruments').onDelete('CASCADE');
      table.enum('status', ['pending', 'accepted', 'declined', 'cancelled']).notNullable().defaultTo('pending');
      table.text('message');
      table.decimal('rate', 10, 2);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['project_id', 'musician_id', 'instrument_id']);
    })
    
    // Recording sessions
    .createTable('sessions', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.datetime('start_time').notNullable();
      table.datetime('end_time').notNullable();
      table.string('location');
      table.enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled']).notNullable().defaultTo('scheduled');
      table.text('notes');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Session musicians
    .createTable('session_musicians', (table) => {
      table.increments('id').primary();
      table.integer('session_id').unsigned().notNullable().references('id').inTable('sessions').onDelete('CASCADE');
      table.integer('musician_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('instrument_id').unsigned().notNullable().references('id').inTable('instruments').onDelete('CASCADE');
      table.enum('status', ['invited', 'confirmed', 'declined', 'completed', 'no_show']).notNullable().defaultTo('invited');
      table.decimal('rate', 10, 2);
      table.text('notes');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Composite unique key
      table.unique(['session_id', 'musician_id', 'instrument_id']);
    })
    
    // Payments
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('session_id').unsigned().references('id').inTable('sessions').onDelete('SET NULL');
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL');
      table.integer('payer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('payee_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.decimal('amount', 10, 2).notNullable();
      table.enum('status', ['pending', 'completed', 'failed', 'refunded']).notNullable().defaultTo('pending');
      table.string('payment_method');
      table.string('transaction_id');
      table.text('notes');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Messages
    .createTable('messages', (table) => {
      table.increments('id').primary();
      table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('recipient_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.text('content').notNullable();
      table.boolean('read').notNullable().defaultTo(false);
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL');
      table.integer('session_id').unsigned().references('id').inTable('sessions').onDelete('SET NULL');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    
    // Reviews
    .createTable('reviews', (table) => {
      table.increments('id').primary();
      table.integer('reviewer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('reviewee_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL');
      table.integer('rating').notNullable().checkPositive();
      table.text('content');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      // Ensure a user can only review another user once per project
      table.unique(['reviewer_id', 'reviewee_id', 'project_id']);
    })
    
    // Availability
    .createTable('availability', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.date('date').notNullable();
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.boolean('recurring').defaultTo(false);
      table.enum('recurrence_pattern', ['daily', 'weekly', 'monthly']);
      table.date('recurrence_end_date');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('availability')
    .dropTableIfExists('reviews')
    .dropTableIfExists('messages')
    .dropTableIfExists('payments')
    .dropTableIfExists('session_musicians')
    .dropTableIfExists('sessions')
    .dropTableIfExists('project_invitations')
    .dropTableIfExists('project_instruments')
    .dropTableIfExists('project_genres')
    .dropTableIfExists('projects')
    .dropTableIfExists('musician_genres')
    .dropTableIfExists('genres')
    .dropTableIfExists('musician_instruments')
    .dropTableIfExists('instruments')
    .dropTableIfExists('musician_profiles')
    .dropTableIfExists('users');
};