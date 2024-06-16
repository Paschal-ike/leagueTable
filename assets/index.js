const teamRows = document.getElementById('team-rows');
const addTeamBtn = document.getElementById('add-team-btn');

let teamCount = 1;

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

addTeamBtn.addEventListener('click', () => {
  const newRow = createTeamRow('New Team');
  teamRows.appendChild(newRow);
  initializeEditHandlers();
});

const initializeEditHandlers = () => {
  const editBtns = document.querySelectorAll('.edit-btn');
  const inputs = document.querySelectorAll('.editable-input');

  editBtns.forEach((btn, index) => {
    let isEditing = false;
    const input = inputs[index];
    const originalValue = input.value;

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

    input.addEventListener('blur', () => {
      if (isEditing) {
        isEditing = false;
        btn.textContent = 'Edit';
        updatePoints(btn.parentNode.parentNode);
      }
    });

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

initializeEditHandlers();