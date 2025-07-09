// Drop-Down for the profile picture
function myFunction() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}

window.onclick = function(e) {
    if (!e.target.closest('.dropbtn') && !e.target.closest('.dropdown-menu')) {
        document.getElementById("dropdownMenu").classList.remove("show");
    }
}

addEventListener("DOMContentLoaded", function() {
    const deleteProfileButton = document.getElementById("delete-button");
    const editProfileButton = document.getElementById("edit-button");
    const searchButton = document.getElementById("search");
    
    if(deleteProfileButton){
        deleteProfileButton.addEventListener("click", function() {
            alert("User Profile Successfully Deleted!");
            window.location.href = "../authentication/Login.html";
        });
    }
    
    if(editProfileButton){
        editProfileButton.addEventListener("click", function() {
            const userData = JSON.parse(localStorage.getItem('thisUser'));

                if (userData.email === "rupert_tabilin@dlsu.edu.ph") {
                    window.location.href = "edit_profile1.html";
                } else if(userData.email === "liam_ancheta@dlsu.edu.ph"){
                    window.location.href = "edit_profile2.html";
                } else if(userData.email === "christian_arano@dlsu.edu.ph"){
                    window.location.href = "edit_profile3.html";
                } else if(userData.email === "juan_menchaca@dlsu.edu.ph"){
                    window.location.href = "edit_profile4.html";
                }
        });
    }

    if(searchButton){
        searchButton.addEventListener("submit", function(event) {
            event.preventDefault();
            
            let searchQuery = document.querySelector("#search-bar").value;
            const userData= localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
            let [firstName, lastName] = searchQuery.split(" ");
            
            let searchResult = Object.values(userData).filter(user => user.firstName.toLowerCase() === firstName.toLowerCase() && user.lastName.toLowerCase() === lastName.toLowerCase());

            if(searchResult.length > 0){
                if(firstName === "Rupert" && lastName === "Tabilin"){
                    window.location.href = "profile1.html";
                } else if(firstName === "Liam" && lastName === "Ancheta"){
                    window.location.href = "profile2.html";
                } else if(firstName === "Christian" && lastName === "Arano"){
                    window.location.href = "profile3.html";
                } else if(firstName === "Juan" && lastName === "Menchaca"){
                    window.location.href = "profile4.html";
                }
                
            } else{
                console.log("not found");
            }
        });
    }
});
