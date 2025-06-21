const { Model } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password_hash', 'user_type', 'first_name', 'last_name'],
      
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        password_hash: { type: 'string', minLength: 8 },
        user_type: { type: 'string', enum: ['musician', 'producer', 'studio'] },
        first_name: { type: 'string', minLength: 1 },
        last_name: { type: 'string', minLength: 1 },
        profile_image_url: { type: ['string', 'null'] },
        bio: { type: ['string', 'null'] },
        location: { type: ['string', 'null'] },
        hourly_rate: { type: ['number', 'null'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }
  
  static get relationMappings() {
    const MusicianProfile = require('./MusicianProfile');
    const Project = require('./Project');
    const ProjectInvitation = require('./ProjectInvitation');
    const SessionMusician = require('./SessionMusician');
    const Payment = require('./Payment');
    const Message = require('./Message');
    const Review = require('./Review');
    const Availability = require('./Availability');
    
    return {
      musicianProfile: {
        relation: Model.HasOneRelation,
        modelClass: MusicianProfile,
        join: {
          from: 'users.id',
          to: 'musician_profiles.user_id'
        }
      },
      
      createdProjects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: 'users.id',
          to: 'projects.creator_id'
        }
      },
      
      projectInvitations: {
        relation: Model.HasManyRelation,
        modelClass: ProjectInvitation,
        join: {
          from: 'users.id',
          to: 'project_invitations.musician_id'
        }
      },
      
      sessionParticipations: {
        relation: Model.HasManyRelation,
        modelClass: SessionMusician,
        join: {
          from: 'users.id',
          to: 'session_musicians.musician_id'
        }
      },
      
      outgoingPayments: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: 'users.id',
          to: 'payments.payer_id'
        }
      },
      
      incomingPayments: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: 'users.id',
          to: 'payments.payee_id'
        }
      },
      
      sentMessages: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'users.id',
          to: 'messages.sender_id'
        }
      },
      
      receivedMessages: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'users.id',
          to: 'messages.recipient_id'
        }
      },
      
      givenReviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.reviewer_id'
        }
      },
      
      receivedReviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.reviewee_id'
        }
      },
      
      availability: {
        relation: Model.HasManyRelation,
        modelClass: Availability,
        join: {
          from: 'users.id',
          to: 'availability.user_id'
        }
      }
    };
  }
  
  // Instance methods
  
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    
    // Set timestamps
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }
  
  async $beforeUpdate(opt, context) {
    await super.$beforeUpdate(opt, context);
    
    // Update the updated_at timestamp
    this.updated_at = new Date().toISOString();
  }
  
  // Hash the password before insertion
  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  
  // Verify password
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;