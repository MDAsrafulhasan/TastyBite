const loadProfileToEdit = () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        showToast("Please log in to edit your profile.", "warning");
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 1200);
        return;
    }

    fetch(`http://127.0.0.1:8000/customer/list/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                window.customerProfile = data[0];
                populateEditForm(data[0]);
            } else {
                showToast("Failed to retrieve profile details.", "error");
            }
        })
        .catch(err => {
            console.error("Error loading profile:", err);
            showToast("Failed to connect to the server.", "error");
        });
};

const populateEditForm = (customer) => {
    document.getElementById("first_name").value = customer.first_name || "";
    document.getElementById("last_name").value = customer.last_name || "";
    document.getElementById("email").value = customer.email || "";
    document.getElementById("contact_number").value = customer.contact_number || "";
    document.getElementById("address").value = customer.address || "";
    document.getElementById("image_url").value = customer.image || "";
};

const handleEditProfile = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        showToast("Please log in to save changes.", "warning");
        return;
    }

    if (!window.customerProfile || !window.customerProfile.id) {
        showToast("Profile identifier missing.", "error");
        return;
    }

    const payload = {
        first_name: document.getElementById("first_name").value.trim(),
        last_name: document.getElementById("last_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        contact_number: document.getElementById("contact_number").value.trim(),
        address: document.getElementById("address").value.trim(),
        image: document.getElementById("image_url").value.trim(),
    };

    fetch(`http://127.0.0.1:8000/customer/list/${window.customerProfile.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                const errorMsg = data.error || data.detail || "Failed to update profile details.";
                throw new Error(errorMsg);
            }
            return data;
        })
        .then(data => {
            sessionStorage.setItem("profileUpdateSuccess", "true");
            window.location.href = "./profile.html";
        })
        .catch(error => {
            showToast(error.message || "Failed to update profile details.", "warning");
            console.error("Error updating profile:", error);
        });
};

document.addEventListener("DOMContentLoaded", () => {
    loadProfileToEdit();
});
