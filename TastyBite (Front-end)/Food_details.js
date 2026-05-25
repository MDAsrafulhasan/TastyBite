const getparams = () => {
    const param = new URLSearchParams(window.location.search).get("fooditemId");
    const parent = document.getElementById("Full-details");

    if (!param || param === "null" || param === "undefined") {
        if (parent) {
            parent.innerHTML = `
                <div class="food-details-container" style="min-height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; margin: 0;">
                    <i class="fa fa-exclamation-triangle" style="font-size: 48px; color: var(--danger); margin-bottom: 15px;"></i>
                    <h4 style="font-weight: bold; color: var(--text-dark);">No Food Item Selected</h4>
                    <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">Please select a delicious meal from the foods list to see its details.</p>
                    <button id="search-button" onclick="window.location.href='./food.html'">Browse Foods</button>
                </div>
            `;
        }
        return;
    }

    fetch(`http://127.0.0.1:8000/fooditem/foods/${param}/`)
        .then(res => {
            if (!res.ok) {
                throw new Error("The requested food details could not be found.");
            }
            return res.json();
        })
        .then(data => displayDetails(data))
        .catch(err => {
            console.error("Error loading food details:", err);
            if (parent) {
                parent.innerHTML = `
                    <div class="food-details-container" style="min-height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; margin: 0;">
                        <i class="fa fa-exclamation-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 15px;"></i>
                        <h4 style="font-weight: bold; color: var(--text-dark);">Failed to Load Details</h4>
                        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">${err.message || 'Unable to retrieve details from the server.'}</p>
                        <button id="search-button" onclick="window.location.href='./food.html'">Back to Foods</button>
                    </div>
                `;
            }
        });

    fetch(`http://127.0.0.1:8000/customer/review/?food_item_id=${param}`)
        .then(res => res.json())
        .then(data => displayReview(data))
        .catch(err => console.error("Error loading reviews:", err));
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

const displayDetails = (food) => {
    // console.log(food);
    const param = new URLSearchParams(window.location.search).get("fooditemId");
    const parent = document.getElementById("Full-details");
    const div = document.createElement("div");
    div.classList.add("food-details-container");

    const price = parseInt(food?.price, 10);
    const discount = parseInt(food?.discount, 10);

    const discountSection = food?.discount > 0
        ? `<h5 class="discounted-price"><span class="taka">৳</span> ${price}</h5>  <span class="discount fs-6 m-lg-2"> ${discount}% OFF</span>
            <h5 class="amount_price"><span class="taka">৳</span> ${food?.discounted_price}</h5>`
        : `<h5 class="amount_price"><span class="taka discounted-price">৳</span> ${price}</h5>`;


    div.innerHTML = `
            <div>
                <img class="food-detail-img" src="${food?.image}" alt="">
            </div>
            <div class="food-details-info">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${food?.name}</h3>
                <!-- Star Ratings Section -->
                <div class="rating-display-container mb-3" style="display: flex; align-items: center; justify-content: flex-start;">
                    ${getStarRatingHTML(food?.avg_rating)}
                    <span class="rating-text" style="color: #007bff; font-weight: 600; margin-left: 8px; font-size: 14px;">Ratings ${food?.rating_count || 0}</span>
                </div>
                <p class="detail-description">${food?.description}</p>
                <p>
            ${food?.category?.map((item) => {
        return `<button class="category-button">${item}</button>`
    }).join(' ')}
                </p>
                ${discountSection}
                <button id="search-button" onclick="Addcart(${param})">Add to Cart</button>
            </div>
    `;
    parent.appendChild(div);

};

const displayReview = (reviews) => {
    console.log(reviews);
    const parent = document.getElementById("Food-review");
    parent.innerHTML = ""; // Clear existing content
    
    if (reviews.length === 0) {
        const li = document.createElement("li");
        li.style.width = "100%";
        li.innerHTML = `
            <div class="review-card" style="min-height: 150px; max-width: 600px;">
                <p class="review-comment" style="font-size: 16px;">No reviews yet for this food item. Be the first to write one!</p>
            </div>
        `;
        parent.appendChild(li);
        return;
    }

    reviews.forEach((review) => {
        const li = document.createElement("li");
        const div = document.createElement("div");
        div.classList.add("review-card");
        
        // Handle avatar gracefully if missing
        const avatarUrl = review.customer.image || "./Image/default-avatar.png";
        
        div.innerHTML = `
            <div class="quote-icon"><i class="fa fa-quote-left"></i></div>
            <img src="${avatarUrl}" alt="${review.customer.user}" class="review-avatar">
            <h4>${review.customer.user}</h4>
            <div class="review-stars">${review.rating}</div>
            <p class="review-comment">"${review.comment}"</p>
        `;
        li.appendChild(div);
        parent.appendChild(li);
    });

    // Re-initialize swiffy slider to support dynamic slide creation
    if (window.swiffySlider) {
        window.swiffySlider.initSlider(parent.parentElement);
    }
};


// const submitReview = (event) => {
//     event.preventDefault();
//     const userId = localStorage.getItem('user_id');
//     const rating = document.getElementById("rating").value;
//     const comment = document.getElementById("comment").value;
//     const foodItemId = new URLSearchParams(window.location.search).get("fooditemId");
//     console.log(rating, comment,foodItemId);

//     fetch(`https://tastybite.onrender.com/customer/list/?user_id=${userId}`)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data[0].id);

//             const customerId = data[0].id;


//             fetch("https://tastybite.onrender.com/customer/review/", {
//                 method: "POST",
//                 headers: {
//                     "content-type": "application/json",
//                     // "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     rating: rating,
//                     comment: comment,
//                     customer: customerId,
//                     food_item: foodItemId,
//                 }),
//             })
//                 .then(res => res.json())
//                 .then(data => {
//                     showToast("Review submitted successfully!", "success");
//                     console.log(data);
//                 })
//                 .catch(error => {
//                     showToast("Please wait until the order completes", "warning");
//                     console.error("Error:", error);
//                 });

//         });

// };



const submitReview = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        showToast("Please log in to submit a review.", "warning");
        return;
    }
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;
    const foodItemId = new URLSearchParams(window.location.search).get("fooditemId");
    console.log(rating, comment, foodItemId);

    fetch("http://127.0.0.1:8000/customer/review/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
            rating: rating,
            comment: comment,
            food_item: foodItemId,
        }),
    })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                const errorMsg = data.error || data.detail || "Failed to submit review.";
                throw new Error(errorMsg);
            }
            return data;
        })
        .then(data => {
            showToast("Review submitted successfully!", "success");
            console.log(data);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            showToast(error.message || "Failed to submit review.", "warning");
            console.error("Error:", error);
        });
};

getparams();



// const displayReview = (reviews) => {     // try to do some different
//     console.log(reviews.length);
//     // parent.innerHTML='';
//     if(reviews.length>0){
//         reviews.forEach((review) =>{
//             const parent = document.createElement("Food-review");
//             // const parent = document.getElementById("Food-review");
//             const div = document.createElement("div");
//             div.classList.add("review-card");
//             div.innerHTML = `
//             <img src=${review.customer.image} alt="">
//                         <h4>${review.customer.user}</h4>
//                         <h6>${review.rating}</h6>
//                         <p>${review.comment}</p>
//             `;
//             parent.appendChild(div);
//         });
//     }
//     else{
//         const parent = document.getElementById("Food-review-nodata");
//         const div = document.createElement("div");
//         div.innerHTML = `<p>No Review </p>`
//         parent.appendChild(div);
//     }
// };

