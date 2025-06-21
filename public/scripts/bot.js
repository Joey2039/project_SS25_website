class Bot {
  constructor() {
    this.dict = {
      hallo: "Hallo",
      hi: "Hi",
      "guten morgen": "Guten Morgen",
      "guten abend": "Guten Abend",
      "guten nacht": "Guten Nacht",
      "guten tag": "Guten Tag",
      "wie gehts": "Mir geht es gut, danke der Nachfrage!",
    };
  }

  reaction_to_Message(message) {
    const nachricht = message.toLowerCase();
    let inhalt = "Ich versteh gar nichts";

    // Iterate through the dictionary to find a matching response
    for (const key in this.dict) {
      if (nachricht.includes(key)) {
        inhalt = this.dict[key];
        break; // Stop searching once a match is found
      }
    }

    return inhalt; // Return the response
  }
}
