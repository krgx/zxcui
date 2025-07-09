const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Мок-эндпоинт для логина
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.jsonp({ token: 'test-token', user: { id: user.id, username: user.username } });
  } else {
    res.status(401).jsonp({ error: 'Неверный логин или пароль' });
  }
});

server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running');
});