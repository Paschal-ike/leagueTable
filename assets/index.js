// Get references to necessary elements
const teamRows = document.getElementById('team-rows');
const addTeamBtn = document.getElementById('add-team-btn');

// Variable to keep track of the team count
let teamCount = 1;

// Function to create a new team row
const createTeamRow = (teamName) => {
  const row = document.createElement('tr');
  row.classList.add('pos');
  row.innerHTML = `
    <td>${teamCount}</td>
    <td><input type="text" class="editable-input" value="${teamName}"></td>
    <td><input type="number" class="editable-input" value="0"></td>
    <td><input type="number" class="editable-input" value="0"></td>
    <td><input type="number" class="editable-input" value="0"></td>
    <td><input type="number" class="editable-input" value="0"></td>
    <td><input type="number" class="editable-input" value="0"></td>
    <td>0</td>
    <td><button class="edit-btn">Edit</button></td>
  `;
  teamCount++;
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
    row.getElementsByTagName('td')[0].textContent = index + 1;
    teamRows.appendChild(row);
  });
}

// Function to update the points for a team row
const updatePoints = (row) => {
  const gp = parseInt(row.getElementsByTagName('td')[2].getElementsByTagName('input')[0].value);
  const w = parseInt(row.getElementsByTagName('td')[3].getElementsByTagName('input')[0].value);
  const d = parseInt(row.getElementsByTagName('td')[4].getElementsByTagName('input')[0].value);
  const l = parseInt(row.getElementsByTagName('td')[5].getElementsByTagName('input')[0].value);
  const gd = parseInt(row.getElementsByTagName('td')[6].getElementsByTagName('input')[0].value);
  const pts = w * 3 + d;
  row.getElementsByTagName('td')[7].textContent = pts;
  sortTable();
}

// Event listener for the "Add Team" button
addTeamBtn.addEventListener('click', () => {
  const newRow = createTeamRow('New Team');
  teamRows.appendChild(newRow);
  initializeEditHandlers();
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
      }
    });

    // Event listener for input field losing focus
    input.addEventListener('blur', () => {
      if (isEditing) {
        isEditing = false;
        btn.textContent = 'Edit';
        updatePoints(btn.parentNode.parentNode);
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
        } else {
          isEditing = true;
          btn.textContent = 'Save';
          input.focus();
        }
      }
    });
  });
}

// Initialize the edit handlers for the initial table rows
initializeEditHandlers();