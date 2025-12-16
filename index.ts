import express from 'express';
import examRoutes from './src/routes/examRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import resultRoutes from './src/routes/resultRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('I Love Faisa Nirbita Mahmudah');
});
app.use('/exams', examRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

export default app;
