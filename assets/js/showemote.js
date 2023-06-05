const twi = Twi.factory();

twi.useCommands("!");
twi.useChat();
twi.useEmotes();

let showing = false;

function moveRandom(obj) {
  let window_Height = window.innerHeight;
  let window_Width = window.innerWidth;

  let availSpace_V = window_Height - 256;
  let availSpace_H = window_Width - 256;

  var randNum_V = Math.round(Math.random() * availSpace_V);
  var randNum_H = Math.round(Math.random() * availSpace_H);

  obj.style.top = randNum_V + "px";
  obj.style.left = randNum_H + "px";
}

function spawnEmote(emote) {
  const sprite = document.createElement("img");
  const image = emote.url.high || emote.url.mid || emote.url.low;
  console.log(`Displaying emote ${emote.code} from ${image}`);

  sprite.src = image.startsWith("http") ? image : `https:${image}`;
  sprite.style.display = "block";
  sprite.style.position = "fixed";
  sprite.classList.add("emote");
  sprite.classList.add("fade-in");

  moveRandom(sprite);
  document.getElementById("app").appendChild(sprite);
}

twi.addCommand("showemote", (message, _args) => {
  const emote = message.emotes[0];
  if (emote && !showing) {
    spawnEmote(emote);
    showing = true;
    setTimeout(() => {
      showing = false;
      document.getElementById("app").innerHTML = "";
    }, 1000 * 5);
  }
});

// Legacy
function checkForOldLink() {
  const link = window.location.href;

  if (link.includes("=true")) {
      console.log("Legacy link detected.");
      document.body.innerHTML = `
          <div class="error">
              <h1>Uhgg! Sowrry T-T</h1>
              This widget <b>(Showemote)</b> requires a bug-fix update.<br/>
              Visit the following link to generate a new one: <b>https://show-emote.sammwy.com</b>.
          </div>
      `
  }
}

checkForOldLink();