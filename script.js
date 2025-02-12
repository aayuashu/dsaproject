// Fetch restaurants from backend on page load
function fetchRestaurants() {
    fetch('http://localhost:3000/api/restaurants')
        .then(response => response.json())
        .then(data => {
            restaurants = data; // Store fetched restaurants
            displayRankings();  // Call function to display
        })
        .catch(error => console.error("Error fetching restaurants:", error));
}

// Function to display rankings
function displayRankings() {
    fetch('http://localhost:3000/api/restaurants')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("restaurant-list");
            list.innerHTML = "";

            data.forEach((restaurant, index) => {
                const listItem = document.createElement("li");

                listItem.innerHTML = `
                    <strong>#${index + 1} ${restaurant.name}</strong> 
                    <span>⭐ ${restaurant.rating.toFixed(1)} (from ${restaurant.totalRatings} ratings)</span>
                    <input type="number" class="rating-input" min="1" max="5" step="0.1" placeholder="Your Rating">
                    <button class="update-btn" data-id="${restaurant.id}">Submit Rating</button>
                `;
                list.appendChild(listItem);
            });

            document.querySelectorAll(".update-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const restaurantId = this.dataset.id;
                    const newRating = this.previousElementSibling.value;
                    updateRating(restaurantId, newRating);
                });
            });
        })
        .catch(error => console.error("Error fetching restaurants:", error));
}

// Function to update rating
function updateRating(id, newRating) {
    if (!newRating || newRating < 1 || newRating > 5) {
        alert("Please enter a valid rating between 1 and 5.");
        return;
    }

    fetch(`http://localhost:3000/api/restaurants/${id}/rating`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRating: parseFloat(newRating) }),
    })
    .then(response => response.json())
    .then(() => displayRankings())
    .catch(error => console.error("Error updating rating:", error));
}

// Add new restaurant
document.getElementById("add-restaurant-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("restaurant-name").value.trim();
    const ratingInput = parseFloat(document.getElementById("restaurant-rating").value);

    if (!nameInput || ratingInput < 1 || ratingInput > 5) {
        alert("Please enter a valid restaurant name and rating (1-5).");
        return;
    }

    fetch("http://localhost:3000/api/restaurants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput, rating: ratingInput }),
    })
    .then(response => response.json())
    .then(() => {
        displayRankings();
        document.getElementById("restaurant-name").value = "";
        document.getElementById("restaurant-rating").value = "";
    })
    .catch(error => console.error("Error adding restaurant:", error));
});

// Call function when page loads
document.addEventListener("DOMContentLoaded", fetchRestaurants);
