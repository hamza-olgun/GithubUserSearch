const searchHistoryKey = 'searchHistory';
let searchHistory = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];

window.onload = function() {
    renderSearchHistory();
};

function search() {
    const username = document.getElementById('searchInput').value.trim();

    fetch(`https://api.github.com/users/${username}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            showProfile(data);
            addToSearchHistory(username);
            fetch(`https://api.github.com/users/${username}/repos`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(repoData) {
                    showRepos(repoData);
                })
                .catch(function(error) {
                    console.error('Error fetching user repos:', error);
                });
        })
        .catch(function(error) {
            console.error('Error fetching user data:', error);
        });
}

function showProfile(user) {
    const profile = document.getElementById('profile');
    profile.innerHTML = `
        <div>
            <img src="${user.avatar_url}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
            <h2>${user.login}</h2>
            <p><strong>Name:</strong> ${user.name ? user.name : 'N/A'}</p>
            <p><strong>Location:</strong> ${user.location ? user.location : 'N/A'}</p>
            <p><strong>Bio:</strong> ${user.bio ? user.bio : 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email ? user.email : 'N/A'}</p>
        </div>
    `;
}

function showRepos(repos) {
    const repoSection = document.getElementById('repos');
    let repoTable = `
        <div>
            <h2>User Repositories</h2>
            <table>
                <tr>
                    <th>Repository Name</th>
                    <th>Stars</th>
                    <th>Forks</th>
                </tr>
    `;
    repos.forEach(function(repo) {
        repoTable += `
            <tr>
                <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
                <td>${repo.stargazers_count}</td>
                <td>${repo.forks_count}</td>
            </tr>
        `;
    });
    repoTable += `
            </table>
        </div>
    `;
    repoSection.innerHTML = repoTable;
}

function clearScreen() {
    document.getElementById('profile').innerHTML = '';
    document.getElementById('repos').innerHTML = '';
}

function addToSearchHistory(username) {
    searchHistory.push(username);
    localStorage.setItem(searchHistoryKey, JSON.stringify(searchHistory));
    renderSearchHistory();
}

function renderSearchHistory() {
    const searchHistoryElement = document.getElementById('searchHistory');
    searchHistoryElement.innerHTML = '';
    searchHistory.forEach(function(username) {
        const searchItem = document.createElement('div');
        searchItem.textContent = username;
        searchHistoryElement.appendChild(searchItem);
    });
}

function clearSearchHistory() {
    searchHistory = []; 
    localStorage.removeItem(searchHistoryKey);
    renderSearchHistory(); 
}
