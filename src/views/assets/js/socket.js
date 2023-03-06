const socket = io.connect("https://list.acorn.ink");

socket.on('userCount', userCount => {
let doc = document.getElementById('connectionCount');
  if(doc) {
    doc.innerHTML = userCount;
  }
})
