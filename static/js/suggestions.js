const suggestionItem2Html = suggestion => {
  return `
    <li id="suggestion-item">
      <div class="suggested-panel">
        <div id="suggestion-left">
          <img id="suggestion-pic" src=" ${suggestion.thumb_url}" alt="suggested- ${suggestion.username}"/>
          <div id="suggested-user">
            <span id="suggested-username">${suggestion.username}</span>
            <span id="suggested-label">suggested for you</span>
          </div>
        </div>
        <div id="suggestion-right">
          <button class="user-follow" 
          data-userid="${suggestion.id}" 
          onclick="handleToggleFollow(event)"
          aria-label="Follow"
          aria-checked="false">follow</button>
        </div>
      </div>
    </li>
    `;
};

const suggestions2Html = (suggestionItemsHtml) => {
  return `
    <div class="user-suggestions">
      <span id="suggestions-title"> Suggestions for you </span>
      <div class="suggestions-panel">
        <ul class="suggestions-list"> ${suggestionItemsHtml} </ul>
      </div>
    </div>
    `;
}

// fetch data from your API endpoint:
const displaySuggestions = () => {
  fetch('/api/suggestions')
    .then(response => response.json())
    .then(suggestions => {
      const suggestionListHtml = suggestions.map(suggestionItem2Html).join('\n');
      const html = suggestions2Html(suggestionListHtml)
      document.querySelector('.suggestions').innerHTML = html;
    })
};

const createFollowRequest = (toUserId, element) => {
  var postBody = {
    "user_id": toUserId
  };
  fetch("/api/following", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Follow successful ::=", data)
      element.innerHTML = "unfollow";
      element.classList = ""
      element.classList.add("user-unfollow");
      element.setAttribute("data-entryID",data.id)
      element.setAttribute("aria-checked","true")
    });
}

const createUnfollowRequest = element => {
  var deleteURL = `api/following/${element.dataset.entryid}`;
  fetch(deleteURL, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log("Unfollow successful ::=", data);
      element.innerHTML = "follow";
      element.classList = ""
      element.classList.add("user-follow");
      element.removeAttribute("data-entryid");
      element.setAttribute("aria-checked","false")
    });

}

// window.addEventListener("load", function () {
//   displaySuggestions()
// });

function handleToggleFollow(ev) {
  var element = ev.currentTarget;
  if (element.getAttribute("aria-checked") === "false") {
    createFollowRequest(element.dataset.userid, element);
  } else {
    createUnfollowRequest(element)
  }
}

displaySuggestions()