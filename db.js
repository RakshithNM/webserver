let db;
let dbReq = indexedDB.open('express PWA', 1);

dbReq.onupgradeneeded = function(event) {
  db = event.target.result;
  let notes;
  if(!db.objectStoreNames.contains('notes')) {
    notes = db.createObjectStore('notes', {keyPath: 'timestamp', autoIcrement: true})
  } else {
    notes = dbReq.transaction.objectStore('notes');
  }

  if(!notes.indexNames.contains('timestamp')) {
    notes.createIndex('timestamp', 'timestamp');
  }
}

dbReq.onsuccess = function(event) {
  db = event.target.result;
  getAndDisplayNotes(db);
}

dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

function addMessage(db, message) {
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes')

  let note = {text: message, timestamp: Date.now()};
  store.add(note);
  tx.oncomplete = function() { console.log('message successfully stored')}
  tx.onerror = function(event) {
    alert("error storing message " + event.target.errorCode);
  }
}

function submitMessage() {
  let message = document.getElementById('newmessage');
  addMessage(db, message.value);
  message.value = '';
  getAndDisplayNotes(db);
}

function getAndDisplayNotes(inDb) {
  let tx = inDb.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');

  let index = store.index('timestamp');
  let req = index.openCursor();
  let allNotes = [];

  req.onsuccess = function(event) {
    let cursor = event.target.result;
    if(cursor != null) {
      allNotes.push(cursor.value);
      cursor.continue();
    } else {
      displayNotes(allNotes);
    }
  }
  req.onerror = function(event) {
    alert("error in cursor request " + event.target.errorCode);
  }
}

function displayNotes(notes) {
  let listHTML = '<ul>';

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    listHTML += '<li>' + note.text + ' ' +
      new Date(note.timestamp).toString() + '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}
