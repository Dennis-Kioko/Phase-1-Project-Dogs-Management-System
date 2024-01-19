// wait html document to fully load and parsed
document.addEventListener("DOMContentLoaded", () => {
  // API URL to fetch breeds
  const apiUrlBreeds = "https://dog.ceo/api/breeds/list/all";
  // API URL to fetch random dog images
  const apiUrlRandomImage = "https://dog.ceo/api/breeds/image/random";

  // Fetch and populate dropdown with breeds
  fetch(apiUrlBreeds)
    .then(response => response.json())
    .then(data => {
      const breedsObj = data.message;
      const breedDropdown = document.getElementById("dogBreed");

      for (let breed in breedsObj) {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedDropdown.appendChild(option);
      }
    });

  // Retrieve dogs data from local storage
  let dogsData = JSON.parse(localStorage.getItem('dogs')) || [];

  // Function to update local storage with dogs data
  function updateLocalStorage() {
    localStorage.setItem('dogs', JSON.stringify(dogsData));
  }

  // Create a new dog card
  function createDogCard(dogData) {
    const dogList = document.getElementById("dogs");
    const dogCard = document.createElement("li");
    dogCard.className = "dog-card";
    dogCard.innerHTML = `
            <img src="${dogData.image}" alt="Dog Image">
            <h3>Name: <span class="dog-name">${dogData.name}</span></h3>
            <p>Breed: <span class="dog-breed">${dogData.breed}</span></p>
            <p>Description: <span class="dog-description">${dogData.description}</span></p>
            <p>Quantity: <span class="dog-quantity">${dogData.quantity}</span></p>
            <button class="edit-dog">Edit</button>
            <button class="delete-dog">Delete</button>
        `;

    dogCard.querySelector(".edit-dog").addEventListener("click", () => {
      editDog(dogCard, dogData);
    });

    dogCard.querySelector(".delete-dog").addEventListener("click", () => {
      deleteDog(dogCard, dogData);
    });

    dogList.appendChild(dogCard);
  }

  function deleteDog(dogCard, dogData) {
    const dogList = document.getElementById("dogs");
    dogList.removeChild(dogCard);

    // Remove the dog from the local storage
    dogsData = dogsData.filter(dog => dog !== dogData);
    updateLocalStorage();
  }

  function editDog(dogCard, dogData) {
    // Create a form for editing
    const editForm = document.createElement("form");
    editForm.className = "edit-form";
    editForm.innerHTML = `
        <label for="editDogName">Name:</label>
        <input type="text" id="editDogName" value="${dogData.name}" required>

        <label for="editDogBreed">Breed:</label>
        <input type="text" id="editDogBreed" value="${dogData.breed}" required>

        <label for="editDogDescription">Description:</label>
        <input type="text" id="editDogDescription" value="${dogData.description}" required>

        <label for="editDogQuantity">Quantity:</label>
        <input type="text" id="editDogQuantity" value="${dogData.quantity}" required>

        <button type="submit">Save Changes</button>
    `;

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const editedDogName = document.getElementById("editDogName").value;
      const editedDogBreed = document.getElementById("editDogBreed").value;
      const editedDogDescription = document.getElementById("editDogDescription").value;
      const editedDogQuantity = document.getElementById("editDogQuantity").value;

      dogData.name = editedDogName;
      dogData.breed = editedDogBreed;
      dogData.description = editedDogDescription;
      dogData.quantity = editedDogQuantity;

      dogCard.innerHTML = `
        <img src="${dogData.image}" alt="Dog Image">
        <h3>Name: <span class="dog-name">${dogData.name}</span></h3>
        <p>Breed: <span class="dog-breed">${dogData.breed}</span></p>
        <p>Description: <span class="dog-description">${dogData.description}</span></p>
        <p>Quantity: <span class="dog-quantity">${dogData.quantity}</span></p>
        <button class="edit-dog">Edit</button>
        <button class="delete-dog">Delete</button>
      `;

      dogCard.removeChild(editForm);

      // Update the local storage with the edited data
      updateLocalStorage();
    });

    dogCard.appendChild(editForm);
  }

  function handleAddDogForm() {
    const addDogForm = document.getElementById("addDogForm");

    addDogForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dogNameInput = document.getElementById("dogName");
      const dogBreedInput = document.getElementById("dogBreed");
      const dogDescriptionInput = document.getElementById("dogDescription");
      const dogQuantityInput = document.getElementById("dogQuantity");

      const newDogData = {
        name: dogNameInput.value,
        breed: dogBreedInput.value,
        description: dogDescriptionInput.value,
        quantity: dogQuantityInput.value,
      };

      const dogImage = await fetchDogData(apiUrlRandomImage);
      newDogData.image = dogImage.message;

      createDogCard(newDogData);
      addDogForm.reset();

      // Update local storage with the new data
      dogsData.push(newDogData);
      updateLocalStorage();
    });
  }

  // Load existing dogs data from local storage
  dogsData.forEach(createDogCard);

  handleAddDogForm();
});

// Fetch data from the dog API
async function fetchDogData(apiUrl) {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching dog data", error);
  }
}
