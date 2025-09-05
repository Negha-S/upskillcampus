const blogForm = document.getElementById("blogForm");
const blogsDiv = document.getElementById("blogs");
const searchInput = document.getElementById("search");

// Preview elements
const previewTitle = document.getElementById("previewTitle");
const previewContent = document.getElementById("previewContent");

const API_URL = "/blogs"; // backend API

// -------------------- FUNCTIONS --------------------

// Live preview
document.getElementById("title").addEventListener("input", e => {
  previewTitle.textContent = e.target.value || "[Title]";
});
document.getElementById("content").addEventListener("input", e => {
  previewContent.textContent = e.target.value || "[Content will appear here...]";
});

// Fetch blogs and display them
async function loadBlogs(searchText = "") {
  blogsDiv.innerHTML = "";
  const res = await fetch(API_URL);
  let blogs = await res.json();

  // Search filter
  if (searchText) {
    blogs = blogs.filter(b =>
      b.title.toLowerCase().includes(searchText.toLowerCase()) ||
      b.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  blogs.forEach(blog => {
    const div = document.createElement("div");
    div.className = "blog";
    div.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.content}</p>
      <small>🕒 ${new Date(blog.createdAt).toLocaleString()}</small>
      <br><br>
      <button onclick="deleteBlog('${blog._id}')">🗑 Delete</button>
      <button onclick="editBlog('${blog._id}', '${blog.title}', '${blog.content}')">✏ Edit</button>
    `;
    blogsDiv.appendChild(div);
  });
}

// Add new blog
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  blogForm.reset();
  previewTitle.textContent = "[Title]";
  previewContent.textContent = "[Content will appear here...]";
  loadBlogs();
});

// Delete blog
async function deleteBlog(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadBlogs();
}

// Edit blog
async function editBlog(id, oldTitle, oldContent) {
  const newTitle = prompt("Enter new title:", oldTitle);
  const newContent = prompt("Enter new content:", oldContent);

  if (newTitle && newContent) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });
    loadBlogs();
  }
}

// Search blogs live
searchInput.addEventListener("input", e => loadBlogs(e.target.value));

// Load blogs when page opens
loadBlogs();
