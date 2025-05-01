function showNewThreadForm() {
    document.getElementById('new-thread-form').style.display = 'block';
}

function closeNewThreadForm() {
    document.getElementById('new-thread-form').style.display = 'none';
}

function postNewThread() {
    const title = document.getElementById('thread-title').value.trim();
    const content = document.getElementById('thread-content').value.trim();

    if (title && content) {
        const threadContainer = document.getElementById('forum-threads');
        const newThread = document.createElement('div');
        newThread.classList.add('forum-thread');
        newThread.innerHTML = `
        <h3>${title}</h3>
        <p>Posted by You - Last comment: Just now</p>
        <div class="comment-box">
          <h4>Comments:</h4>
          <div class="comment-list">
            <p><strong>You:</strong> ${content}</p>
          </div>
          <div class="add-comment">
            <input type="text" class="comment-input" placeholder="Add a comment...">
            <button class="new-thread-btn comment-btn">Post</button>
          </div>
        </div>
      `;
        threadContainer.prepend(newThread);
        closeNewThreadForm();
        document.getElementById('thread-title').value = '';
        document.getElementById('thread-content').value = '';
        setupCommentButtons(); // re-bind new comment button
    } else {
        alert("Please fill in both fields!");
    }
}

function setupCommentButtons() {
    const buttons = document.querySelectorAll('.comment-btn');
    buttons.forEach(button => {
        button.onclick = function () {
            const input = this.previousElementSibling;
            const commentText = input.value.trim();
            if (commentText) {
                const commentList = this.closest('.comment-box').querySelector('.comment-list');
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>You:</strong> ${commentText}`;
                commentList.appendChild(newComment);
                input.value = '';
                newComment.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert("Comment cannot be empty!");
            }
        };
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setupCommentButtons);