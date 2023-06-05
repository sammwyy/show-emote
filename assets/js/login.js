const card = document.getElementById("login-card");
const loginForm = document.getElementById("login-form");

function checkForOldLink() {
    const link = window.location.href;

    if (link.includes("?") && link.includes("username")) {
        card.innerHTML = `
            <div class="error">
                <h1>Uhgg! Sowrry T-T</h1>
                This link has expired, visit <b>https://show-emote.sammwy.com</b> to generate a new one.
            </div>
        `
    }
}

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

    let username = null;
    let providers = [];

    for (const element of loginForm.querySelectorAll("input")) {
        const key = element.getAttribute("name");
        const { checked, value } = element;
        
        if (key == "username") {
            username = value;
        } else if (key == "twitch" || key == "7tv" || key == "bttv" || key == "ffz") {
            if (checked) providers.push(key);
        }
    }

    plausible('Link Generation');
    const url = getOBSUrl([`username=${username}`, `providers=${providers.join(",")}`]);
    const message = `Installation instructions:

1. Create a new source of type "web browser" in your OBS scene.
2. Set the font size to your monitor resolution, for example (1920x1080, 1366x768, etc)
3. In the URL section paste the following link:`
    prompt(message, url);
});

checkForOldLink();