const LoadOrderHistory = () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    // console.log(user_id);
    fetch(`http://127.0.0.1:8000/carts/cart/?user_id=${user_id}`, {
        headers: headers
    })
        .then(res => res.json())
        .then(data => displayOrderHistory(data))
        .catch(error => {
            console.error("Error loading order history:", error);
            const parent = document.getElementById("order-history-tbody");
            if (parent) {
                parent.innerHTML = `<tr><td colspan="6" style="text-align: center; font-weight: bold; color: var(--danger);">Failed to load order history from server.</td></tr>`;
            }
        });
}

const displayOrderHistory = (carts) => {
    console.log(carts);
    const parent = document.getElementById("order-history-tbody");
    if (!parent) return;
    
    parent.innerHTML = ""; // Clear loader/previous records

    // Filter carts that are marked ordered = true
    const orderedCarts = carts.filter(cart => cart?.ordered === true);

    if (orderedCarts.length >= 1) {
        orderedCarts.forEach((cartitems) => {
            cartitems?.items.forEach((item) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><a href="Food_details.html?fooditemId=${item?.fooditem.id}" style="color: var(--primary); text-decoration: none; font-weight: 600;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${item?.fooditem.name}</a></td>
                    <td>${item?.fooditem.price}</td>
                    <td>${item?.fooditem.discount}%</td>
                    <td>${item?.fooditem.discounted_price}</td>
                    <td>${item?.quantity}</td>
                    <td>${item?.price}</td>
                `;
                parent.appendChild(tr);
            });

            const statusClassMap = {
                "Pending": "color: #ffb703;",
                "Processing": "color: #007bff;",
                "Completed": "color: var(--success);",
                "Cancelled": "color: var(--danger);"
            };
            const currentStatus = cartitems?.order_status || "Pending";
            const currentStyle = statusClassMap[currentStatus] || "color: #ffb703;";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td colspan="5" style="font-weight: bold;">Complete Order</td>
                <td style="font-weight: bold; ${currentStyle}">${currentStatus.toUpperCase()}</td>
            `;
            parent.appendChild(tr);
        });
    }
    else {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="6" style="text-align: center; font-weight: bold;">No Order History Found</td>`;
        parent.appendChild(tr);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LoadOrderHistory();
});
