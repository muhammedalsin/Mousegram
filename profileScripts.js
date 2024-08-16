setupUI()


const urlParamas = new URLSearchParams(window.location.search) 
const userId = urlParamas.get("userid")
setupUI() 

let id = userId

getUser()
getPosts()
function getUser(){
  axios.get(baseUrl + `/users/${id}`)
  .then((response) => {
    const user = response.data.data
    
    document.getElementById("main-info-email").innerHTML = user.email
    document.getElementById("main-info-name").innerHTML = user.name
    document.getElementById("main-info-username").innerHTML = user.username
    document.getElementById("main-info-image").src = user.profile_image
    document.getElementById("name-posts").innerHTML = user.username
  
    document.getElementById("comments-count").innerHTML = user.comments_count
    document.getElementById("posts-count").innerHTML = user.posts_count
  })

}


function getPosts() 
{
    

  const baseUrl = "https://tarmeezacademy.com/api/v1";
  axios.get(baseUrl + `/users/${id}/posts`).then((response) => {
    const posts = response.data.data;

    document.getElementById("user-posts").innerHTML = ""

    for (post of posts) {

      const author = post.author
      let postTitle = ""

      let user = getCurrentUser()
      let isMyPost = user != null && post.author.id == user.id
      let editBtnContent = ``


      if(isMyPost){
        editBtnContent = `
        <button class="btn btn-danger ms-2" style="float:right" onclick="deletePostBtnclick('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
        <button class="btn btn-secondary" style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
        `
      }

      if (post.title != null) {

        postTitle = post.title;
      } 
      console.log(post.image);
      let content = `          
      <div class="card shadow my-3" >
        <div class="card-header">
          <img style="width: 40px;" class="border border-1 rounded-circle"  src="${author.profile_image}" alt="post photo">
          <b >@${author.username}</b>
          ${editBtnContent}
        </div>
        <div class="card-body"  onclick="postClicked(${post.id})">
          <img class="w-100" src="${post.image}" alt="nature">
          <h6 class="mt-1" style="color: rgb(159, 159, 159);">${post.created_at}</h6>
          <h5>${postTitle}</h5>
          <p>
            ${post.body}
          </p>
          <hr>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
            <span>
              (${post.comments_count}) Commnets
              <span id="post-tags-${post.id}">
                
              </span>
            </span>
            
          </div>
        </div>
      </div>`;

      document.getElementById("user-posts").innerHTML += content;

      document.getElementById("post-tags-" + post.id).innerHTML = "";
      
      //  todo:
      for (tag of post.tags) {
        let tagsContent = `
          <button class="btn btn-sm rounded-5" style="background-color:gray; color:white">
            ${tag.name}
          </button>
        `;
        document.getElementById("post-tags-" + post.id).innerHTML += tagsContent;
      }
  }
});

}

