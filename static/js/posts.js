function postItem2Html(post) {
  var innerhtml = `
    <li class="card-item" id="card-id-${post.id}">
      <div class="cardview">
        <div class="card-header">
          <label id="card-publisher"> ${post.user.username} </label>
          <span class="material-icons" > more_horiz </span>
        </div>
        <img id="card-image" src="${post.image_url}" alt="image by ${post.user.username
    }" />
        <div class="card-details">
          <div class="post-options">
            ${setupLikeLOptionPostUI(post)}
            ${setupLikeROptionPostUI(post)}
          </div>

          <label id="likes-count">${post.likes.length} ${post.likes.length === 1 ? "like" : "likes"}</label>

          <div class="card-caption">
            <span id="caption-username">${post.user.username}</span>
            <span id="caption-text">${post.caption}</span>
            <label id="caption-more"><a href=""> more</a></label>
          </div>
          <span id="card-date">${post.display_time}</span>
          ${postComments2Html(post.comments,post.id)}
        </div>
        
        <div id="post-divider-line"></div>

        <div class="post-user-comments">
          <div id="card-comment-feature">
            <span id="comment-emoji" class="material-icons">sentiment_satisfied_alt</span>
            <input class="post-comment" id="post-comment-${post.id}" type="text" placeholder="Add a comment ...">
          </div>
          <button id="comment-publish"
          data-postid = ${post.id}
          onclick="handlePostingComment(event)">Post</button>
        </div>
      </div>
    </li>
    `;
  return innerhtml;
};

const postComments2Html = (comments,postID) => {
  str = "";
  if (comments.length > 1) {
    str += `
        <label id="view-all-comments" 
        data-postid="${postID}"
        onclick="showAllComments(event)">View all ${comments.length} comments</label> 
        <div id="post-comment-card">
          <span id="comment-username">${comments.at(-1).user.username}</span>
          <span id="comment-text">${comments.at(-1).text}</span>
        </div>
        <span id="comment-date">${comments.at(-1).display_time}</span>    
        `;
  } else if(comments.length == 1) {
    str += `
      <div id="post-comment-card">
        <span id="comment-username">${comments.at(-1).user.username}</span>
        <span id="comment-text">${comments.at(-1).text}</span>
      </div>    
      `;
  } else {
    return str;
  }
  return str;
};

const post2Html = (postItemsHtml) => {
  return `<ul class="card-list"> ${postItemsHtml} </ul>`;
};

function setupLikeLOptionPostUI(postDetails) {
  var leftOptionsHTML = "";
  if (typeof postDetails.current_user_like_id !== "undefined") {
    leftOptionsHTML +=
      `
    <div id="post-options-left">
      <button id="card-liked" 
      aria-label="Like Post"
      aria-checked="true" 
      class="material-icons post-liked"
      data-postid = "${postDetails.id}"
      data-entryid = "${postDetails.current_user_like_id}" 
      onclick="handlePostLike(event)">favorite</button>
    `
  } else {
    leftOptionsHTML +=
      `
    <div id="post-options-left">
      <button id="card-noliked" 
      aria-label="Like Post"
      aria-checked="false" 
      class="material-icons"
      data-postid = "${postDetails.id}" 
      onclick="handlePostLike(event)">favorite_border</button>
    `
  }

  leftOptionsHTML +=
    `
    <button id="card-comment" class="material-icons">chat_bubble_outline</button>
    <button id="card-message" class="material-icons">send</button>
  </div>
  `
  return leftOptionsHTML;

}

function setupLikeROptionPostUI(postDetails) {
  var rightOptionsHTML = "";
  if (typeof postDetails.current_user_bookmark_id !== "undefined") {
    rightOptionsHTML +=
      `
    <div id="post-options-right">
      <button id="card-bookmarked" 
      class="material-icons post-bookmarked"
      aria-label="Bookmark Post"
      aria-checked="true"  
      data-postid = ${postDetails.id}
      data-bookmarkentryid = "${postDetails.current_user_bookmark_id}" 
      onclick="handlePostBookmark(event)">bookmark</button>
    </div>
    `
  } else {
    rightOptionsHTML +=
      `
    <div id="post-options-right">
      <button id="card-unbookmarked" 
      class="material-icons"
      aria-label="Bookmark Post"
      aria-checked="false"  
      data-postid= "${postDetails.id}"
      onclick="handlePostBookmark(event)">bookmark_border</button>
    </div>
    `
  }
  return rightOptionsHTML;
}


