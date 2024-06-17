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
