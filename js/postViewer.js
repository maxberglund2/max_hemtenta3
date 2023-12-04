fetch('/postViewer', { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    postViewer(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

const postViewer = (data) => {
    data.forEach(post => {
        const outerContainer = document.getElementById('postContainer');
        const postBody = document.createElement('div');
        const postUpperBody = document.createElement('div');
        const postTitle = document.createElement('p');
        const postContent = document.createElement('p');
        const postTimeCon = document.createElement('p');
        const postTimeText = document.createElement('small');
        const postImage = document.createElement('img');

        
    });
}

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
  <img src="..." class="card-img-bottom" alt="...">
</div>