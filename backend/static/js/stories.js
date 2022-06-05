const storyItem2Html = story => {
    return `
    <li>
        <div>
            <div id = "image-background">
                <img src="${ story.user.thumb_url }" class="story-pic" alt="profile pic for ${ story.user.username }" />
            </div>
            <p>${ story.user.username }</p>
        </div>
    </li>
    `;
};

const story2Html = (storyItemsHtml) => {
    return `<ul> ${ storyItemsHtml } </ul>`;
}

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const storyListhtml = stories.map(storyItem2Html).join('\n');
            const html = story2Html(storyListhtml)
            document.querySelector('.stories').innerHTML = html;
        })
};

displayStories()
