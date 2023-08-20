const sortableList = document.querySelector(".sortable-list");
const randomizeButton = document.getElementById("randomize-button");
const notesContainer = document.querySelector(".notes-container");
const items = sortableList.querySelectorAll(".item");

items.forEach(item => {
  item.addEventListener("dragstart", () => {
    setTimeout(() => item.classList.add("dragging"), 0);
  });
  item.addEventListener("dragend", () => item.classList.remove("dragging"));
});

const initSortableList = (e) => {
  e.preventDefault();
  const draggingItem = document.querySelector(".dragging");
  const siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
  const nextSibling = siblings.find(sibling => {
    return e.clientX <= sibling.getBoundingClientRect().left + sibling.offsetWidth / 2;
  });
  sortableList.insertBefore(draggingItem, nextSibling);
}

sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());

randomizeButton.addEventListener("click", () => {
  const shuffledItems = shuffleArray([...items]);

  // Shuffling animation
  items.forEach((item, index) => {
    item.style.transition = "transform 1s ease-in-out";
    item.style.transitionDelay = `${index * 0.1}s`; // Add delay  
    item.style.transform = `translateY(${index * 100}px)`;
  });

  setTimeout(() => {
    shuffledItems.forEach((item, index) => {
      item.style.transition = "transform 1s ease-in-out";
      item.style.transitionDelay = `${index * 0.1}s`;
      item.style.transform = "";
    });

    // Update names and order in notes container
    notesContainer.style.display = "flex";
    notesContainer.innerHTML = "";

    shuffledItems.forEach((item, index) => {
      const personName = item.querySelector(".details span").textContent;
      const personId = personName.toLowerCase().replace(" ", "_"); // Create a unique ID for each person
      const personNotesDiv = document.createElement("div");
      personNotesDiv.classList.add("person-notes");

      const personNameHeading = document.createElement("h3");
      personNameHeading.classList.add("person-name");
      personNameHeading.textContent = personName;

      const personIdInput = document.createElement("input");
      personIdInput.type = "hidden";
      personIdInput.classList.add("person-id");
      personIdInput.value = personId; // Store the person's ID

      const notesTextbox = document.createElement("textarea");
      notesTextbox.classList.add("notes-textbox");
      notesTextbox.placeholder = "Write notes here...";

      personNotesDiv.appendChild(personNameHeading);
      personNotesDiv.appendChild(notesTextbox);
      personNotesDiv.appendChild(personIdInput);
      notesContainer.appendChild(personNotesDiv);
    });
  }, items.length * 10+1000); // Adjust delay 

  const saveButton = document.getElementById("save-button");
  saveButton.style.display = "block";
  
  saveButton.addEventListener("click", () => {
    saveNotesToFile();
});

    // Update the order of items after animation...
  setTimeout(() => {
    items.forEach((item, index) => {
      sortableList.appendChild(shuffledItems[index]);
    });
  }, items.length*10+1000); // Adjust delay
});





function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function saveNotesToFile() {
  const personNotes = Array.from(document.querySelectorAll(".person-notes"));

  const notesData = personNotes.map(personNote => {
    const personId = personNote.querySelector(".person-id").value;
    const notes = personNote.querySelector(".notes-textbox").value;
    return `${personId}: ${notes}`;
  }).join("\n");

  const blob = new Blob([notesData], { type: "text/plain" });
  const a = document.createElement("a");
  a.download = "notes.txt";
  a.href = URL.createObjectURL(blob);
  a.click();}