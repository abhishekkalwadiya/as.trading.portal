
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic Auth Middleware for admin protection
app.use((req, res, next) => {
  if (req.path === '/admin.html') {
    const auth = req.headers.authorization;
    const expected = 'Basic ' + Buffer.from(':' + 'abhishek@1').toString('base64');
    if (!auth || auth !== expected) {
      res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
      return res.status(401).send('Authentication required.');
    }
  }
  next();
});

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', (req, res) => {
  const data = req.body;
  const file = './data/users.json';
  const users = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  users.push(data);
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.get('/admin/users', (req, res) => {
  const data = fs.existsSync('./data/users.json') ? fs.readFileSync('./data/users.json') : '[]';
  res.send(data);
});

app.post('/admin/mark-paid', (req, res) => {
  const { index } = req.body;
  const file = './data/users.json';
  const users = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  if (users[index]) users[index].status = "Paid";
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
