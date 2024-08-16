const baseUrl = "https://tarmeezacademy.com/api/v1";


function profileClicked(){
  const user = getCurrentUser()
  window.location = `profile.html?userid=${user.id}`
}

function createNewPostClicked(){
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""



  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0]
  const token =localStorage.getItem("token");

  // todo: 
  let formData = new FormData()
  formData.append("title",title)
  formData.append("body",body)
  formData.append("image",image)

  let url =''
  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization":`Bearer ${token}`
  }
  toogleLoader(true)
  if(isCreate){

    url = baseUrl + "/posts";
    axios.post(url, formData,{
      headers: headers
    }).then((response) => {
      
  
  
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showALert("New Post Has Been Created", "success")
      // setupUI();
      getPosts()
    })
    .catch((err)=>{
      const message = err.response.data.message
      showALert(message, "danger")
    }).finally(()=>{
      toogleLoader(false)
    })
    
  }
  else{

    formData.append("_method","put")
    url = baseUrl + "/posts/"+postId;
    axios.post(url, formData,{
      headers: headers
    }).then((response) => {
      
  
  
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showALert("the Edit", "success")
      // setupUI();
      getPosts()
    })
    .catch((err)=>{
      const message = err.response.data.message
      showALert(message, "danger")
    })
  }

  getPosts()
}


function editPostBtnClicked(postObject) {

  let post = JSON.parse(decodeURIComponent(postObject))
  

  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-modal-title").innerHTML = "Edit Post"

  document.getElementById("post-title-input").value = post.title
  document.getElementById("post-body-input").value = post.body

  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}




function deletePostBtnclick(postObject) {

  let post = JSON.parse(decodeURIComponent(postObject))

  

  document.getElementById("delete-post-id-input").value = post.id


  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
  postModal.toggle()
}
function confirmPostDelete() {

  const postId = document.getElementById("delete-post-id-input").value

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization":`Bearer ${token}`
  }
  toogleLoader(true)
  const url = baseUrl + "/posts/"+postId;
  axios.delete(url, {
    headers:headers
  }).then((response) => {

    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showALert("The Post Has Been Successfully", "success")
    getPosts()
    
  }).catch((err)=>{
    console.log(err);
    const message = err.response.data.message
    showALert(message,"danger")
  }).finally(()=>{
    toogleLoader(false)
  })
  
}






setupUI();

  


function loginBtnClicked() {
  const username = document.getElementById("recipient-name").value;
  const password = document.getElementById("recipient-password").value;

  let params = {
    username: username,
    password: password,
  };
  toogleLoader(true)
  const url = baseUrl + "/login";
  axios.post(url, params).then((response) => {
    
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    
    showALert("Logged in successfully", "success")
    

  
    setupUI();
  }).catch((err)=>{
    showALert(err.response.data.message, "danger")
  }).finally(()=>{
    toogleLoader(false)
  })
}

function registerBtnClicked() {
  
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData()
  formData.append("name",name)
  formData.append("username",username)
  formData.append("password",password)
  formData.append("image",image)

  const url = baseUrl + "/register";

  const headers = {
    "Content-Type": "multipart/form-data"
  }
  toogleLoader(true)
  axios.post(url, formData, {
    headers: headers
  })
  .then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("register-modal");

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    
    showALert("New User Registered Successfully", "success")
    setupUI();
  }).catch((err)=> {

    
    showALert(err.response.data.message, "danger")
    getPosts()
    
  }).finally(()=>{
    toogleLoader(false)
  })
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  showALert("Logged out successfully", "success")
  setupUI();
}



function showALert(message, type){
  const alertPlaceholder = document.getElementById('show-alerts')

  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  alert(message, type)

  setTimeout(() => {
    //  todo:
    // const alertToHide = bootstrap.Alert.getOrCreateInstance('#show-alerts')
    // alertToHide.close()
  }, 1500);
}






setupUI();
function setupUI() {
  
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const addBtn = document.getElementById("add-btn")
  const navUsername = document.getElementById("nav-username")
  const navImage = document.getElementById("nav-image")

  const addCommentDiv = document.getElementById("add-commet-div") 


  
  if (token == null) {

  
    
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    
    
    navUsername.innerHTML = ""
    navImage.src = ""
    // addCommentDiv.style.display = "none"
  } else {

    // addCommentDiv.style.display = "block"
    
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";

    logoutBtn.style.display = "block";


    const user =  getCurrentUser()
    navUsername.innerHTML = user.username
    navImage.src = user.profile_image
    
  }

      
        
}


function getCurrentUser(){
  let user = null
  const storageUser = localStorage.getItem("user")
  if(storageUser != null){
    user = JSON.parse(storageUser)
  }
  else {
    user = null
  }
  return user
}

function toogleLoader(show = true){
  if(show){
    document.getElementById("loder").style.visibility = "visible"
  }else {
    document.getElementById("loder").style.visibility = "hidden"
  }
}