const userGrid       = document.getElementById('userGrid');
const viewToggleBtn  = document.getElementById('viewToggleBtn');
const deleteIdInput  = document.getElementById('deleteIdInput');
const deleteBtn      = document.getElementById('deleteBtn');
const sortByGroupBtn = document.getElementById('sortByGroupBtn');
const sortByIdBtn    = document.getElementById('sortByIdBtn');


const API_URL = 'https://69a1dd8c2e82ee536fa2692e.mockapi.io/users_api';

let users = [];  


 /**
 * 
 * @param {Array} userArray 
 */
function render(userArray) {
  if (userArray.length === 0) {
    userGrid.innerHTML = 'No users to display.';
    return;
  }

  userGrid.innerHTML = userArray.map(user => `
    <article class="user-card">
      <h3>${user.first_name ?? ''}</h3>
      <p>first_name: ${user.first_name ?? ''}</p>
      <p>user_group: ${user.user_group ?? ''}</p>
      <p>id: ${user.id ?? ''}</p>
    </article>
  `).join('');
}


async function retrieveData() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error('Failed to fetch users. Status:', response.status);
      return;
    }

    users = await response.json();
    console.log('Users array:', users);
    render(users);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


retrieveData();


viewToggleBtn.addEventListener('click', () => {
  if (userGrid.classList.contains('grid-view')) {
    userGrid.classList.remove('grid-view');
    userGrid.classList.add('list-view');
  } else {
    userGrid.classList.remove('list-view');
    userGrid.classList.add('grid-view');
  }
});


sortByGroupBtn.addEventListener('click', () => {
  users.sort((a, b) => a.user_group - b.user_group);
  render(users);
});


sortByIdBtn.addEventListener('click', () => {
  users.sort((a, b) => Number(a.id) - Number(b.id));
  render(users);
});

deleteBtn.addEventListener('click', async () => {
  const inputValue = deleteIdInput.value.trim();


  if (!inputValue) {
    console.error('Please enter a valid user ID to delete.');
    return;
  }

  const idToDelete = inputValue;

  const userExists = users.some(user => String(user.id) === String(idToDelete));
  if (!userExists) {
    console.error(`No user found with ID: ${idToDelete}`);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${idToDelete}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error('Failed to delete user. Status:', response.status);
      return;
    }

    
    users = users.filter(user => String(user.id) !== String(idToDelete));
    render(users);
    deleteIdInput.value = '';
    console.log(`User with ID ${idToDelete} successfully deleted.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});