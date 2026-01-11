const firebaseConfig = {
  apiKey: "AIzaSyATZNn9wyN5iVRPj6r1nCVWmLo0RnpmsbI",
  authDomain: "empathy-map-53774.firebaseapp.com",
  databaseURL: "https://empathy-map-53774-default-rtdb.firebaseio.com/",
  projectId: "empathy-map-53774",
  storageBucket: "empathy-map-53774.firebasestorage.app",
  messagingSenderId: "676023175776",
  appId: "1:676023175776:web:58aab7b5bca093bf2e1105"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function toggleModal(show) {
    document.getElementById('modal').style.display = show ? 'flex' : 'none';
}

// Fixed publish: Saves to cloud and handles the quote
function publish() {
    const text = document.getElementById('input').value;
    const mood = document.getElementById('moodSelect').value;
    
    if (!text.trim()) return;

    database.ref('thoughts').push({
        text: text,
        mood: mood,
        relates: 0,
        timestamp: Date.now()
    });

    document.getElementById('input').value = "";
    toggleModal(false);
}

// Fixed filterMood: Keeps your original function name
function filterMood(mood, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadThoughts(mood);
}

// This function pulls the messages so they stay on refresh
function loadThoughts(filter = 'All') {
    database.ref('thoughts').on('value', (snapshot) => {
        const data = snapshot.val();
        const feed = document.getElementById('feed');
        const quote = document.getElementById('welcome-quote');
        
        feed.innerHTML = '';
        if (!data) return;

        // Hide quote if there are posts
        if (quote) quote.style.display = 'none';

        const postsArray = Object.keys(data).map(key => ({
            id: key, ...data[key]
        })).reverse();

        const filtered = filter === 'All' ? postsArray : postsArray.filter(p => p.mood === filter);

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="font-size: 0.7rem; font-weight: bold; color: var(--accent); margin-bottom: 10px;">${post.mood.toUpperCase()}</div>
                <div class="card-text">${post.text}</div>
                <button class="relate-btn" onclick="relate('${post.id}', ${post.relates})">Relate • ${post.relates}</button>
            `;
            feed.appendChild(card);
        });
    });
}

function relate(id, count) {
    database.ref('thoughts/' + id).update({ relates: count + 1 });
}

// Load thoughts immediately
loadThoughts();
