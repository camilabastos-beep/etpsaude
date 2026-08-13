require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const evaluationRoutes = require('./routes/evaluations');
const alertRoutes = require('./routes/alerts');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/public', express.static('public'));

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error', err));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});