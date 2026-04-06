# Apply Tracker 🚀

Apply Tracker is a powerful backend application designed to help job seekers manage their applications efficiently while leveraging AI to stand out. It goes beyond simple tracking by providing tools to automatically tailor your CV and generate personalized cover letters for every job description.

## ✨ Key Features

- **Application Management**: Track your job applications, companies, and status in one place.
- **AI-Powered Tailoring**: Integration with OpenAI (GPT-4o) to adapt your base CV to specific job descriptions.
- **Custom Cover Letters**: Generate professional, targeted cover letters based on your experience and the job requirements.
- **Secure File Storage**: CVs and cover letters are stored securely in AWS S3 with pre-signed URLs for access.
- **User Authentication**: Secure registration, login, and email verification system.
- **Database Persistence**: Robust data management using PostgreSQL and Prisma ORM.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Fastify (High performance, low overhead)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI Integration**: OpenAI SDK (GPT-4o)
- **Cloud Storage**: AWS S3 (SDK v3)
- **Authentication**: JWT & Bcrypt
- **Email**: Nodemailer

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL instance
- AWS S3 Bucket
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ibraSanusi/apply-tracker.git
   cd apply-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   SMTP_USER=your_email
   SMTP_PASS=your_email_password
   AWS_S3_ACCESS_kEY=your_aws_key
   AWS_SECRET_S3_kEY=your_aws_secret
   AWS_S3_BUCKET=your_bucket_name
   OPENAI_API_KEY=your_openai_key
   ```

4. **Initialize the database:**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

The project includes a comprehensive test suite using the native Node.js test runner.

```bash
npm test
```

## 📝 License

This project is licensed under the MIT License.
