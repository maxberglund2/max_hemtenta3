fetch('/isAdmin', { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    isAdmin(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch('/postViewer', { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    postViewer(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

const adminBtn = document.getElementById('adminLink');
adminBtn.style.display = "none";
const isAdmin = (annswer) => {
  if (annswer === 'Admin') {
    adminBtn.style.display = "inline";
  }
}

const postViewer = (data) => {
  console.log(data)
    data.forEach(post => {
        const outerContainer = document.getElementById('postContainer');
        const card = document.createElement('div');
        const postBody = document.createElement('div');
        const postTitle = document.createElement('h5');
        const postContent = document.createElement('p');
        const postTime = document.createElement('p');
        const smallText = document.createElement('small');
        const postImage = document.createElement('img');

        postContent.style = 'white-space: pre-line;';
        postImage.src = './uploads/' + post.image;
        postImage.alt = 'Post Image'; 
        postImage.style = "max-height:500px;";

        card.classList.add('card', 'm-5');
        postBody.classList.add('card-body');
        postTitle.classList.add('card-title');
        postContent.classList.add('card-text');
        postTime.classList.add('card-text');
        smallText.classList.add('text-muted');

        postImage.classList.add('card-img-bottom');

        postTitle.textContent = `${post.title}`;
        postContent.textContent = `${post.content}`;
        smallText.textContent = `${post.createdAt.split('T')[0]}`;

        outerContainer.appendChild(card);

        card.appendChild(postBody);
        card.appendChild(postImage);

        postBody.appendChild(postTitle);
        postBody.appendChild(postContent);
        postBody.appendChild(postTime);

        postTime.appendChild(smallText);
    });
}