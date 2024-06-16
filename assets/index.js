// Get references to necessary elements
const teamRows = document.getElementById('team-rows');
const addTeamBtn = document.getElementById('add-team-btn');

// Variable to keep track of the team count
let teamCount = 1;

// Function to create a new team row
const createTeamRow = (teamData = {}) => {
  const row = document.createElement('tr');
  row.classList.add('pos');
  row.innerHTML = `
    <td>${teamData.rank || teamCount}</td>
    <td><input type="text" class="editable-input" value="${teamData.team || 'New Team'}"></td>
    <td><input type="number" class="editable-input" value="${teamData.gp || 0}"></td>
    <td><input type="number" class="editable-input" value="${teamData.w || 0}"></td>
    <td><input type="number" class="editable-input" value="${teamData.d || 0}"></td>
    <td><input type="number" class="editable-input" value="${teamData.l || 0}"></td>
    <td><input type="number" class="editable-input" value="${teamData.gd || 0}"></td>
    <td>${teamData.pts || 0}</td>
    <td><button class="edit-btn">Edit</button></td>
  `;
  if (!teamData.rank) teamCount++;
  return row;
}

// Function to sort the table based on points and goal difference
const sortTable = () => {
  const rows = Array.from(teamRows.getElementsByTagName('tr'));
  rows.sort((a, b) => {
    const aPts = parseInt(a.getElementsByTagName('td')[7].textContent);
    const bPts = parseInt(b.getElementsByTagName('td')[7].textContent);
    if (aPts === bPts) {
      const aGD = parseInt(a.getElementsByTagName('td')[6].getElementsByTagName('input')[0].value);
      const bGD = parseInt(b.getElementsByTagName('td')[6].getElementsByTagName('input')[0].value);
      return bGD - aGD;
    }
    return bPts - aPts;
  });
  rows.forEach((row, index) => {
    const teamData = getTeamData(row);
    teamData.rank = index + 1;
    row.getElementsByTagName('td')[0].textContent = teamData.rank;
    teamRows.appendChild(row);
  });
}

// Function to get team data from a table row
const getTeamData = (row) => {
  const cells = row.getElementsByTagName('td');
  const teamData = {
    rank: parseInt(cells[0].textContent),
    team: cells[1].getElementsByTagName('input')[0].value,
    gp: parseInt(cells[2].getElementsByTagName('input')[0].value),
    w: parseInt(cells[3].getElementsByTagName('input')[0].value),
    d: parseInt(cells[4].getElementsByTagName('input')[0].value),
    l: parseInt(cells[5].getElementsByTagName('input')[0].value),
    gd: parseInt(cells[6].getElementsByTagName('input')[0].value),
    pts: parseInt(cells[7].textContent)
  };
  return teamData;
}

// Function to update the points for a team row
const updatePoints = (row) => {
  const teamData = getTeamData(row);
  const pts = teamData.w * 3 + teamData.d;
  row.getElementsByTagName('td')[7].textContent = pts;
  teamData.pts = pts;
  sortTable();
}

// Event listener for the "Add Team" button
addTeamBtn.addEventListener('click', () => {
  const newRow = createTeamRow({});
  teamRows.appendChild(newRow);
  initializeEditHandlers();
  saveData();
});

// Function to initialize edit handlers for input fields and buttons
const initializeEditHandlers = () => {
  const editBtns = document.querySelectorAll('.edit-btn');
  const inputs = document.querySelectorAll('.editable-input');

  editBtns.forEach((btn, index) => {
    let isEditing = false;
    const input = inputs[index];
    const originalValue = input.value;

    // Event listener for the "Edit" button
    btn.addEventListener('click', () => {
      isEditing = !isEditing;

      if (isEditing) {
        input.focus();
        btn.textContent = 'Save';
      } else {
        btn.textContent = 'Edit';
        updatePoints(btn.parentNode.parentNode);
        saveData();
      }
    });

    // Event listener for input field losing focus
    input.addEventListener('blur', () => {
      if (isEditing) {
        isEditing = false;
        btn.textContent = 'Edit';
        updatePoints(btn.parentNode.parentNode);
        saveData();
      }
    });

    // Event listener for Enter key press in input field
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (isEditing) {
          isEditing = false;
          btn.textContent = 'Edit';
          input.blur();
          updatePoints(btn.parentNode.parentNode);
          saveData();
        } else {
          isEditing = true;
          btn.textContent = 'Save';
          input.focus();
        }
      }
    });
  });
}

// Function to save data to the database.json file
const saveData = () => {
  const rows = Array.from(teamRows.getElementsByTagName('tr'));
  const teamData = rows.map(row => getTeamData(row));

  // Convert the team data to JSON and write it to the database.json file
  const jsonData = JSON.stringify(teamData);
  const fileBlob = new Blob([jsonData], { type: 'application/json' });
  const fileUrl = URL.createObjectURL(fileBlob);

  // Create a temporary anchor element to download the file
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = 'database.json';
  downloadLink.click();

  // Clean up the temporary anchor element and file URL
  URL.revokeObjectURL(fileUrl);
  downloadLink.remove();
}

// Function to load data from the database.json file
const loadData = () => {
  // Check if the browser supports the FileReader API
  if (typeof window.FileReader === 'undefined') {
    console.error('This browser does not support the FileReader API.');
    return;
  }

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const teamData = JSON.parse(reader.result);
        teamData.forEach(data => {
          const row = createTeamRow(data);
          teamRows.appendChild(row);
        });
        initializeEditHandlers();
      };
      reader.readAsText(file);
    }
  });

  fileInput.click();
}

// Initialize the edit handlers for the initial table rows
initializeEditHandlers();

// Load data from the database.json file
loadData();