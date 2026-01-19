
let currentUser = null;

/* ===============================
   PAGE LOAD
================================ */
document.addEventListener('DOMContentLoaded', async () => {

    // 🔹 SIGNUP FORM SUBMIT FIX (THIS WAS MISSING)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();      // stop page reload
            handleSignup();          // call signup logic
        });
    }

    // 🔹 LOGIN FORM SUBMIT (OPTIONAL BUT GOOD)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // 🔹 AUTO LOGIN IF TOKEN EXISTS
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

/* ===============================
   SCREEN TOGGLING
================================ */
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

/* ===============================
   AUTH ACTIONS
================================ */
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
        await api.auth.signup({
            full_name: name,
            email: email,
            password: password
        });

        alert('Account created successfully! Please login.');
        toggleAuth();
    } catch (err) {
        alert(err.message);
    }
}

function handleLogout() {
    api.removeToken();
    window.location.reload();
}

/* ===============================
   NAVIGATION
================================ */
function showPage(pageId, element) {
    // 🔹 Hide all pages
    document.querySelectorAll('.page-view')
        .forEach(p => p.classList.add('hidden'));

    // 🔹 Show selected page
    document.getElementById(`${pageId}-page`)
        .classList.remove('hidden');

    // 🔹 Remove active class from all sidebar items
    document.querySelectorAll('.nav-links li')
        .forEach(item => item.classList.remove('active'));

    // 🔹 Add active class to clicked item
    if (element) {
        element.classList.add('active');
    }

    // 🔹 Update page title
    const titles = {
        dashboard: 'Dashboard',
        wardrobe: 'My Wardrobe',
        'add-clothing': 'Add Clothing'
    };
    document.getElementById('page-title').innerText = titles[pageId];

    // 🔹 Load data
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'wardrobe') loadWardrobe();
}


/* ===============================
   DASHBOARD
================================ */
async function loadDashboard() {
    try {
        // 🌍 Get user's current location from browser
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // 🔹 Call backend with REAL coordinates
                const result = await api.recommendations.get(lat, lon);
                const { weather, outfit } = result;

                document.getElementById('current-temp').innerText = Math.round(weather.temp);
                document.getElementById('current-condition').innerText = weather.condition;
                document.getElementById('current-city').innerText = weather.city;

                const grid = document.getElementById('outfit-grid');
                grid.innerHTML = '';

                if (outfit.length === 0) {
                    grid.innerHTML = '<div>No matching clothes found.</div>';
                    return;
                }

                outfit.forEach(item => {
                    grid.appendChild(createClothingCard(item, false));
                });
            },
            (error) => {
                alert("Location access denied. Unable to fetch weather.");
                console.error(error);
            }
        );
    } catch (err) {
        console.error(err);
    }
}

/* ===============================
   WARDROBE
================================ */
async function loadWardrobe() {
    try {
        const clothes = await api.clothes.list();
        const grid = document.getElementById('wardrobe-items');
        grid.innerHTML = '';

        if (clothes.length === 0) {
            grid.innerHTML = '<div>Your wardrobe is empty.</div>';
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

/* ===============================
   UI CARD
================================ */
function createClothingCard(item, showDelete) {
    const div = document.createElement('div');
    div.className = 'clothing-card';

    div.innerHTML = `
        ${showDelete ? `<button onclick="deleteItem(${item.id})">❌</button>` : ''}
        <strong>${item.category}</strong>
        <p>${item.name}</p>
        <p>${item.min_temp}°C - ${item.max_temp}°C</p>
    `;

    return div;
}

