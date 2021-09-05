class Twi {
  constructor(channelName) {
    this.channelName = channelName;
    this.emotes = [];
    this.emoteSet = new Map();
    this.events = new Map();
    this.commands = new Map();
  }

  addCommand(commandName, handler) {
    this.commands.set(commandName, handler);
  }

  runCommand(commandName, ...args) {
    const command = this.commands.get(commandName);
    if (command) {
      command(...args);
    }
  }

  emit(eventName, ...args) {
    const handlers = this.events.get(eventName) || [];
    for (let handler of handlers) {
      handler(...args);
    }
  }

  on(eventName, callback) {
    const handlers = this.events.get(eventName) || [];
    handlers.push(callback);
    this.events.set(eventName, handlers);
  }

  trimEmotes(string = "") {
    const parts = string.split(" ");
    const emotes = [];

    for (let part of parts) {
      const emote = this.emoteSet.get(part);
      if (emote) {
        emotes.push(emote);
      }
    }

    return emotes;
  }

  discoverOtherChannelEmotes(emotesObject) {
    const emotes = Object.keys(emotesObject || {});
    const firstEmote = emotes[0];

    if (firstEmote) {
      let cdn = {};

      if (firstEmote.includes("emotesv2")) {
        cdn = {
          low: `https://static-cdn.jtvnw.net/emoticons/v2/${firstEmote}/default/dark/1.0`,
          medium: `https://static-cdn.jtvnw.net/emoticons/v2/${firstEmote}/default/dark/2.0`,
          high: `https://static-cdn.jtvnw.net/emoticons/v2/${firstEmote}/default/dark/3.0`,
        };
      } else {
        cdn = {
          low: `https://static-cdn.jtvnw.net/emoticons/v1/${firstEmote}/1.0`,
          medium: `https://static-cdn.jtvnw.net/emoticons/v1/${firstEmote}/2.0`,
          high: `https://static-cdn.jtvnw.net/emoticons/v1/${firstEmote}/3.0`,
        };
      }

      return {
        type: "twitch",
        cdn,
        id: firstEmote,
        code: "unknown",
        owner: "unknown",
      };
    }
  }

  useChat() {
    this.chat = new tmi.Client({
      options: { debug: false, messagesLogLevel: "info" },
      connection: { reconnect: true },
      channels: [this.channelName],
    });

    this.chat.on("message", (channel, tags, message, self) => {
      this.emit("message", {
        user: {
          name: tags.username,
          isStreamer: tags.username.toLowerCase() == this.channelName,
        },
        content: message,
        channel,
        emotes: [
          ...this.trimEmotes(message),
          this.discoverOtherChannelEmotes(tags.emotes),
        ],
      });
    });

    this.chat.connect().catch(console.error);
  }

  useCommands(prefix = "!") {
    this.on("message", (message) => {
      if (message.content.startsWith(prefix)) {
        const args = message.content.split(" ");
        const command = args.shift().split(prefix)[1];
        this.runCommand(command, message, args);
      }
    });
  }

  async useEmotes() {
    let url = Twi.emoteUrlFactory();
    const request = await fetch(url);
    if (request.status == 200) {
      const body = await request.json();
      this.emotes = body.emotes;
      this.emoteSet.clear();
      for (let emote of this.emotes) {
        this.emoteSet.set(emote.code, emote);
      }
    }
  }
}

Twi.getEmoteAPIEndpoint = () => {
  return "https://api.enhancedtwitch.com/v2/emotes";
};

Twi.getQueries = () => {
  const rawQuery = new URLSearchParams(window.location.search);
  const query = Object.fromEntries(rawQuery);
  return query;
};

Twi.emoteUrlFactory = () => {
  const queries = Twi.getQueries();
  let url = null;

  for (let queryKey of Object.keys(queries)) {
    const queryValue = queries[queryKey];
    if (!url) {
      url = "?";
    } else {
      url += "&";
    }
    url += queryKey + "=" + queryValue;
  }

  return Twi.getEmoteAPIEndpoint() + url;
};

Twi.factory = () => {
  const query = Twi.getQueries();
  const { username } = query;

  const loginForm = document.getElementById("login-form");
  const app = document.getElementById("app");

  if (username) {
    app.style.display = "block";
    return new Twi(username);
  } else {
    loginForm.style.display = "block";
  }
};
