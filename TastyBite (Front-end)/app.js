// Centralized Authentication & Access Control Routing Guards
const token = localStorage.getItem("token");
const pathname = window.location.pathname;
const currentPage = pathname.split("/").pop() || "index.html";

const publicOnlyPages = ["login.html", "Sign_up.html", "index.html"];
const protectedPages = ["food.html", "Food_details.html", "place_order.html", "profile.html", "order_history.html"];

if (token) {
    // Authenticated users cannot access login, signup, or index landing pages
    if (publicOnlyPages.includes(currentPage)) {
        window.location.href = "./food.html";
    }
} else {
    // Unauthenticated users cannot access protected dashboard pages
    if (protectedPages.includes(currentPage)) {
        window.location.href = "./login.html";
    }
}

const updateNavCartCount = () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (user_id && token) {
        fetch(`http://127.0.0.1:8000/carts/cart/?user_id=${user_id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(carts => {
                const activeCart = (carts || []).find(cart => !cart?.ordered);
                const count = activeCart && activeCart.items ? activeCart.items.length : 0;
                const cartBadge = document.getElementById("nav-cart-count");
                if (cartBadge) {
                    cartBadge.innerText = count;
                    cartBadge.style.display = count > 0 ? "inline-flex" : "none";
                }
            })
            .catch(err => console.error("Error updating nav cart count:", err));
    }
};

window.updateNavCartCount = updateNavCartCount;

const updateNavNotifications = () => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const count = notifications.length;

    // Update badge count
    const badge = document.getElementById("nav-notification-count");
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? "inline-flex" : "none";
    }

    // Populate dropdown items
    const container = document.getElementById("notification-items-container");
    if (container) {
        container.innerHTML = ""; // Clear existing items

        if (count > 0) {
            notifications.forEach(item => {
                const div = document.createElement("div");
                div.className = "notification-item";
                div.innerHTML = `
                    <span class="notification-text">${item.message}</span>
                    <span class="notification-time"><i class="fa fa-clock-o"></i> ${item.time}</span>
                `;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = `
                <div class="notification-empty">
                    <i class="fa fa-bell-slash-o"></i>
                    <span>No new notifications</span>
                </div>
            `;
        }
    }
};

const addNotification = (message) => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
        id: Date.now(),
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    updateNavNotifications();
};

const clearAllNotifications = (event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    localStorage.setItem("notifications", "[]");
    updateNavNotifications();
};

window.updateNavNotifications = updateNavNotifications;
window.addNotification = addNotification;
window.clearAllNotifications = clearAllNotifications;

document.addEventListener("DOMContentLoaded", () => {
    if (token) {
        // Update the logo link to point to food.html instead of index.html
        const logoLink = document.getElementById("logo-link");
        if (logoLink) {
            logoLink.href = "./food.html";
        }
        // Initialize dynamic navigation cart count
        updateNavCartCount();
        // Initialize dynamic navigation notifications count
        updateNavNotifications();

        // Dynamically bind Clear All button listeners to ensure 100% execution reliability
        const clearBtns = document.querySelectorAll(".clear-all-btn");
        clearBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                localStorage.setItem("notifications", "[]");
                updateNavNotifications();
            });
        });
    }
});

// Global Premium Custom Toast Notification System
window.showToast = (message, type = "success") => {
    // Get or create toast container
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    // Create toast item
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type} fade-in`;

    // Set custom icon based on toast type
    let icon = "✔️";
    if (type === "error") {
        icon = "❌";
    } else if (type === "warning") {
        icon = "⚠️";
    } else if (type === "info") {
        icon = "ℹ️";
    }

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove toast after 3 seconds with smooth transition
    setTimeout(() => {
        toast.classList.replace("fade-in", "fade-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 3000);
};
