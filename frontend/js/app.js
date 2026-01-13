let currentUser = null;

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    if (api.getToken()) {
        try {
            currentUser = await api.auth.me();
            showMainScreen();
        } catch (err) {
            api.removeToken();
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
});

function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('main-screen').classList.add('hidden');
}

function showMainScreen() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('user-name').innerText = currentUser.full_name;
    showPage('dashboard');
}

function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('signup-form').classList.toggle('hidden');
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.remove('hidden');

    // Update sidebar active state
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('onclick').includes(pageId)) {
            li.classList.add('active');
        }
    });

    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'wardrobe': 'My Wardrobe',
        'add-clothing': 'Add Clothing'
    };
    document.getElementById('page-title').innerText = titles[pageId];

    // Page-specific loads
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'wardrobe') loadWardrobe();
}

// Auth Actions
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        await api.auth.login(email, password);
        currentUser = await api.auth.me();
        showMainScreen();
    } catch (err) {
        alert(err.message);
    }
}

async function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
        await api.auth.signup({ full_name: name, email, password });
        alert('Account created! Please login.');
        toggleAuth();
    } catch (err) {
        alert(err.message);
    }
}

function handleLogout() {
    api.removeToken();
    window.location.reload();
}

// Dashboard Logic
async function loadDashboard() {
    try {
        // Get user location or default
        const result = await api.recommendations.get(40.7128, -74.0060);
        const { weather, outfit } = result;

        document.getElementById('current-temp').innerText = Math.round(weather.temp);
        document.getElementById('current-condition').innerText = weather.condition;
        document.getElementById('current-city').innerText = weather.city;

        const grid = document.getElementById('outfit-grid');
        grid.innerHTML = '';

        if (outfit.length === 0) {
            grid.innerHTML = '<div class="empty-state">No matching clothes found for today\'s weather. Add more clothes to your wardrobe!</div>';
            return;
        }

        outfit.forEach(item => {
            grid.appendChild(createClothingCard(item, false));
        });
    } catch (err) {
        console.error(err);
    }
}

// Wardrobe Logic
async function loadWardrobe() {
    try {
        const clothes = await api.clothes.list();
        const grid = document.getElementById('wardrobe-items');
        grid.innerHTML = '';

        if (clothes.length === 0) {
            grid.innerHTML = '<div class="empty-state">Your wardrobe is empty.</div>';
            return;
        }

        clothes.forEach(item => {
            grid.appendChild(createClothingCard(item, true));
        });
    } catch (err) {
        console.error(err);
    }
}

async function saveClothing() {
    const data = {
        name: document.getElementById('cloth-name').value,
        category: document.getElementById('cloth-category').value,
        thickness: document.getElementById('cloth-thickness').value,
        min_temp: parseFloat(document.getElementById('cloth-min-temp').value),
        max_temp: parseFloat(document.getElementById('cloth-max-temp').value)
    };

    try {
        await api.clothes.create(data);
        showPage('wardrobe');
        // Reset form
        document.getElementById('cloth-name').value = '';
    } catch (err) {
        alert(err.message);
    }
}

async function deleteItem(id) {
    if (confirm('Delete this item?')) {
        await api.clothes.delete(id);
        loadWardrobe();
    }
}

function createClothingCard(item, showDelete) {
    const div = document.createElement('div');
    div.className = 'clothing-card';

    const icon = {
        'Upper': 'shirt',
        'Lower': 'utility-pole', // Approximation for pants in lucide
        'Outerwear': 'cloud-fog',
        'Footwear': 'footprints'
    }[item.category] || 'box';

    div.innerHTML = `
        ${showDelete ? `<button class="btn-delete" onclick="deleteItem(${item.id})"><i data-lucide="trash-2"></i></button>` : ''}
        <i data-lucide="${icon}"></i>
        <span class="cloth-cat">${item.category}</span>
        <span class="cloth-name">${item.name}</span>
        <span class="cloth-temp">${item.min_temp}°C - ${item.max_temp}°C</span>
    `;

    // Process icons
    setTimeout(() => lucide.createIcons({ attrs: { 'data-lucide': true }, nameAttr: 'data-lucide' }), 0);
    return div;
}
