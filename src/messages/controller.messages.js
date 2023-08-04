const express = require('express');
const router = express.Router();
const MessagesDao = require('../dao/messages.dao');

const messages = new MessagesDao();

router.get('/', async (req, res) => {
  const message = await messages.getMessages();
  res.render('chat', { message });
});

router.post('/', async  (req, res) =>{
  const user = req.user.email;
  const message = req.body.message;
  await messages.addMessage(user, message);
  res.redirect('/');
});

module.exports = router;