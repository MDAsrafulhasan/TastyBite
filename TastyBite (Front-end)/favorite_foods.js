var getStarRatingHTML = (avgRating) => {
    let starsHTML = "";
    const rating = parseFloat(avgRating) || 0;
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            starsHTML += '<i class="fa fa-star" style="color: #ffb703; margin-right: 2px;"></i>';
        } else if (rating >= i - 0.5) {
            starsHTML += '<i class="fa fa-star-half-o" style="color: #ffb703; margin-right: 2px;"></i>';
        } else {
            starsHTML += '<i class="fa fa-star-o" style="color: #ccc; margin-right: 2px;"></i>';
        }
    }
    return starsHTML;
};

const loadFavorites = () => {
    const user_id = localStorage.getItem("user_id");
    const parent = document.getElementById("AllFavoriteFood");
    const nodata = document.getElementById("nodata");

    if (!user_id) {
        if (parent) parent.innerHTML = "";
        if (nodata) {
            nodata.style.display = "flex";
            nodata.style.justifyContent = "center";
        }
        return;
    }

    if (parent) parent.innerHTML = "";

    fetch(`http://127.0.0.1:8000/fooditem/favorites/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                if (nodata) nodata.style.display = "none";
                displayFavorites(data);
            } else {
                if (parent) parent.innerHTML = "";
                if (nodata) {
                    nodata.style.display = "flex";
                    nodata.style.justifyContent = "center";
                }
            }
        })
        .catch(err => {
            console.error("Error fetching favorites:", err);
            if (nodata) {
                nodata.style.display = "flex";
                nodata.style.justifyContent = "center";
            }
        });
};

const displayFavorites = (favorites) => {
    const parent = document.getElementById("AllFavoriteFood");
    if (!parent) return;

    favorites.forEach(fav => {
        const food = fav.food_item_details;
        if (!food) return;

        const div = document.createElement("div");
        div.classList.add("food-cart");
        div.id = `fav-card-${fav.id}`;

        const price = parseInt(food?.price, 10);
        const discount = parseInt(food?.discount, 10);

        const discountSection = food?.discount > 0
            ? `<h5 class="discounted-price"><span class="taka">৳</span> ${price}</h5>  <span class="discount fs-6 m-lg-2"> ${discount}% OFF</span>
            <h5 class="amount_price"><span class="taka">৳</span> ${food?.discounted_price}</h5>`
            : `<h5 class="amount_price"><span class="taka discounted-price">৳</span> ${price}</h5>`;

        div.innerHTML = `
        <div class="favorite-heart-btn" onclick="removeFavorite(event, ${fav.id})">
            <i class="fa fa-heart favorited" id="heart-icon-${fav.id}"></i>
        </div>
        <img class="food-img" src="${food?.image}" alt="">
            <h5 style="font-weight: bold; margin-bottom: 5px;">${food?.name}</h5>
            <!-- Star Ratings Section -->
            <div class="rating-display-container mb-3" style="display: flex; align-items: center; justify-content: flex-start;">
                ${getStarRatingHTML(food?.avg_rating)}
                <span class="rating-text" style="color: #007bff; font-weight: 600; margin-left: 8px; font-size: 13px;">Ratings ${food?.rating_count || 0}</span>
            </div>
            <h6>${food?.description.slice(0, 30)}...</h6>
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <p class="mb-0">
                ${food?.category?.map((item) => {
                    return `<button class="category-button">${item}</button>`
                }).join(' ')}
                </p>
                <span class="order-count-badge"><i class="fa fa-shopping-bag"></i> ${food?.order_count || 0} orders</span>
            </div>
            <hr>
            ${discountSection}
            <div class="d-flex justify-content-around">
                <button id="search-button" onclick="window.location.href='Food_details.html?fooditemId=${food?.id}'">Details</button>
                <button id="search-button" onclick="Addcart(${food?.id})">Add to cart</button>
            </div>
        `;
        parent.appendChild(div);
    });
};

const removeFavorite = (event, favId) => {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    fetch(`http://127.0.0.1:8000/fooditem/favorites/${favId}/`, {
        method: "DELETE",
    })
    .then(res => {
        if (res.ok) {
            const card = document.getElementById(`fav-card-${favId}`);
            if (card) {
                card.classList.add("fade-out");
                setTimeout(() => {
                    card.remove();
                    const parent = document.getElementById("AllFavoriteFood");
                    if (parent && parent.children.length === 0) {
                        const nodata = document.getElementById("nodata");
                        if (nodata) {
                            nodata.style.display = "flex";
                            nodata.style.justifyContent = "center";
                        }
                    }
                }, 450);
            }
            showToast("Removed from favorites!", "success");
        } else {
            showToast("Failed to remove favorite", "error");
        }
    })
    .catch(err => {
        console.error("Error removing favorite:", err);
        showToast("Failed to remove favorite", "error");
    });
};

const Addcart = (foodId) => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        showToast("Please log in to add items to cart!", "warning");
        return;
    }

    const token = localStorage.getItem("token");
    const customerHeaders = {
        "Content-Type": "application/json"
    };
    if (token) {
        customerHeaders["Authorization"] = `Token ${token}`;
    }

    fetch(`http://127.0.0.1:8000/customer/list/?user_id=${user_id}`, {
        headers: customerHeaders
    })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const customerId = data[0].id;
                const info = {
                    customer: customerId,
                    fooditem: foodId,
                    quantity: 1,
                };

                const cartHeaders = {
                    "Content-Type": "application/json"
                };
                if (token) {
                    cartHeaders["Authorization"] = `Token ${token}`;
                }

                fetch("http://127.0.0.1:8000/carts/cartitems/", {
                    method: "POST",
                    headers: cartHeaders,
                    body: JSON.stringify(info),
                })
                .then(res => res.json())
                .then(data => {
                    showToast("Food added successfully to cart!", "success");
                    if (window.updateNavCartCount) {
                        window.updateNavCartCount();
                    }
                })
                .catch((error) => {
                    console.error('Error adding to cart:', error);
                    showToast("Failed to add to cart", "error");
                });
            } else {
                showToast("Failed to fetch customer profile", "error");
            }
        })
        .catch((error) => {
            console.error('Error fetching customer:', error);
            showToast("Failed to fetch customer profile", "error");
        });
};

// Startup initialization
document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
});
