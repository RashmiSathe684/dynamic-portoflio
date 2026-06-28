import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

// Connection string to Neon PostgreSQL
const connectionString = 'postgres://neondb_owner:npg_ijxZRY3rDH8e@ep-misty-wind-apl0beuy-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Helper to convert snake_case to camelCase
function snakeToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

async function fetchPortfolioData() {
  const client = new Client({ connectionString });
  try {
    console.log('Connecting to Neon PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    // Fetch Profile Settings
    console.log('Fetching profile_settings...');
    const profileRes = await client.query('SELECT * FROM profile_settings ORDER BY id DESC LIMIT 1');
    const profile = profileRes.rows[0] ? snakeToCamel(profileRes.rows[0]) : null;

    // Fetch Skills
    console.log('Fetching skills...');
    const skillsRes = await client.query('SELECT * FROM skills ORDER BY id ASC');
    const skills = snakeToCamel(skillsRes.rows);

    // Fetch Projects
    console.log('Fetching projects...');
    const projectsRes = await client.query('SELECT * FROM projects ORDER BY id DESC');
    const projects = snakeToCamel(projectsRes.rows);

    // Fetch Achievements
    console.log('Fetching achievements...');
    const achievementsRes = await client.query('SELECT * FROM achievements ORDER BY id DESC');
    const achievements = snakeToCamel(achievementsRes.rows);

    // Fetch Certifications
    console.log('Fetching certifications...');
    const certificationsRes = await client.query('SELECT * FROM certifications ORDER BY id DESC');
    const certifications = snakeToCamel(certificationsRes.rows);

    // Fetch Internships
    console.log('Fetching internships...');
    const internshipsRes = await client.query('SELECT * FROM internships ORDER BY id DESC');
    const internships = snakeToCamel(internshipsRes.rows);

    // Assemble dynamic details matching the PortfolioDetailsDto
    const portfolioDetails = {
      profile,
      skills,
      projects,
      achievements,
      certifications,
      internships
    };

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const targetDir = path.join(__dirname, '..', 'src', 'data');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, 'portfolio-static.json');
    fs.writeFileSync(targetFile, JSON.stringify(portfolioDetails, null, 2), 'utf-8');
    console.log(`Successfully fetched database data and wrote to ${targetFile}!`);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fetchPortfolioData();
