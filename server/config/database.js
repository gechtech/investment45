import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database
const dbPath = path.join(__dirname, '../data/ethio-invest.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
const initDatabase = async () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      referralCode TEXT UNIQUE NOT NULL,
      referredBy TEXT,
      walletBalance REAL DEFAULT 0,
      totalEarnings REAL DEFAULT 0,
      totalWithdrawn REAL DEFAULT 0,
      isAdmin BOOLEAN DEFAULT FALSE,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Investments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      planId TEXT NOT NULL,
      amount REAL NOT NULL,
      dailyROI REAL NOT NULL,
      totalReturn REAL NOT NULL,
      daysRemaining INTEGER NOT NULL,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Investment submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS investment_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      planId TEXT NOT NULL,
      amount REAL NOT NULL,
      ftId TEXT NOT NULL,
      screenshot TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      adminNotes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Referrals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrerId INTEGER NOT NULL,
      referredId INTEGER NOT NULL,
      level INTEGER NOT NULL,
      commission REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrerId) REFERENCES users(id),
      FOREIGN KEY (referredId) REFERENCES users(id)
    )
  `);

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      reward REAL NOT NULL,
      type TEXT NOT NULL,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      taskId INTEGER NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      completedAt DATETIME,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (taskId) REFERENCES tasks(id),
      UNIQUE(userId, taskId)
    )
  `);

  // Profit logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      investmentId INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (investmentId) REFERENCES investments(id)
    )
  `);

  // Insert default admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@ethioinvest.com');
  if (!adminExists) {
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    db.prepare(`
      INSERT INTO users (name, email, phone, password, referralCode, isAdmin)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Admin User', 'admin@ethioinvest.com', '+251911000000', hashedPassword, 'ADMIN001', true);
  }

  // Insert default tasks if not exist
  const tasksExist = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  if (tasksExist.count === 0) {
    const defaultTasks = [
      {
        title: 'Complete Profile',
        description: 'Fill out your complete profile information',
        reward: 50,
        type: 'profile'
      },
      {
        title: 'First Investment',
        description: 'Make your first investment to start earning',
        reward: 100,
        type: 'investment'
      },
      {
        title: 'Refer a Friend',
        description: 'Invite a friend to join EthioInvest Network',
        reward: 200,
        type: 'referral'
      },
      {
        title: 'Daily Check-in',
        description: 'Check your dashboard daily for 7 consecutive days',
        reward: 75,
        type: 'daily'
      }
    ];

    const insertTask = db.prepare(`
      INSERT INTO tasks (title, description, reward, type)
      VALUES (?, ?, ?, ?)
    `);

    defaultTasks.forEach(task => {
      insertTask.run(task.title, task.description, task.reward, task.type);
    });
  }

  console.log('✅ Database initialized successfully');
};

export { db, initDatabase };