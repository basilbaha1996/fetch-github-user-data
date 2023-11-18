document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const alertMessage = document.getElementById('alertMessage');
    const dataContainer = document.getElementById('dataContainer');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('name').value;
  
      if (username === "") {
        alertMessage.textContent = "Please enter a username.";
      } else {
        alertMessage.textContent = "";
        console.log(username);
  
        const storedData = getDataFromLocalStorage();
  
        if (Array.isArray(storedData)) {
          const userData = storedData.find(item => item.username === username);
  
          if (userData) {
            displayData(userData.data);
          } else {
            fetchData(username, storedData);
          }
        } else {
          fetchData(username, []);
        }
      }
    });
  
    function fetchData(username, storedData) {
      const apiUrl = `https://api.github.com/users/${username}`;
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          displayData(data);
          console.log(data);
          saveDataToLocalStorage([...storedData, { username, data }]);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  
    function saveDataToLocalStorage(data) {
      localStorage.setItem('fetchedData', JSON.stringify(data));
    }
  
    function getDataFromLocalStorage() {
      const storedData = localStorage.getItem('fetchedData');
      return storedData ? JSON.parse(storedData) : null;
    }
  
    function displayData(data) {
      dataContainer.textContent = JSON.stringify(data);
    }
  });
  