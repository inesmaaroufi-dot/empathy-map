// 1. Firebase Configuration (Connecting to your cloud)
const firebaseConfig = {
  apiKey: "AIzaSyATZNn9wyN5iVRPj6r1nCVWmLo0RnpmsbI",
  authDomain: "empathy-map-53774.firebaseapp.com",
  databaseURL: "https://empathy-map-53774-default-rtdb.firebaseio.com/",
  projectId: "empathy-map-53774",
  storageBucket: "empathy-map-53774.firebasestorage.app",
  messagingSenderId: "676023175776",
  appId: "1:676023175776:web:58aab7b5bca093bf2e1105"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const moods = {
    'All': { bg: '#fdfcf9', accent: '#a3b18a', text: '#2d2a26' },
    'Anxious': { bg: '#f4f1de', accent: '#e07a5f', text: '#3d405b' },
    'Hopeful': { bg: '#f1faee', accent: '#457b9d', text: '#1d3557' },
    'Lonely': { bg: '#f8f9fa', accent: '#adb5bd', text: '#343a40' },
    'Happy': { bg: '#fffcf2', accent: '#eb5e28', text: '#252422' }
};

// Mouse Tracking Aura
document.addEventListener('mousemove', (e) => {
    const aura = document.getElementById('aura');
    const x = (e.clientX / window.innerWidth) * 50;
    const y = (e.clientY / window.innerHeight) * 50;
    if(aura) aura.style.transform = `translate(${x}px, ${y}px)`;
});

// Theme Engine
function changeTheme(moodName, btn) {
    const theme = moods[moodName];
    const root = document.documentElement;
    root.style.setProperty('--bg-base', theme.bg);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--accent-soft', theme.accent + '22');

    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    fetchAndRender(moodName);
}

// Modal Logic
function toggleModal(val) {
    document.getElementById('modal').style.display = val ? 'flex' : 'none';
}

// ✅ NEW: Save to Firebase (This makes it permanent!)
function publish() {
    const text = document.getElementById('input').value.trim();
    const mood = document.getElementById('moodSelect').value;

    if (!text) {
        alert("Please write something before releasing it!");
        return;
    }

    // This sends the thought to the cloud
    const newThoughtRef = database.ref('thoughts').push();
    newThoughtRef.set({
        text: text,
        mood: mood,
        relates: 0,
        timestamp: Date.now()
    });

    document.getElementById('input').value = '';
    toggleModal(false);
}

// ✅ NEW: Read from Firebase (This shows everyone's posts)
function fetchAndRender(filter = 'All') {
    database.ref('thoughts').on('value', (snapshot) => {
        const data = snapshot.val();
        const feed = document.getElementById('feed');
        feed.innerHTML = '';

        if (!data) return;

        // Convert object to array and reverse to see newest first
        const postsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })).reverse();

        const filteredPosts = filter === 'All' ? postsArray : postsArray.filter(p => p.mood === filter);

        filteredPosts.forEach((post, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <span class="card-mood">${post.mood}</span>
                <p class="card-text">"${post.text}"</p>
                <button class="relate-btn" onclick="relate('${post.id}', ${post.relates})">Relate • ${post.relates}</button>
            `;
            feed.appendChild(card);
        });
    });
}

// Relate Button (Now updates in the cloud)
function relate(postId, currentRelates) {
    database.ref('thoughts/' + postId).update({
        relates: currentRelates + 1
    });
}

// Start the app
fetchAndRender();
