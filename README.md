# RS Dynamic Full-Stack Portfolio Application

A dynamic, recruiter-ready full-stack portfolio site with a secure, JWT-authenticated administrator dashboard to manage all content dynamically in real-time, eliminating code redeployments.

---

## 🚀 Live Demo & Hosting
* **Live Application:** [rashmi-sathe-dynamic-portfolio.vercel.app](https://rashmi-sathe-dynamic-portfolio.vercel.app/)
* **Backend API Host:** [portfolio-backend-2srb.onrender.com](https://portfolio-backend-2srb.onrender.com/api/projects)
* **API Keep-Alive Strategy:** Backends hosted on Render's free tier enter "sleep mode" after 15 minutes of inactivity. To prevent a 50-second cold start lag for recruiters, a custom cron job runs every 10 minutes to ping the public `/api/projects` endpoint, keeping the container active and responsive at all times.

---

## 🛠 Tech Stack

### Frontend
* **Core Framework:** React.js (v19)
* **Build Engine:** Vite (v8)
* **Routing:** React Router DOM (v7)
* **Animations:** Framer Motion (v12)
* **HTTP Client:** Axios (v1)
* **Styling:** Tailwind CSS (v3) & Custom Glassmorphism CSS variables
* **Icons:** React Icons

### Backend
* **Core Framework:** Spring Boot (v3.2.5)
* **Java Version:** Java 17
* **Database Migration:** Flyway (v9)
* **ORM:** Spring Data JPA (Hibernate)
* **Security:** Spring Security (Stateless JWT token validation)
* **Third-Party Integrations:** Cloudinary Java SDK (Media Streaming/Uploads), Java Mail Sender (Gmail SMTP)
* **Build System:** Maven

### Database & Hosting
* **Production Database:** PostgreSQL (Hosted Serverless on Neon DB)
* **Media & Documents CDN:** Cloudinary Cloud Registry (Profile Photo, Resume PDF, and Project Cover Images)
* **Frontend Deployment:** Vercel
* **Backend Deployment:** Render (Dockerized Web Service)

---

## 📈 Key Features

### 🌟 Public Portfolio
* **Dynamic Content Loading:** Entire page renders from backend database records (Profile Photo, Projects, Certifications, Achievements, Internships, Education).
* **Interactive Document Viewer:** Live modal overlay allows recruiters to view and download the PDF Resume inside the app window.
* **Smart Search & Filters:** Search projects by titles or tech tags with fluid client-side pagination.
* **Instant Contact Form:** Submits contact details, validates inputs, sends success alerts, and forwards the message directly to the administrator's email inbox using Gmail SMTP.

### 🛡 Admin Dashboard (`/admin/dashboard`)
* **Secure Portal:** Protected by a custom client-side React Route guard and a backend Spring Security JWT validation filter.
* **Live Stats Counters:** Shows counts of projects, certifications, experiences, and unread incoming contact messages.
* **Profile Media Editor:** Instantly replace your display photo and resume PDF with automated remote Cloudinary catalog synchronization.
* **Full CRUD Modules:** Create, update, and delete entries for all sections.
* **Cloud File Uploads:** Upload files directly to Cloudinary CDN from custom dashboards.

### ⚡ Performance & Caching
* **Stale-While-Revalidate Caching:** Frontend renders records instantly from `localStorage` on page load, making navigation immediate. It queries the backend API in parallel and updates the local storage cache if differences are found.
* **Code Splitting:** Lazy-loaded Admin routes reduce the initial landing page bundle size, saving bandwidth for mobile visitors.
* **Cloudinary Image Compression:** Appends formatting parameters (`q_auto,f_auto,w_800`) to image URLs dynamically, serving compressed WebP/AVIF images.

---

## 📂 Codebase Folder Architecture

```text
├── portfolio/                      # SPRING BOOT BACKEND
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rashmi/portfolio/
│   │   │   │   ├── config/         # Security configs, PasswordEncoder, CORS bean
│   │   │   │   ├── controller/     # REST Controllers
│   │   │   │   ├── dto/            # Data Transfer Objects with validation annotations
│   │   │   │   ├── entity/         # JPA entities
│   │   │   │   ├── exception/      # RestControllerAdvice and Global Exception Handlers
│   │   │   │   ├── repository/     # Spring Data JPA repositories
│   │   │   │   ├── security/       # JWT Auth Filters and Token Utilities
│   │   │   │   ├── service/        # Business Logic Services
│   │   │   │   └── util/           # HTML Sanitizer (XSS prevention)
│   │   │   └── resources/
│   │   │       ├── db/migration/   # Flyway V1 SQL schemas
│   │   │       └── application.properties
│   │   └── test/                   # MockMvc, JUnit, Mockito integrations
│   ├── Dockerfile
│   └── pom.xml
│
├── rashmi-portfolio-frontend/      # REACT FRONTEND
│   ├── src/
│   │   ├── api/                    # Axios config and API service routes
│   │   ├── components/             # Reusable UI widgets (Skeletons, Alert toasts, Form inputs)
│   │   ├── pages/
│   │   │   ├── admin/              # Dashboard pages & modules
│   │   │   └── public/             # Public landing pages & sections
│   │   ├── App.jsx                 # Routes configuration (lazy loaded)
│   │   └── index.css               # Global glassmorphism variables & custom animations
│   ├── Dockerfile
│   └── vercel.json
│
└── docker-compose.yml              # Local Multi-Container Orchestrator
```

---

## 🔑 Environment Variables Config

### Backend Setup (`portfolio/src/main/resources/application.properties`)
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://<host>/neondb?sslmode=require
spring.datasource.username=<username>
spring.datasource.password=<password>

# JWT Secrets
jwt.secret=<strong-signing-secret-key-hs256>
jwt.expiration=86400000

# Cloudinary CDN credentials
cloudinary.cloud-name=<cloud-name>
cloudinary.api-key=<api-key>
cloudinary.api-secret=<api-secret>

# Email Settings (Gmail SMTP App Password)
spring.mail.username=<your-email@gmail.com>
spring.mail.password=<your-gmail-16-digit-app-password>

# Allowed Origins (CORS)
ALLOWED_ORIGINS=http://localhost:5173,https://your-vercel-domain.vercel.app
```

---

## 🛠 Installation & Local Running

### Prerequisite Configuration
Ensure Java 17, Node.js (v18+), Maven, and Docker are installed.

### Option A: Local Running (Separate Processes)

#### 1. Setup Backend
```bash
cd portfolio
# Package and build backend jar
./mvnw clean package -DskipTests
# Run Spring Boot app
./mvnw spring-boot:run
```
The backend server starts on `http://localhost:8080`.

#### 2. Setup Frontend
```bash
cd rashmi-portfolio-frontend
# Install dependencies
npm install
# Run development server
npm run dev
```
The frontend starts on `http://localhost:5173`.

---

### Option B: Local Running (Docker Compose)
Run the entire stack in isolated Docker containers:
```bash
docker-compose up --build
```
This boots a MySQL database, backend container, and frontend container automatically configured to sync.

---

## 📡 API Routing Reference

### Public API routes (No Auth required)
* `POST /api/auth/login` - Validate credentials and return JWT bearer token.
* `GET /api/public/portfolio` - Fetch the consolidated portfolio profile data.
* `GET /api/projects` - Get paginated/searchable list of projects.
* `GET /api/certifications` - Get paginated certifications.
* `GET /api/achievements` - Get paginated achievements.
* `GET /api/internships` - Get internships.
* `GET /api/education` - Get education history.
* `GET /api/skills` - Get skills list.
* `GET /api/profile` - Get display avatar and PDF resume path.
* `POST /api/contact` - Submit contact message.

### Protected Admin Routes (JWT Bearer Token Required)
* `POST /api/projects` - Create a new project.
* `PUT /api/projects/{id}` - Update a project.
* `DELETE /api/projects/{id}` - Delete a project.
* `POST /api/projects/upload-image` - Stream a project cover image directly to Cloudinary.
* `POST /api/profile/update` - Update resume/photo config settings.
* `POST /api/profile/upload` - Stream resume/photo to Cloudinary.
* `GET /api/contact` - Get all contact messages.
* `DELETE /api/contact/{id}` - Delete contact message.
