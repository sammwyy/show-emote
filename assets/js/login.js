const loginForm = document.getElementById("login-form");

function getBaseURL() {
    const current = window.location.href;
    const url = current.split("/");
    url.pop();
    return url.join("/") + "/widget.html?";
}

function getOBSUrl(params = []) {
    return getBaseURL() + params.join("&");
}

loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const params = [];

    for (const element of loginForm.querySelectorAll("input")) {
        const type = element.getAttribute("type");
        const key = element.getAttribute("name");
        let value = null;

        if (type == "text") {
            value = element.value;
        } else if (type == "checkbox") {
            value = element.checked;
        } else {
            continue;
        }
        
        params.push(key + "=" + value);
    }

    const url = getOBSUrl(params);
    const message = `Installation instructions:

1. Create a new source of type "web browser" in your OBS scene.
2. Set the font size to your monitor resolution, for example (1920x1080, 1366x768, etc)
3. In the URL section paste the following link:`
    prompt(message, url);
});