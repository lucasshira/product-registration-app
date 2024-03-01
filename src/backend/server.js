import express from 'express';

const app = express();

app.use(express.static(path.join(__dirname, '../App.tsx')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

const PORT = 5173;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});