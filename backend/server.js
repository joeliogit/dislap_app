const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

require('./config/db');

const authRoutes    = require('./routes/auth.routes');
const paymentsRoutes = require('./routes/payments.routes');
const gameRoutes    = require('./routes/game.routes');
const doctorRoutes  = require('./routes/doctor.routes');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/games',    gameRoutes);
app.use('/api/doctor',   doctorRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Disslapp API is running' });
});

// Contact form (stores in DB or just acknowledges)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  // Log the message server-side; extend with email/DB storage as needed
  console.log(`📧 Contacto de ${name} <${email}>: ${message}`);
  res.json({ ok: true, message: 'Mensaje recibido' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
