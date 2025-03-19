# Healthcare Appointment Management System AKA MED - NEXUS

A modern web application for managing doctor-patient appointments, prescriptions, and video consultations.

## Features

- **Appointment Management**: Schedule, view, and manage patient appointments
- **Real-time Video Consultations**: Integrated video call functionality for remote consultations
- **Prescription Management**: Create and manage patient prescriptions
- **Appointment Status Tracking**: Track appointment status (Scheduled, In Progress, Completed)
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js with React Router
- **UI Framework**: Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Video Call**: WebRTC

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/healthcare-app.git
   cd healthcare-app
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/healthcare
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server in a new terminal
   cd client
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Doctor Dashboard

1. **View Appointments**: See all scheduled appointments for the day
2. **Video Consultation**: Start a video call with patients during their appointment time
3. **Add Prescriptions**: Create and add prescriptions for patients
4. **Mark Appointments**: Update appointment status to "Completed" after consultation

### Patient Dashboard

1. **Book Appointments**: Schedule new appointments with available doctors
2. **View Appointments**: See all upcoming and past appointments
3. **Join Video Call**: Join video consultations with doctors
4. **View Prescriptions**: Access prescriptions created by doctors

## Video Call Feature

The video call feature allows doctors and patients to have real-time consultations. Here's how it works:

1. When an appointment is active (within the scheduled time), a "Start Video Call" button appears
2. The doctor initiates the call by clicking the button
3. The patient receives a notification and can join the call
4. The video call opens in a dedicated interface with video and audio controls
5. Both parties can end the call at any time

## API Endpoints

### Authentication
- `POST /login`: Authenticate user and get JWT token
- `POST /register`: Register a new user (doctor or patient)

### Appointments
- `GET /getAppointments`: Get all appointments for the logged-in user
- `POST /createAppointment`: Create a new appointment
- `PUT /markAsCompleted/:id`: Mark an appointment as completed

### Prescriptions
- `POST /addPrescription`: Create a new prescription
- `GET /getPrescriptions/:patientId`: Get all prescriptions for a patient

### Video Call
- `POST /initiateVideoCall`: Initialize a video call session
- `GET /videoCall/:roomId`: Get video call details for a specific room

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- WebRTC for the video call functionality
- Tailwind CSS for the UI components
- MongoDB for the database solution
