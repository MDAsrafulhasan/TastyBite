const loadandDisplayCategory = () => {
    const dropdown = document.getElementById("category-select");
    const parent = document.getElementById("category");
    if (!dropdown && !parent) return;

    // fetch("https://tastybite.onrender.com/fooditem/category/")
    fetch("http://127.0.0.1:8000/fooditem/category/")
        .then(res => res.json())
        .then(data => {
            if (dropdown) {
                dropdown.innerHTML = '<option value="all">All Categories</option>';
                data.forEach((category) => {
                    const option = document.createElement("option");
                    option.value = category.name;
                    option.innerText = category.name;
                    dropdown.appendChild(option);
                });
            }

            if (parent) {
                parent.innerHTML = "";
                const allChip = document.createElement("p");
                allChip.classList.add("category-name");
                allChip.classList.add("col-2");
                allChip.innerHTML = `<p onclick="selectCategoryChip('all')">All</p>`;
                parent.appendChild(allChip);

                data.forEach((category) => {
                    const p = document.createElement("p");
                    p.classList.add("category-name");
                    p.classList.add("col-2");
                    p.innerHTML = `
                    <p onclick="selectCategoryChip('${category?.name}')">${category?.name}</p>
                    `;
                    parent.appendChild(p);
                });
            }
        });
};

const selectCategoryChip = (categoryName) => {
    const dropdown = document.getElementById("category-select");
    if (dropdown) {
        dropdown.value = categoryName;
    }
    applyFiltersAndSort();
};

const getEffectivePrice = (food) => {
    const discount = parseInt(food?.discount, 10) || 0;
    if (discount > 0) {
        return parseFloat(food?.discounted_price) || 0;
    }
    return parseFloat(food?.price) || 0;
};

const applyFiltersAndSort = () => {
    const parent = document.getElementById("AllFood");
    if (!parent) return;

    if (!window.allFoods || window.allFoods.length === 0) {
        parent.innerHTML = "";
        document.getElementById("nodata").style.display = "flex";
        document.getElementById("nodata").style.justifyContent = "center";
        return;
    }

    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-val");
    const sortBy = document.getElementById("sort-by").value;
    const categorySelect = document.getElementById("category-select");
    const selectedCategory = categorySelect ? categorySelect.value : "all";

    const maxPrice = priceRange ? parseFloat(priceRange.value) : 1000;
    if (priceVal) {
        priceVal.innerText = `৳${maxPrice}`;
    }

    // 1. Filter by category client-side
    let filteredFoods = window.allFoods;
    if (selectedCategory !== "all") {
        filteredFoods = filteredFoods.filter(food => {
            return food?.category?.includes(selectedCategory);
        });
    }

    // 2. Filter by price range
    filteredFoods = filteredFoods.filter(food => {
        const effPrice = getEffectivePrice(food);
        return effPrice <= maxPrice;
    });

    // 3. Sort foods
    if (sortBy === "low-to-high") {
        filteredFoods.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortBy === "high-to-low") {
        filteredFoods.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (sortBy === "popular") {
        // featured/special items (is_special=True) first, then by discount descending
        filteredFoods.sort((a, b) => {
            const aSpecial = a.is_special ? 1 : 0;
            const bSpecial = b.is_special ? 1 : 0;
            if (aSpecial !== bSpecial) {
                return bSpecial - aSpecial;
            }
            const aDiscount = parseInt(a.discount, 10) || 0;
            const bDiscount = parseInt(b.discount, 10) || 0;
            return bDiscount - aDiscount;
        });
    } else if (sortBy === "discount") {
        filteredFoods.sort((a, b) => {
            const aDiscount = parseInt(a.discount, 10) || 0;
            const bDiscount = parseInt(b.discount, 10) || 0;
            return bDiscount - aDiscount;
        });
    }

    // 4. Render
    parent.innerHTML = "";

    if (filteredFoods.length > 0) {
        document.getElementById("nodata").style.display = "none";
        displayAllFoods(filteredFoods);
    } else {
        document.getElementById("nodata").style.display = "flex";
        document.getElementById("nodata").style.justifyContent = "center";
    }
};

const loadFoods = (searchValue) => {
    const parent = document.getElementById("AllFood");
    if (!parent) return;

    parent.innerHTML = "";
    // console.log(searchValue);
    // fetch(`https://tastybite.onrender.com/fooditem/foods/?search=${searchValue ? searchValue : ""}`)
    fetch(`http://127.0.0.1:8000/fooditem/foods/?search=${searchValue ? searchValue : ""}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            // console.log(data.length);
            if (data.length > 0) {
                window.allFoods = data;

                const prices = data.map(food => getEffectivePrice(food));
                const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

                const priceRange = document.getElementById("price-range");
                const priceVal = document.getElementById("price-val");
                if (priceRange) {
                    priceRange.max = maxPrice;
                    priceRange.value = maxPrice;
                }
                if (priceVal) {
                    priceVal.innerText = `৳${maxPrice}`;
                }

                const sortBy = document.getElementById("sort-by");
                if (sortBy) {
                    sortBy.value = "default";
                }

                const categorySelect = document.getElementById("category-select");
                if (categorySelect) {
                    categorySelect.value = "all";
                }

                applyFiltersAndSort();
            }
            else {
                window.allFoods = [];
                parent.innerHTML = "";
                document.getElementById("nodata").style.display = "block";
                document.getElementById("nodata").style.display = "flex";
                document.getElementById("nodata").style.justifyContent = "center";
            }
        });
};

const loadUserFavorites = () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        window.userFavorites = [];
        return Promise.resolve();
    }
    return fetch(`http://127.0.0.1:8000/fooditem/favorites/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            window.userFavorites = data || [];
        })
        .catch(err => {
            console.error("Error loading user favorites:", err);
            window.userFavorites = [];
        });
};

