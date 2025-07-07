const routes = {
    "/" : "/public/Index/index.html",
    "/login" : "/public/STUDENT/authentication/Login.html",
    "/technician" : "/public/LABTECH/reservations/reserve_home.html",
    "/student" : "/public/STUDENT/reservations/reserve_home.html"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("log-in").innerHTML = html;

    window.route = route;
};

window.onpopstate = handleLocation;

window.addEventListener("DOMContentLoaded", handleLocation);