
// Define API base URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Global object to handle functions with presumed data availability
const postManager = {
    async fetchPosts(userId) {
        if (!userId) throw new Error("User ID is required to fetch posts.");
        const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    },

    async createPost(postData) {
        if (!postData || !postData.title || !postData.body) throw new Error("Complete post data is required.");
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to create post');
        }
        return response.json();
    },

    async updatePost(postId, updateData) {
        if (!postId || !updateData || !updateData.title || !updateData.body) throw new Error("Post ID and updated data are required.");
        const response = await fetch(`${API_BASE_URL}/${postId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to update post');
        }
        return response.json();
    },

    async deletePost(postId) {
        if (!postId) throw new Error("Post ID is required to delete a post.");
        const response = await fetch(`${API_BASE_URL}/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
        return response.json();  // Note: DELETE may not return a body depending on the API
    },

    async patchPost(postId, dataToUpdate) {
        if (!postId || !dataToUpdate) throw new Error("Post ID and data to update are required.");
        const response = await fetch(`${API_BASE_URL}/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify(dataToUpdate),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to patch post');
        }
        return response.json();
    }
};

// UI functions
function clearPostsList() {
    document.getElementById('postsList').innerHTML = '';
}

function displayPosts(posts) {
    const postsList = document.getElementById('postsList');
    posts.forEach(post => {
        const li = document.createElement('li');
        li.textContent = `${post.title}: ${post.body}`;
        postsList.appendChild(li);
    });
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer'); // Assume there's an error container in your HTML
    errorContainer.textContent = message;
    errorContainer.style.display = 'block'; // Show the error container
}

function alertMessage(message) {
    alert(message);
}

// Application logic
async function verifyFunction(func, ...args) {
    try {
        return await func(...args);
    } catch (error) {
        console.error(`Error executing ${func.name}:`, error);
        throw error; // Rethrow to handle specific errors in calling functions
    }
}

async function loadPosts(userId) {
    try {
        clearPostsList();
        const posts = await verifyFunction(postManager.fetchPosts, userId);
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        displayError('Unable to load posts. Please try again later.');
    }
}

async function handleCreatePost(postData) {
    try {
        await verifyFunction(postManager.createPost, postData);
        alertMessage('Post created successfully!');
        loadPosts(postData.userId);
    } catch (error) {
        console.error('Error creating post:', error);
        displayError('Failed to create a new post. Please check your data and try again.');
    }
}

async function handleUpdatePost(postId, title, body) {
    try {
        const updatedPost = await verifyFunction(postManager.updatePost, postId, { title, body });
        alertMessage(`Post updated successfully! New Title: "${updatedPost.title}", New Body: "${updatedPost.body}"`);
        loadPosts(updatedPost.userId); // Assuming the updated post includes userId or use a fixed value if necessary
    } catch (error) {
        console.error('Error updating post:', error);
        displayError('An error occurred while updating the post.');
    }
}

async function handleDeletePost(postId) {
    try {
        await verifyFunction(postManager.deletePost, postId);
        alertMessage('Post deleted successfully!');
        loadPosts(1); // Assuming user ID is 1 for demonstration
}

