const socket = io('http://localhost:8000');

// Get Dom elements in a respective js variable
const form = document.getElementById('send-container');
const messageInp = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// function which will append event info to the container
const append = (message, position, id = null) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', position);

  if (id) {
    messageElement.setAttribute('data-id', id);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => {
      socket.emit('delete-message', id);
    };

    messageElement.appendChild(deleteBtn);
  }

  messageContainer.append(messageElement);
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInp.value = '';
});

// ask new user for his/her name - with validation
let name;
do {
    name = prompt("Enter your name to join");
} while (name === null || name.trim() === "");

name = name.trim(); // Safe to trim now
socket.emit('new-user-joined', name);


socket.emit('new-user-joined', name.trim());

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left', data.id);
});
socket.on('message-deleted', ({ id }) => {
  const msgElements = document.querySelectorAll(`[data-id="${id}"]`);
  msgElements.forEach(el => el.remove());
});


socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});