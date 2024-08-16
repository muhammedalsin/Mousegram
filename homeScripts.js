let currentPage = 1
    let lastPage = 1

    //===== INFINITE SCROLL =======//
    window.addEventListener("scroll", function(){
        
        const endOfPage = window.innerHeight + (window.pageYOffset + 1) >= document.body.scrollHeight;
        
        console.log(window.innerHeight, (window.pageYOffset + 1), document.body.scrollHeight)
        
        if(endOfPage && currentPage < lastPage)
        {
            currentPage = currentPage + 1
            getPosts(false, currentPage)
            
        }

    });
    //=====// INFINITE SCROLL //=======//
// "http://localhost:3030/api/v1/posts"
// 
    
    getPosts()

function userClicked(userId){
  window.location = "profile.html?userid="+userId
}





function getPosts(reload= true , page = 1) 
{

  if(reload == true) {
    document.getElementById("posts").innerHTML = ""
    
  }
  
  toogleLoader(true)  
  const baseUrl = "https://tarmeezacademy.com/api/v1";
    axios.get(baseUrl + `/posts?limit=2&page=${page}`).then((response) => {
      toogleLoader(false)
      const posts = response.data.data;
      lastPage = response.data.meta.last_page
      
      let postTitle = "";
      for (post of posts) {

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
        let content = `          
        <div class="card shadow my-3" >
          <div class="card-header" >
          <div onclick="userClicked(${post.author.id})">
            <img style="width: 40px;" class="border border-1 rounded-circle"  src="${post.author.profile_image}" alt="post photo">
            <b style="cursor:pointer">@${post.author.username}</b>
          </div>
            
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
        document.getElementById("posts").innerHTML += content;

        document.getElementById("post-tags-" + post.id).innerHTML = "";
        
        //  todo:
        for (tag of post.tags) {
          let tagsContent = `
            <button class="btn btn-sm rounded-5" style="background-color:gray; color:white">
              ${tag.name}
            </button>
          `;
          document.getElementById("post-tags-" + post.id).innerHTML +=
            tagsContent;
        }
      }
  });

}


function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`

}



getPosts()


function addButtonClick() {

  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value = ""
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"

  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""

  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}

