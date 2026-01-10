const moods = {
    'All': { bg: '#fdfcf9', accent: '#a3b18a', text: '#2d2a26' },
    'Anxious': { bg: '#f4f1de', accent: '#e07a5f', text: '#3d405b' },
    'Hopeful': { bg: '#f1faee', accent: '#457b9d', text: '#1d3557' },
    'Lonely': { bg: '#f8f9fa', accent: '#adb5bd', text: '#343a40' },
    'Happy': { bg: '#fffcf2', accent: '#eb5e28', text: '#252422' }
};

let posts = [
    { text: "Just realized I haven't taken a deep breath all day. Doing it now.", mood: "Hopeful", relates: 5 },
    { text: "The grocery store was so crowded. My heart wouldn't stop racing.", mood: "Anxious", relates: 12 },
    { text: "Is it possible to feel lonely even when surrounded by friends?", mood: "Lonely", relates: 42 },
    { text: "I finally finished the book I've been writing for 3 years!", mood: "Happy", relates: 8 }
];

// Mouse Tracking Aura
document.addEventListener('mousemove', (e) => {
    const aura = document.getElementById('aura');
    const x = (e.clientX / window.innerWidth) * 50;
    const y = (e.clientY / window.innerHeight) * 50;
    aura.style.transform = translate($ { x }
        px, $ { y }
        px);
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
    render(moodName);
}

// Render Posts
function render(filter = 'All') {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.mood === filter);

    filteredPosts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = $ { i * 0.1 }
        s;
        card.innerHTML = `
            <span class="card-mood">${post.mood}</span>
            <p class="card-text">"${post.text}"</p>
            <button class="relate-btn" onclick="relate(${posts.indexOf(post)})">Relate • ${post.relates}</button>
        `;
        feed.appendChild(card);
    });
}

// Modal Logic
function toggleModal(val) {
    document.getElementById('modal').style.display = val ? 'flex' : 'none';
}

// ✅ Publish New Post (Fixed)
function publish() {
    const text = document.getElementById('input').value.trim();
    const mood = document.getElementById('moodSelect').value;

    if (!text) {
        alert("Please write something before releasing it!");
        return;
    }

    // Add new post to the top
    posts.unshift({ text, mood, relates: 0 });

    // Clear input and close modal
    document.getElementById('input').value = '';
    toggleModal(false);

    // Always render the feed with current filter
    const activeFilter = document.querySelector('.filter-btn.active') ? .innerText || 'All';
    render(activeFilter);
}

// Relate Button
function relate(index) {
    posts[index].relates++;
    const activeFilter = document.querySelector('.filter-btn.active') ? .innerText || 'All';
    render(activeFilter);
}