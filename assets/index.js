// When the DOM content is fully loaded, initialize the league table
document.addEventListener('DOMContentLoaded', (event) => {
  initializeWeek();
  loadTeams();
  updateTable();
});

// Current week
let currentWeek = 1;

// Initialize teams for the current week from localStorage or an empty array if no data is stored
let teams = JSON.parse(localStorage.getItem(`teams_week_${currentWeek}`)) || [];

// Initialize the week number display
function initializeWeek() {
  const weekDisplay = document.getElementById('weekDisplay');
  weekDisplay.textContent = `Week ${currentWeek}`;
}

// Load teams from the array and display them in the table
function loadTeams() {
  const tbody = document.querySelector('#leagueTable tbody');
  tbody.innerHTML = ''; // Clear the table body
  // Sort teams by points and goal difference, and then populate the table
  teams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference).forEach((team, index) => {
      const row = document.createElement('tr'); // Create a new table row
      // Populate the row with team data
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${team.name}</td>
          <td>${team.gamesPlayed}</td>
          <td>${team.wins}</td>
          <td>${team.draws}</td>
          <td>${team.losses}</td>
          <td>${team.goalsFor}</td>
          <td>${team.goalsAgainst}</td>
          <td>${team.goalDifference}</td>
          <td>${team.points}</td>
          <td>
              <button onclick="updateTeam('${team.name}')">Update</button>
              <button onclick="removeTeam('${team.name}')">Remove</button>
          </td>
      `;
      tbody.appendChild(row); // Add the row to the table body
  });
}

// Save the current state of teams to localStorage and refresh the table
function updateTable() {
  localStorage.setItem(`teams_week_${currentWeek}`, JSON.stringify(teams)); // Save teams array to localStorage
  loadTeams(); // Reload the table
}

// Add a new team to the league
function addTeam() {
  const teamName = prompt("Enter team name:"); // Prompt the user to enter a team name
  // Check if the team name is valid and not already in the list
  if (teamName && !teams.some(team => team.name === teamName)) {
      // Add a new team object to the teams array
      teams.push({ 
          name: teamName, 
          gamesPlayed: 0, 
          wins: 0, 
          draws: 0, 
          losses: 0, 
          goalsFor: 0, 
          goalsAgainst: 0, 
          goalDifference: 0, 
          points: 0 
      });
      updateTable(); // Refresh the table
  } else {
      alert('Team already exists or invalid name!'); // Show an error if the team name is invalid or duplicate
  }
}

// Update the stats for a specific team
function updateTeam(teamName) {
  const team = teams.find(team => team.name === teamName); // Find the team object
  if (team) {
      // Prompt the user to update each stat for the team
      team.gamesPlayed = parseInt(prompt("Enter games played:", team.gamesPlayed));
      team.wins = parseInt(prompt("Enter wins:", team.wins));
      team.draws = parseInt(prompt("Enter draws:", team.draws));
      team.losses = parseInt(prompt("Enter losses:", team.losses));
      team.goalsFor = parseInt(prompt("Enter goals for:", team.goalsFor));
      team.goalsAgainst = parseInt(prompt("Enter goals against:", team.goalsAgainst));
      // Calculate the derived stats
      team.goalDifference = team.goalsFor - team.goalsAgainst;
      team.points = team.wins * 3 + team.draws;
      updateTable(); // Refresh the table
  } else {
      alert('Team not found!'); // Show an error if the team is not found
  }
}

// Remove a team from the league
function removeTeam(teamName) {
  teams = teams.filter(team => team.name !== teamName); // Filter out the team from the array
  updateTable(); // Refresh the table
}

// Navigate to the previous week
function prevWeek() {
  if (currentWeek > 1) {
      currentWeek--;
      switchWeek();
  }
}

// Navigate to the next week
function nextWeek() {
  currentWeek++;
  switchWeek();
}

// Switch the current week and update the display and data
function switchWeek() {
  document.getElementById('weekDisplay').textContent = `Week ${currentWeek}`;
  teams = JSON.parse(localStorage.getItem(`teams_week_${currentWeek}`)) || [];
  updateTable();
}

// Generate a clean table view without action buttons
// Generate a clean table view without action buttons
// Generate a clean table view without action buttons
// Generate a clean table view without action buttons
function viewTable() {
  let cleanTableHTML = `
      <html>
      <head>
          <title>League Table - Week ${currentWeek}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  padding: 20px;
              }
              .container {
                  width: 100%;
                  max-width: 800px;
                  background: #fff;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  border-radius: 8px;
              }
              h1 {
                  text-align: center;
                  margin-bottom: 20px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 10px;
                  text-align: center;
              }
              th {
                  background-color: #f4f4f4;
              }
              button {
                  display: block;
                  width: 100%;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #fff;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  text-align: center;
              }
              button:hover {
                  background-color: #0056b3;
              }
              #canvasContainer {
                  display: none;
              }
              @media (max-width: 600px) {
                  table {
                      display: block;
                      overflow-x: auto;
                  }
                  th, td {
                      padding: 5px;
                  }
                  .container {
                      padding: 10px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>League Table - Week ${currentWeek}</h1>
              <table id="leagueTableView">
                  <thead>
                      <tr>
                          <th>Rank</th>
                          <th>Team</th>
                          <th>GP</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>GF</th>
                          <th>GA</th>
                          <th>GD</th>
                          <th>Pts</th>
                      </tr>
                  </thead>
                  <tbody>
  `;

  teams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference).forEach((team, index) => {
      cleanTableHTML += `
          <tr>
              <td>${index + 1}</td>
              <td>${team.name}</td>
              <td>${team.gamesPlayed}</td>
              <td>${team.wins}</td>
              <td>${team.draws}</td>
              <td>${team.losses}</td>
              <td>${team.goalsFor}</td>
              <td>${team.goalsAgainst}</td>
              <td>${team.goalDifference}</td>
              <td>${team.points}</td>
          </tr>
      `;
  });

  cleanTableHTML += `
                  </tbody>
              </table>
              <button onclick="downloadImage()">Download JPEG</button>
              <div id="canvasContainer">
                  <canvas id="tableCanvas"></canvas>
              </div>
          </div>
          <script>
              function downloadImage() {
                  const table = document.getElementById('leagueTableView');
                  const canvas = document.getElementById('tableCanvas');
                  const ctx = canvas.getContext('2d');

                  // Set canvas dimensions to match the table
                  canvas.width = table.offsetWidth;
                  canvas.height = table.offsetHeight;

                  // Scale the context to match the device pixel ratio
                  const scale = window.devicePixelRatio;
                  canvas.width = table.offsetWidth * scale;
                  canvas.height = table.offsetHeight * scale;
                  ctx.scale(scale, scale);

                  // Draw the table onto the canvas
                  ctx.font = "16px Arial";
                  ctx.fillStyle = "black";

                  Array.from(table.rows).forEach((row, rowIndex) => {
                      Array.from(row.cells).forEach((cell, cellIndex) => {
                          const cellText = cell.innerText;
                          const cellRect = cell.getBoundingClientRect();
                          ctx.fillText(cellText, cellRect.left, cellRect.top + 20);
                      });
                  });

                  // Convert the canvas to a data URL and trigger download
                  const image = canvas.toDataURL("image/jpeg");
                  const link = document.createElement('a');
                  link.href = image;
                  link.download = 'league_table.jpg';
                  link.click();
              }
          </script>
      </body>
      </html>
  `;

  // Open a new window to display the clean table
  const newWindow = window.open('', '_blank');
  newWindow.document.write(cleanTableHTML);
  newWindow.document.close();
}



 


// Function to download the table as a CSV file
function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Rank,Team,GP,W,D,L,GF,GA,GD,Pts\n";
  teams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference).forEach((team, index) => {
      const row = [
          index + 1,
          team.name,
          team.gamesPlayed,
          team.wins,
          team.draws,
          team.losses,
          team.goalsFor,
          team.goalsAgainst,
          team.goalDifference,
          team.points
      ].join(",");
      csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `league_table_week_${currentWeek}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