const toggleFavorite = (event, foodId) => {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        showToast("Please log in to add favorites!", "warning");
        return;
    }

    const icon = document.getElementById(`heart-icon-${foodId}`);
    const isFav = icon && icon.classList.contains("fa-heart");

    if (isFav) {
        // Delete from favorites
        const favRecord = window.userFavorites.find(fav => fav.food_item === foodId);
        if (!favRecord) return;

        fetch(`http://127.0.0.1:8000/fooditem/favorites/${favRecord.id}/`, {
            method: "DELETE",
        })
        .then(res => {
            if (res.ok) {
                window.userFavorites = window.userFavorites.filter(fav => fav.id !== favRecord.id);
                if (icon) {
                    icon.classList.remove("fa-heart", "favorited");
                    icon.classList.add("fa-heart-o");
                }
                showToast("Removed from favorites!", "success");
            }
        })
        .catch(err => {
            console.error("Error deleting favorite:", err);
            showToast("Failed to remove favorite", "error");
        });
    } else {
        // Add to favorites
        const payload = {
            user: parseInt(user_id, 10),
            food_item: foodId
        };

        fetch("http://127.0.0.1:8000/fooditem/favorites/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                window.userFavorites.push(data);
                if (icon) {
                    icon.classList.remove("fa-heart-o");
                    icon.classList.add("fa-heart", "favorited");
                }
                showToast("Added to favorites!", "success");
            }
        })
        .catch(err => {
            console.error("Error adding favorite:", err);
            showToast("Failed to add favorite", "error");
        });
    }
};

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

const displayAllFoods = (foods) => {
    const parent = document.getElementById("AllFood");
    if (!parent) return;

    // console.log(foods);
    foods.forEach((food) => {
        const div = document.createElement("div");
        div.classList.add("food-cart");

        const price = parseInt(food?.price, 10);
        const discount = parseInt(food?.discount, 10);

        const discountSection = food?.discount > 0
            ? `<h5 class="discounted-price"><span class="taka">৳</span> ${price}</h5>  <span class="discount fs-6 m-lg-2"> ${discount}% OFF</span>
            <h5 class="amount_price"><span class="taka">৳</span> ${food?.discounted_price}</h5>`
            : `<h5 class="amount_price"><span class="taka discounted-price">৳</span> ${price}</h5>`;

        const isFavorited = window.userFavorites ? window.userFavorites.some(fav => fav.food_item === food.id) : false;
        const heartClass = isFavorited ? "fa-heart favorited" : "fa-heart-o";

        div.innerHTML = `
        <div class="favorite-heart-btn" onclick="toggleFavorite(event, ${food?.id})">
            <i class="fa ${heartClass}" id="heart-icon-${food?.id}"></i>
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

const handleSearch = () => {
    const searchValue = document.getElementById("search").value;
    // console.log(searchValue);
    loadFoods(searchValue);
};

const Addcart = (foodId) => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        showToast("Please log in to add items to your cart.", "warning");
        return;
    }

    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    fetch(`http://127.0.0.1:8000/customer/list/?user_id=${user_id}`, {
        headers: headers
    })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                proceedToAddCart(data[0].id, foodId);
            } else {
                // Self-healing: create a default Customer profile for this staff/admin user
                const token = localStorage.getItem("token");
                const profilePayload = {
                    user: parseInt(user_id),
                    contact_number: "01700000000",
                    address: "Default Dhaka Address",
                    image: ""
                };
                
                fetch("http://127.0.0.1:8000/customer/list/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    },
                    body: JSON.stringify(profilePayload)
                })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to auto-create profile");
                    return res.json();
                })
                .then(newCustomer => {
                    proceedToAddCart(newCustomer.id, foodId);
                })
                .catch(err => {
                    console.error(err);
                    showToast("Your account has no Customer profile. Please contact admin.", "warning");
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching customer:', error);
            showToast("Failed to fetch customer profile.", "error");
        });
};

const proceedToAddCart = (customerId, foodId) => {
    const info = {
        customer: customerId,
        fooditem: foodId,
        quantity: 1,
    };

    const token = localStorage.getItem("token");
    const headers = {
        "content-type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    fetch("http://127.0.0.1:8000/carts/cartitems/", {
        method: "POST",
        headers: headers,
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
        console.error('Error:', error);
        showToast("Failed to add food to cart.", "error");
    });
};



if (document.getElementById("AllFood")) {
    loadUserFavorites().then(() => loadFoods());
}
loadandDisplayCategory();