document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const quotes = [
      "Food waste is a major issue.", "Waste less, save more.", "Every plate wasted is an opportunity lost.",
      // Add more quotes as needed.
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('marquee-quote').textContent = randomQuote;
  
    // Add a background color to the loading screen
    loadingScreen.style.backgroundColor = '#f2f7fa'; // Light blue background
  
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000);
  });
  
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form submission (to keep the page from reloading)
    
    const name = document.getElementById('name').value;
    const studentClass = document.getElementById('class').value;
    const studentId = document.getElementById('id').value;
    const section = document.getElementById('section').value;
    const totalFood = parseFloat(document.getElementById('total-food').value);
    const foodWaste = parseFloat(document.getElementById('food-waste').value);
  
    const wastePercentage = ((foodWaste / totalFood) * 100).toFixed(2);
    const isGood = wastePercentage < 30;
  
    // Add student card
    addStudentCard(name, studentClass, studentId, section, wastePercentage, isGood);
  
    // After a short delay, navigate to the dashboard
    setTimeout(() => {
      navigateTo('dashboard');
    }, 1000); // Delay for a smooth transition
  }
  
  function addStudentCard(name, studentClass, studentId, section, wastePercentage, isGood) {
    const card = document.createElement('div');
    card.classList.add('leaderboard-card');
  
    const icon = isGood ? 'fas fa-smile' : 'fas fa-frown';
    const iconColor = isGood ? 'green' : 'red';
    const message = isGood ? 'Great job reducing waste!' : 'Try to reduce waste next time.';
  
    card.innerHTML = `
      <div class="icon" style="color: ${iconColor};"><i class="${icon}"></i></div>
      <h3>${name}</h3>
      <p>ID: ${studentId}</p>
      <p>Section: ${section}</p>
      <p>Class: ${studentClass}</p>
      <p>Waste: ${wastePercentage}%</p>
      <p>${message}</p>
    `;
  
    // Append the card to either the left or right side of the leaderboard
    const leaderboardLeft = document.getElementById('leaderboard-left-cards');
    const leaderboardRight = document.getElementById('leaderboard-right-cards');
  
    // Append to the right if waste is high, left if it's low
    if (isGood) {
      leaderboardLeft.appendChild(card);
    } else {
      leaderboardRight.appendChild(card);
    }
  }
  
  function navigateTo(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }
  
  function clearData() {
    // Reset the form
    document.getElementById('student-form').reset();
  
    // Clear all student cards from the leaderboard
    const leaderboardLeft = document.getElementById('leaderboard-left-cards');
    const leaderboardRight = document.getElementById('leaderboard-right-cards');
    
    leaderboardLeft.innerHTML = ''; // Clear left section
    leaderboardRight.innerHTML = ''; // Clear right section
  
    // Navigate back to the homepage
    navigateTo('home');
  }
  
  // Add event listener to the Home button
  document.getElementById('home-button').addEventListener('click', clearData);
  