function configureLikedPost(eventTarget) {
  console.log(eventTarget)
  var icon;
  if (eventTarget !== undefined) {
    icon = eventTarget.target;

  } else {
    icon = document.querySelector("#card-noliked");
  }
  icon.setAttribute("id", "card-liked")
  icon.classList = ""
  icon.classList.add("material-icons", "post-liked")
  icon.innerHTML = "favorite";
  icon.style.color = "red";
  icon.setAttribute("aria-checked", "true")
}

function configureNotLikedPost(eventTarget) {
  var icon = document.querySelector("#card-liked");
  if (eventTarget !== undefined) {
    icon = eventTarget.target;
  }
  icon.setAttribute("id", "card-noliked")
  icon.classList = ""
  icon.classList.add("material-icons")
  icon.innerHTML = "favorite_border";
  icon.style.removeProperty("color");
  icon.setAttribute("aria-checked", "false")
}

function configurePostBookmark(eventTarget) {
  var icon = document.querySelector("#card-unbookmarked")
  if (eventTarget !== undefined) {
    icon = eventTarget.target;
  }
  icon.id = "card-bookmarked"
  icon.classList = ""
  icon.classList.add("material-icons", "post-bookmarked")
  icon.innerHTML = "bookmark";
  icon.style.color = "black";
  icon.setAttribute("aria-checked", "true");
}

function configureNoBookmark(eventTarget) {
  var icon = document.querySelector("#card-bookmarked")
  if (eventTarget !== undefined) {
    icon = eventTarget.target;
  }
  icon.id = "card-unbookmarked"
  icon.innerHTML = "bookmark_border";
  icon.style.removeProperty("color");
  icon.setAttribute("aria-checked", "false");
}

function handlePostLike(ev) {
  if (ev.currentTarget.getAttribute("aria-checked") === "true") {
    console.log("User action : Like Post -> Unlike Post");
    deleteLikeOnPost(ev);
  } else {
    console.log("User action : Unlike Post -> Like Post");
    addLikeOnPost(ev);
    // reloadThePost(ev)
  }
}

function showAllComments(ev) {
  var postID = ev.currentTarget.dataset.postid
  displayAllComments(postID)
}

function handlePostBookmark(ev) {
  if (ev.currentTarget.getAttribute("aria-checked") === "true") {
    console.log("User action : Bookmarked -> Remove Bookmark");
    deleteBookmarkOnPost(ev);
  } else {
    console.log("User action : Add to Bookmarks");
    addBookmarkOnPost(ev)
  }
}

function addLikeOnPost(postDetails) {
  var postID = postDetails.currentTarget.dataset.postid
  var bodyData = {
    "post_id": postID
  };

  fetch("api/posts/likes/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      reloadThePost(postDetails)
    });
}

function reloadThePost(postDetails) {
  var postid = postDetails.target.dataset.postid
  fetch(`api/posts/${postid}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var post2Html = postItem2Html(data)
      var element = document.getElementById(`card-id-${postid}`)
      element.replaceWith(createHTMLElement(post2Html));
    });

}

function deleteLikeOnPost(postDetails) {
  var tableEntryId = postDetails.currentTarget.dataset.entryid
  fetch(`api/posts/likes/${tableEntryId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      configureNotLikedPost(postDetails);
      reloadThePost(postDetails)
    });
}


function addBookmarkOnPost(postDetails) {
  var postID = postDetails.currentTarget.dataset.postid
  var bodyData = {
    "post_id": postID
  };

  fetch("api/bookmarks/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      reloadThePost(postDetails)
    });
}

function deleteBookmarkOnPost(postDetails) {
  var tableEntryId = postDetails.currentTarget.dataset.bookmarkentryid
  fetch(`api/bookmarks/${tableEntryId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      reloadThePost(postDetails)
    });
}

function handlePostingComment(event) {
  var postid = event.currentTarget.dataset.postid;
  var inputComment = document.getElementById(`post-comment-${postid}`).value;
  console.log(inputComment)
  const bodyData = {
    "post_id": postid,
    "text": inputComment
  };

  fetch("api/comments", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      reloadThePost(event)
    });
}



// fetch data from your API endpoint:
const displayPosts = () => {
  fetch("/api/posts/?limit=10")
    .then((response) => response.json())
    .then((posts) => {
      const postListHtml = posts.map(postItem2Html).join("\n");
      const html = post2Html(postListHtml);
      document.querySelector(".posts").innerHTML = html;
    });
};


// window.addEventListener("load", function () {
//   displayPosts();
// });
