document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('nameInput');
    const generateButton = document.getElementById('generateButton');
    const nameListContainer = document.getElementById('nameListContainer');
    const notesContainer = document.getElementById('notesContainer');
    const saveNotesButton = document.getElementById('saveNotesButton');
    const randomizeButton = document.getElementById('randomizeButton');

    let noteInputListeners = [];

    let state = {  // Entire state in this object
        names: [], // Initialize this as an empty array
        notes: "" // Initialize this as an empty string
    };

    function saveStateToLocalStorage(state) {
        localStorage.setItem('savedState', JSON.stringify(state));
        // console.log(JSON.stringify(state.names));
        // console.log(JSON.stringify(state.notes));

    }

    // Load state from local storage if available
    if (localStorage.getItem('savedState')) {
        state = JSON.parse(localStorage.getItem('savedState'));
        displayState();
    }

    // let names = [];

    // Initially hide the Save Notes and Randomize List buttons
    saveNotesButton.style.display = 'none';
    randomizeButton.style.display = 'none';

    generateButton.addEventListener('click', function () {
        names = nameInput.value.split(',').map(name => name.trim());
    
        // Create note containers for each name
        const noteContainers = names.map(name => `
            <div class="note-box">
                <h3>${name}</h3>
                <textarea class="note" placeholder="Enter notes for ${name}..."></textarea>
            </div>
        `).join('');
    
        // // Clear the array and remove previous event listeners
        // noteInputListeners.forEach(listener => {
        //     listener.element.removeEventListener('input', listener.handler);
        // });
    
        // noteInputListeners = [];
    
        // const noteInputs = notesContainer.querySelectorAll('.note');
        // noteInputs.forEach((noteInput, index) => {
        //     const handler = function () {
        //         state.notes[index] = noteInput.value; // Update the state with the input value
        //         saveStateToLocalStorage(state); // Save the updated state
        //     };
    
        //     noteInput.addEventListener('input', handler);
        //     noteInputListeners.push({ element: noteInput, handler });
        // });
    
        // Shuffle names and corresponding note containers
        // shuffleArrays(names);
    
        const nameList = names.map(name => `<li class="name-box">${name}</li>`).join('');
        nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
    
        // Set the note containers HTML content
        notesContainer.innerHTML = noteContainers;
    
        nameListContainer.style.display = 'block';
        notesContainer.style.display = 'block';
    
        // Display the Save Notes and Randomize List buttons after list is generated
        saveNotesButton.style.display = 'block';
        randomizeButton.style.display = 'block';
    
        // Update the state object with the current names and notes
        state.names = names;
        state.notes = noteContainers;
    
        saveStateToLocalStorage(state); // Save the state to local storage
    
        displayState();
    });
    
    saveNotesButton.addEventListener('click', function () {
        const notes = Array.from(document.querySelectorAll('.note')).map(noteBox => noteBox.value);
    
        // Update the state object with the actual user input notes
        state.notes = notes;
    
        // Save the state to local storage
        saveStateToLocalStorage(state);
    });
             
    randomizeButton.addEventListener('click', function () {
        
        shuffleArrays(names);
        updateNameList();
    });

    function shuffleArrays(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateNameList() {
        const nameList = names.map(name => `<li class="name-box">${name}</li>`).join('');
        nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
    }

    function displayState() {
        console.log(state);
        console.log("Names property:", JSON.stringify(state.names));
        console.log("Notes property:", JSON.stringify(state.notes));
        if (state.names) {
            // console.log("Names property:", JSON.stringify(state.names));
            // Restore the input field value
            nameInput.value = state.names.join(', ');
    
            const nameList = state.names.map(name => `<li class="name-box">${name}</li>`).join('');
            nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
        }
    
        if (state.notes) {
            // console.log("Notes property:", JSON.stringify(state.notes));
            // Restore the note containers with saved notes
            notesContainer.innerHTML = state.notes;
        }
    }


    


    saveNotesButton.addEventListener('click', function () {
        const notes = Array.from(document.querySelectorAll('.note')).map(noteBox => noteBox.value);

        const content = names.map((name, index) => `${name}: ${notes[index]}`).join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.txt';
        a.click();
    });
});
