var activePostID = 0;

function comments2Modal(post) {
  var innerhtml = `
  <div class="modal-bg hidden" aria-hidden="true" role="dialog">
  <div class="modal-content">
    <button class="material-icons"
    id="modal-close"
    data-postid = "${post.id}"
    aria-label="Close the modal window" 
    onclick="dismissModal(event);">close</button>
    <section class="all-comments-view">
      <div class="modal-left">
          <img id="modal-image" src="${post.image_url}" alt="image by sheena_johnson">                
      </div>
      <div class="modal-right">
        <div class="modal-user">
            <img id="modal-userimage" src="${post.user.thumb_url}" alt="image by ${post.user.username}">                
            <label id="modal-username">${post.user.username}</label>                
        </div> 
        <div id="modal-divider-line"></div>
        <div class="modal-comments">
          <ul class="modal-comment-list">${allCommentsHtml(post.comments)}</ul>
        </div>               
      </div>
    </section>
    </div>
  </div>
  `;
  return innerhtml;
};

function allCommentsHtml(comments) {
  var commentsHtml = comments.map(comment2ListHtml).join("\n");
  return commentsHtml;
}

function comment2ListHtml(comment) {
  var listItemHtml = `
  <li id="modal-comment-item">
    <div id="modal-comment-left">
      <img id="modal-comment-userimage" src="${comment.user.thumb_url}" alt="profile pic of ${comment.user.username}"> 
      <div id="modal-list-item-comment">  
        <label id="comment-text"> <span id="comment-username">${comment.user.username}</span> ${comment.text} </label>
        <label id="lower-comment"> ${comment.display_time} </label>
      </div>
    </div>
    <button class="material-icons" id="modal-comment-like">favorite_border</button>  
  </li>
  `;
  return listItemHtml
}

function closeModal(postid) {
  var modalElement = document.querySelector(".modal-bg");
  modalElement.classList.add("hidden");
  modalElement.setAttribute("aria-hidden", "true");
  document.body.style.overflowY = "";
  var focusElement = document.querySelector(`#card-id-${postid}`);
  focusElement.querySelector("#view-all-comments").focus();
  document.removeEventListener("keyup", keyPressed);
}

function dismissModal(event) {
  closeModal(event.target.dataset.postid)
}

const keyPressed = keyEvent => {
  var keyID = keyEvent.which || keyEvent.keyCode;
  if(keyID == 27) {
    closeModal(activePostID)
  }
}

// fetch data from your API endpoint:
const displayAllComments = postid => {
  document.addEventListener("keyup", keyPressed);
  fetch(`/api/posts/${postid}`)
    .then((response) => response.json())
    .then((post) => {
      const postListHtml = comments2Modal(post)
      var element = createHTMLElement(postListHtml)
      
      if(document.getElementsByClassName("modal-bg hidden")[0]) {
        var existingComments = document.querySelectorAll(".modal-bg.hidden")[0];
        existingComments.replaceWith(element)
        element.classList.remove("hidden")
        element.setAttribute("aria-hidden", "false");
      } else {
        document.body.appendChild(element);
        var modalElement = document.querySelector(".modal-bg");
        modalElement.classList.remove("hidden")
        modalElement.setAttribute("aria-hidden", "false");
      }
      activePostID = postid
      document.body.style.overflowY = "hidden";
      document.querySelector("#modal-close").focus();
    });
};