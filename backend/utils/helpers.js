// UUID Generator
const { v4: uuidv4 } = require('uuid');

// Generate UUID v4
function generateUUID() {
  return uuidv4();
}

// Generate random string
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Calculate age
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Format date to YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return [d.getFullYear(), month, day].join('-');
}

// Parse date from DD/MM/YYYY to YYYY-MM-DD
function parseDateDMY(dateString) {
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Get date range for current month
function getCurrentMonthRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay)
  };
}

module.exports = {
  generateUUID,
  generateRandomString,
  calculateAge,
  formatDate,
  parseDateDMY,
  getCurrentMonthRange
};
