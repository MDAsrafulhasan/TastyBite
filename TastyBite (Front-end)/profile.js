const loadProfile = () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        showToast("Please log in to view your profile.", "warning");
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 1200);
        return;
    }

    fetch(`http://127.0.0.1:8000/customer/list/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                displayProfile(data[0]);
            } else {
                showToast("Failed to retrieve profile details.", "error");
            }
        })
        .catch(err => {
            console.error("Error loading profile:", err);
            showToast("Failed to connect to the server.", "error");
        });
};

const displayProfile = (customer) => {
    const parent = document.getElementById("profile-details");
    if (!parent) return;
    parent.innerHTML = ""; // Clear loader

    const div = document.createElement("div");
    div.classList.add("user-details");
    
    const avatarUrl = customer.image || "./Image/default-avatar.png";
    const fullName = (customer.first_name || customer.last_name) 
        ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
        : customer.username;

    div.innerHTML = `
        <img class="profile-pic" src="${avatarUrl}" alt="${customer.username}">
        <h1 style="font-weight: 800; font-family: 'Outfit', sans-serif;">${fullName}</h1>
        <span class="badge bg-secondary mb-3" style="font-size: 14px; padding: 6px 12px; border-radius: 20px;">@${customer.username}</span>
        
        <h4 style="font-size: 15px; color: var(--text-dark); margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa fa-envelope" style="color: var(--primary);"></i> ${customer.email || 'No email set'}
        </h4>
        <h4 style="font-size: 15px; color: var(--text-dark); margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa fa-map-marker" style="color: var(--primary); font-size: 18px;"></i> ${customer.address || 'No address set'}
        </h4>
        <h4 style="font-size: 15px; color: var(--text-dark); margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa fa-phone" style="color: var(--primary); font-size: 18px;"></i> ${customer.contact_number || 'No contact number set'}
        </h4>
        
        <hr style="border-top: 1px solid rgba(0,0,0,0.06); margin: 20px 0;">
        
        <button id="search-button" onclick="window.location.href='./edit_profile.html'" style="width: 80%; border-radius: 12px; margin: 0 auto; display: block; font-weight: 600;">Edit your profile</button>
    `;
    parent.appendChild(div);
};

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    if (sessionStorage.getItem("profileUpdateSuccess") === "true") {
        showToast("Profile updated successfully!", "success");
        sessionStorage.removeItem("profileUpdateSuccess");
    }
});