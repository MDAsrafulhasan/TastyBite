const LoadPlaceOrder = () =>{
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    // console.log(user_id);
    // fetch(`https://tastybite.onrender.com/carts/cart/?user_id=${user_id}`)
    fetch(`http://127.0.0.1:8000/carts/cart/?user_id=${user_id}`, {
        headers: headers
    })
     .then(res => res.json())
     .then(data => displaycarts(data));
}

const displaycarts=(carts) => {
    console.log(carts);
    const safeCarts = carts || [];
    let hasOrder = false;
    const parent = document.getElementById("tbody");
    parent.innerHTML = ""; // Clear existing rows
    
    let totalCartPrice = 0;
    
    // Find an active (unordered) cart
    const activeCart = safeCarts.find(cart => !cart?.ordered);
    
    if (activeCart && activeCart.items && activeCart.items.length > 0) {
        hasOrder = true;
        activeCart.items.forEach((item) => {
            const itemPrice = parseFloat(item?.price) || 0;
            totalCartPrice += itemPrice;
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${item?.fooditem.name}</td>
            <td>$${parseFloat(item?.fooditem.price).toFixed(2)}</td>
            <td>${item?.fooditem.discount}%</td>
            <td>$${parseFloat(item?.fooditem.discounted_price).toFixed(2)}</td>
            <td>
                <div class="quantity-control d-flex align-items-center justify-content-center gap-2">
                    <button class="quantity-btn dec-btn" onclick="updateQuantity(${item?.id}, ${item?.quantity - 1}, ${item?.fooditem.discounted_price})">-</button>
                    <span class="quantity-value" id="quantity-${item?.id}">${item?.quantity}</span>
                    <button class="quantity-btn inc-btn" onclick="updateQuantity(${item?.id}, ${item?.quantity + 1}, ${item?.fooditem.discounted_price})">+</button>
                </div>
            </td>
            <td>$<span id="item-price-${item?.id}">${itemPrice.toFixed(2)}</span></td>
            <td><button class="remove-btn" onclick="removeCartItem(${item?.id})">Remove</button></td>
            `;

            parent.appendChild(tr);
        });
        
        // Append Total Price row showing the calculated sum
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td colspan="5" style="font-weight: bold;">Total Price</td>
        <td style="font-weight: bold;">$<span id="cart-total-price">${totalCartPrice.toFixed(2)}</span></td>
        <td></td>`;
        parent.appendChild(tr);
    } else {
        // If there's no active cart or it has no items, show Please Do Some Order and Total Price: $0.00
        const placeholderTr = document.createElement("tr");
        placeholderTr.innerHTML = `
        <td colspan="7" style="text-align: center; font-weight: bold;">Please Do Some Order</td>`;
        parent.appendChild(placeholderTr);
        
        const totalTr = document.createElement("tr");
        totalTr.innerHTML = `
        <td colspan="5" style="font-weight: bold;">Total Price</td>
        <td style="font-weight: bold;">$<span id="cart-total-price">0.00</span></td>
        <td></td>`;
        parent.appendChild(totalTr);
    }
    
    const submitBtn = document.querySelector(".price-button");
    if (submitBtn) {
        if (!hasOrder) {
            submitBtn.style.display = "none";
        } else {
            submitBtn.style.display = "block";
            submitBtn.setAttribute("onclick", `submitOrder(${activeCart.id})`);
        }
    }
};

const updateQuantity = (itemId, newQuantity, discountedPrice) => {
    if (newQuantity < 1) return;

    const quantitySpan = document.getElementById(`quantity-${itemId}`);
    const itemPriceSpan = document.getElementById(`item-price-${itemId}`);
    
    if (quantitySpan && itemPriceSpan) {
        // 1. Snappy UI feedback: update quantity and item total immediately
        const newPrice = newQuantity * discountedPrice;
        
        quantitySpan.innerText = newQuantity;
        itemPriceSpan.innerText = newPrice.toFixed(2);
        
        // Update the minus button actions dynamically
        const decBtn = quantitySpan.previousElementSibling;
        const incBtn = quantitySpan.nextElementSibling;
        
        if (decBtn) {
            decBtn.setAttribute('onclick', `updateQuantity(${itemId}, ${newQuantity - 1}, ${discountedPrice})`);
        }
        if (incBtn) {
            incBtn.setAttribute('onclick', `updateQuantity(${itemId}, ${newQuantity + 1}, ${discountedPrice})`);
        }
        
        // Recalculate full cart total
        recalculateCartTotal();

        // 2. Perform background PATCH request to persist in database
        const token = localStorage.getItem('token');
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        // fetch(`https://tastybite.onrender.com/carts/cartitems/${itemId}/`, {
        fetch(`http://127.0.0.1:8000/carts/cartitems/${itemId}/`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({ quantity: newQuantity }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to update quantity");
            }
            return res.json();
        })
        .then(data => {
            console.log("Quantity synchronized in backend", data);
            // Ensure exact alignment with backend calculation if returned
            if (data && data.price) {
                itemPriceSpan.innerText = parseFloat(data.price).toFixed(2);
                recalculateCartTotal();
            }
        })
        .catch(error => {
            console.error("Error updating cart quantity:", error);
            // Revert state on network/server error to ensure consistency
            showToast("Failed to update quantity on server. Reverting...", "error");
            location.reload();
        });
    }
};

const recalculateCartTotal = () => {
    const priceSpans = document.querySelectorAll('[id^="item-price-"]');
    let total = 0;
    priceSpans.forEach(span => {
        total += parseFloat(span.innerText) || 0;
    });
    
    const cartTotalPriceSpan = document.getElementById("cart-total-price");
    if (cartTotalPriceSpan) {
        cartTotalPriceSpan.innerText = total.toFixed(2);
    }
};

const removeCartItem = (foodId) => {
    console.log(foodId);

    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    // fetch(`https://tastybite.onrender.com/carts/cartitems/${foodId}/`,{
    fetch(`http://127.0.0.1:8000/carts/cartitems/${foodId}/`,{
        method: "DELETE",
        headers: headers,
    })
    .then(response => {
        if (response.status === 204) {
            console.log("Item removed successfully");
            // window.location.href = "/place_order.html";
            window.location.href = "http://127.0.0.1:5500/TastyBite%20(Front-end)/place_order.html";
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.error) {
            console.error("Error:", data.error);
        }
    })
    .catch(error => {
        console.error("Network error:", error);
    });
};

const submitOrder = (cartId) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    fetch(`http://127.0.0.1:8000/carts/cart/${cartId}/`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ ordered: true }),
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to submit order");
        }
        return res.json();
    })
    .then(data => {
        console.log("Order submitted successfully:", data);
        showToast("Order placed successfully!", "success");
        if (window.addNotification) {
            window.addNotification(`Your order (ID: #${cartId}) was submitted successfully!`);
        }
        if (window.updateNavCartCount) {
            window.updateNavCartCount();
        }
        setTimeout(() => {
            window.location.href = "http://127.0.0.1:5500/TastyBite%20(Front-end)/order_history.html";
        }, 1200);
    })
    .catch(error => {
        console.error("Error submitting order:", error);
        showToast("Failed to place order. Please try again.", "error");
    });
};

LoadPlaceOrder();