const express = require('express');
const { body, validationResult } = require('express-validator');
const yup = require('yup');
const {connectDB} = require('./config/db');
const app = express();
const port = 4000;
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a Yup schema for validation
const userSchema = yup.object().shape({
  username: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

app.get('/', (req, res) => {
  res.send('Hello from Express.js backend!');
});

app.get('/api', (req, res) => {
  res.send('Hello from Express.js backend!');
});

app.post('/register',
  // Express-validator middleware
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  async (req, res) => {
    // Check express-validator results          
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Validate with Yup
    try {
            await userSchema.validate(req.body, { abortEarly: false });
    }
    catch (yupError) {
        return res.status(400).json({ errors: yupError.errors });
    }
    
    res.status(200).json({ message: 'User registered successfully!' });
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});