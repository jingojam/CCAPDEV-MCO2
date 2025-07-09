console.log("Login.html!");
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("Form submitted");

    // Get Values
    var fname = document.querySelector("input[name='fname']").value.trim(); //value.trim = removewhitespace
    var lname = document.querySelector("input[name='lname']").value.trim();
    var roleElement = document.querySelector("input[name='role']:checked");
    var role = roleElement ? roleElement.value : null; //if null it goes to Validate
    var DLSUemail = document.querySelector("input[name='DLSUemail']").value.trim();

    if(!isvalidDLSUemail(DLSUemail))
    {
        alert("Use DLSU email!");
        return;
    }
    var password = document.querySelector("input[name='password']").value.trim();
    //Validate via Inspect Element @ Console
    console.log("Collected Data:", { fname, lname, role, DLSUemail, password });

    // Validate for null inputs and returns
    if (!fname || !lname || !role || !DLSUemail || !password) {
        alert("Please fill out all fields and select a role.");
        return;
    }

    // Constructor
    var UserInfo = {
        firstName: fname,
        lastName: lname,
        role: role,
        email: DLSUemail,
        password: password
    };

    console.log("Saving to localStorage:", UserInfo);

    // Save UserInfo Class as a String AS A WHOLE

    //if there are noe users at all, just create an empty object. otherwise load the existing collection
    var users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : {};

    users[UserInfo.email] = UserInfo; //set the email of the user as the key for its attributes

    localStorage.setItem("users", JSON.stringify(users)); //store the user/s in the localStorage

    // localStorage.setItem("UserInfo", JSON.stringify(UserInfo));

    alert("Data saved successfully!");


    // Redirect to testsite/Login
    window.location.href = "Login.html";

    function isvalidDLSUemail(email)
    {
        const domain = "@dlsu.edu.ph";
        return email.toLowerCase().endsWith(domain);
    }

});