const pool = require('../config/database');

class Database {
  // Helper untuk menjalankan query
  static async query(sql, values = []) {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(sql, values);
      return results;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  // Helper untuk menjalankan multiple queries dalam transaction
  static async transaction(callback) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Inisialisasi Database
  static async initialize() {
    try {
      const connection = await pool.getConnection();
      const schemaSQL = require('fs').readFileSync('./database/schema.sql', 'utf8');
      const queries = schemaSQL.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          await connection.execute(query);
        }
      }
      
      connection.release();
      console.log('Database initialized successfully');
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }
}

module.exports = Database;
