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
        const postContainer = document.getElementById('postContainer');
        const postBody = document.createElement('div');
        const postTitle = document.createElement('p');
        const postContent = document.createElement('p');
        const postImage = document.createElement('img');
    });
}