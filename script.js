// 1. Firebase Configuration
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

// Theme Engine & Filter
function changeTheme(moodName, btn) {
    const theme = moods[moodName];
    const root = document.documentElement;
    root.style.setProperty('--bg-base', theme.bg);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text', theme.text);

    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    fetchAndRender(moodName);
}

// Modal Toggle
function toggleModal(val) {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = val ? 'flex' : 'none';
}

// ✅ Save Thought to Firebase (Permanent)
function publish() {
    const textInput = document.getElementById('input');
    const moodSelect = document.getElementById('moodSelect');
    const text = textInput.value.trim();
    const mood = moodSelect.value;

    if (!text) return;

    database.ref('thoughts').push({
        text: text,
        mood: mood,
        relates: 0,
        timestamp: Date.now()
    });

    textInput.value = '';
    toggleModal(false);
}

// ✅ Pull Thoughts from Firebase (Visible to all)
function fetchAndRender(filter = 'All') {
    database.ref('thoughts').on('value', (snapshot) => {
        const data = snapshot.val();
        const feed = document.getElementById('feed');
        if (!feed) return;
        feed.innerHTML = '';
        if (!data) return;

        const postsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })).reverse();

        const filteredPosts = filter === 'All' ? postsArray : postsArray.filter(p => p.mood === filter);

        filteredPosts.forEach((post) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="font-size: 0.7rem; font-weight: bold; color: var(--accent);">${post.mood.toUpperCase()}</div>
                <p class="card-text">"${post.text}"</p>
                <button class="relate-btn" onclick="relate('${post.id}', ${post.relates})">Relate • ${post.relates}</button>
            `;
            feed.appendChild(card);
        });
    });
}

// Relate Logic
function relate(postId, count) {
    database.ref('thoughts/' + postId).update({ relates: count + 1 });
}

// Initial Load
fetchAndRender();
