const profile2Html = profile => {
    return `
    <img id="profile-pic" src="${ profile.thumb_url }" alt="user picture"/>
    <label id="profile-username"> ${ profile.username } </label>
    `;
};


// fetch data from your API endpoint:
const displayProfile = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            const html = profile2Html(profile)
            document.querySelector('.user-profile').innerHTML = html;
        })
};

window.addEventListener("load", function(){
    displayProfile()
  });