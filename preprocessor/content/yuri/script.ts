class Link {
  name: string;
  link: string;

  constructor(name: string, link: string) {
    this.name = name;
    this.link = link;
  }
}

class Source {
  licenced: boolean;
  link: Link;

  constructor(licenced: boolean, link: Link) {
    this.licenced = licenced;
    this.link = link;
  }
}

class Manga {
  title: string;
  image: string;
  finished: boolean;
  synopsis: string;
  comments: string;
  source: Source;

  constructor(
    title: string,
    image: string,
    finished: boolean,
    synopsis: string,
    comments: string,
    source: Source
  ) {
    this.title = title;
    this.image = image;
    this.finished = finished;
    this.synopsis = synopsis;
    this.comments = comments;
    this.source = source;
  }

  to_html(element: HTMLElement) {
    var gridDiv = document.createElement("div");
    gridDiv.className = "gridDiv";

    var split_path = this.image.split(".");
    var extention = split_path.pop();
    var body = split_path.join(".");

    // Image
    var wide_source = document.createElement("source");
    wide_source.media = "(orientation: portrait)";
    wide_source.srcset = `${body}_wide.${extention}`;

    var tall_source = document.createElement("source");
    tall_source.media = "(orientation: landscape)";
    tall_source.srcset = `${body}_tall.${extention}`;

    var img = document.createElement("img");
    img.src = "";
    img.setAttribute("width", "100%");
    img.alt = "";

    var picture = document.createElement("picture");
    picture.appendChild(wide_source);
    picture.appendChild(tall_source);
    picture.appendChild(img);

    var imageDiv = document.createElement("div");
    imageDiv.className = "imgDiv";
    imageDiv.appendChild(picture);
    gridDiv.appendChild(imageDiv);

    // Title
    var finished_str = this.finished ? "Finished" : "Ongoing";
    var title = document.createElement("h2");
    title.innerHTML = `<b>${this.title} (${finished_str})</b>`;
    var titleDiv = document.createElement("div");
    titleDiv.className = "titleDiv";
    titleDiv.appendChild(title);
    gridDiv.appendChild(titleDiv);

    // info
    var synopsisTitle = document.createElement("h3");
    synopsisTitle.innerHTML = "<em>Synopsis</em>";
    var synopsis = document.createElement("p");
    synopsis.innerHTML = this.synopsis.replace(/\n/g, "<br>");

    var commentsTitle = document.createElement("h3");
    commentsTitle.innerHTML = "<em>Comments</em>";
    var comments = document.createElement("p");
    comments.innerHTML = this.comments.replace(/\n/g, "<br>");

    let link = `<a target="_blank" class="listLink" href="${this.source.link.link}">${this.source.link.name}</a>`;

    if (this.source.licenced) {
      comments.innerHTML += ` It is officially liscenced by ${link}.`;
    } else {
      comments.innerHTML += ` It has no official tranlation, but a fan translation is available on ${link}.`;
    }

    var infoDiv = document.createElement("div");
    infoDiv.className = "infoDiv";
    infoDiv.appendChild(synopsisTitle);
    infoDiv.appendChild(synopsis);
    infoDiv.appendChild(commentsTitle);
    infoDiv.appendChild(comments);
    gridDiv.appendChild(infoDiv);

    element.appendChild(gridDiv);
    var hr = document.createElement("hr");
    element.appendChild(hr);
  }
}

function createYuriList(ranking: string[], mangas: Manga[]) {
  var div = document.getElementById("yuriList");
  if (div === null) {
    throw new Error("Could not fid element with id 'yuriList'");
  }

  // I love O(n^2) algorithms!
  for (const name of ranking) {
    for (const manga of mangas) {
      if (manga.title === name) {
        manga.to_html(div);
        break;
      }
    }
  }
}

const ranking = [
  "Adachi and Shimamura",
  "Mage & Demon Queen",
  "Blooming Sequence",
  "Bloom Into You",
  "Doughnuts Under a Crescent Moon",
  "Not so Shoujo Love Story",
  "Pulse",
  "Ring my Bell",
  "A Joyful Life",
  "Hana ni Arashi",
  "Lily",
  "If We Leave on the Dot",
  "That Time I Was Blackmailed By the Class's Green Tea Bitch",
  "My Food Looks Very Cute",
  "Anemone Is in Heat",
  "Can't Defy the Lonely Girl",
  "Cheerful Amnesia",
  "Wife & Wife",
];

const mangas = [
  // --- Adachi and Shimamura ---
  new Manga(
    "Adachi and Shimamura",
    "media/adashima.webp",
    false,
    `\
Adachi and Shimamura, two young women who attend the same high school, are inseparable friends. \
Whether playing table tennis, chatting about favorite TV shows, or just relaxing together, \
they're happy to share their days. When Adachi's friendship turns into romantic attraction, \
the relationship begins to change, one day at a time.`,
    `\
Very cute slow-burn slice of life, do not expect any rapid developments. This story is adapted \
into an anime, but I recommend reading the original light novels.`,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/adachi-and-shimamura-light-novel/"
      )
    )
  ),
  //
  // --- Mage & Demon Queen ---
  new Manga(
    "Mage & Demon Queen",
    "media/mageQueen.jpg",
    true,
    `\
Adventurers seek to take the demon queen's head, but a love-struck young female mage wishes \
to take her hand. Join us won't you, for this bawdy tale of love and persistence set inside \
a real-life RPG.`,
    `\
A funny love story. It start off very silly, but becomes more serious eventually. It also \
features a trans princess as a side character.`,
    new Source(
      true,
      new Link(
        "WebToons",
        "https://www.webtoons.com/en/comedy/mage-and-demon-queen/list?title_no=1438"
      )
    )
  ),
  //
  // --- Lily ---
  new Manga(
    "Lily",
    "media/lily.jpg",
    false,
    `\
Prim and proper honors student Fan Yilin and the mysterious and charismatic Lan Ruoxi met \
through a stroke of fate and a misunderstanding, and only got further involved with each \
other from that point on. The more they came to know each other, the more something \
different started blooming between the two. "I like you, only because it's you."`,
    `\
This is an exceptionally slow-burn slice of life romance. The main pair does eventually \
become a couple, but it takes several hundred chapters. The story is officially published by \
Bilibili Comics, and while I do recommend supporting the creator, the reading experience on \
there is not great. It is also available on MangaDex, which has a better reading experience and \
more translated chapters, but it suddenly stops and has not been updated in over two years.`,
    new Source(
      true,
      new Link("Bilibili Comics", "https://www.bilibilicomics.com/detail/mc82")
    )
  ),
  //
  // --- Bloom Into You ---
  new Manga(
    "Bloom Into You",
    "media/bloom_into_you.jpg",
    true,
    `\
Yuu has always loved shoujo manga and awaits the day she gets a love confession that sends \
her heart aflutter with bubbles and hearts, and yet when a junior high classmate confesses \
his feelings to her…she feels nothing. Disappointed and confused, Yuu enters high school \
still unsure how to respond. That's when Yuu sees the beautiful student council president \
Nanami turn down a suitor with such maturity that she's inspired to ask her for help. But \
when the next person to confess to Yuu is Nanami herself, has her shoujo romance finally \
begun?`,
    `\
This is one of the most famous lesbian manga. It is adapted into an anime, which covers \
about half of the story. The anime is very good, so I would recommend watching that \
initially.`,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/bloom-into-you/"
      )
    )
  ),
  //
  // --- Not so Shoujo Love Story ---
  new Manga(
    "Not so Shoujo Love Story",
    "media/not_shoujo.jpg",
    false,
    `\
Romance-super-fan Rei Chan is ready for her first boyfriend and she knows just who it'll be: \
the most handsome boy in school, Hansum Ochinchin. But her plans for the perfect love story \
are derailed when the most popular girl in class declares herself a rival....for Rei's \
heart?! This is the year her not so shoujo love story begins!`,
    `\
This is a very silly, but also very cute, comic. The main character suffers from comphet, so \
it takes a while for her to understand her feelings.`,
    new Source(
      true,
      new Link(
        "WebToons",
        "https://www.webtoons.com/en/comedy/not-so-shoujo-love-story/list?title_no=2189"
      )
    )
  ),
  //
  // --- Hana ni Arashi ---
  new Manga(
    "Hana ni Arashi",
    "media/hana_ni.jpg",
    true,
    `\
Nanoha and Chidori are students at an all-girls school who are dating but trying to keep \
this a secret from all of their classmates.`,
    `This is a very cute slice of life story.`,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/bc86a871-ddc5-4e42-812a-ccd38101d82e/hana-ni-arashi"
      )
    )
  ),
  //
  // --- Pulse ---
  new Manga(
    "Pulse",
    "media/pulse.jpg",
    false,
    `\
Mel, a renowned heart surgeon, lives a carefree life with sex being a tool for joy rather \
than a show of affection. Then she meets someone that turns her view of love and life upside \
down. This story is about two people that meet with minimal expectations but soon become \
enthralled in a relationship that changes everything about themselves.`,
    `\
This comic has a lot of explicit lesbian sex, so keep that in mind. It is very dramatic, \
which I typically don't like, but the main couple is very cute, and it does have a happy ending.`,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/pulse/"
      )
    )
  ),
  //
  // --- Can't Defy the Lonely Girl ---
  new Manga(
    "Can't Defy the Lonely Girl",
    "media/lonely_girl.png",
    true,
    `\
Ayaka Sakurai is an excellent student, but she gets nervous at exams, so she had to settle \
for a lesser high school than she expected. However, her teacher offered Ayaka a \
recommendation letter to the school of her choice if she could convince the delinquent girl \
Sora Honda to come to school. When Ayaka visited Sora at her home, Sora was quite willing \
to go back to school, if Ayaka would agree to do one thing...`,
    `\
The relationship between the main characters feels a bit coercive in the beginning, but that \
gets resolved, and the relationship becomes reciprocal.`,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/d7576e72-0301-4ed3-9137-722ed768bfda/can-t-defy-the-lonely-girl"
      )
    )
  ),
  //
  // --- Anemone Is in Heat ---
  new Manga(
    "Anemone Is in Heat",
    "media/anemone.jpg",
    false,
    `\
Nagisa Ootsuki shed her former self out of shame from failing her highschool entrance exams. \
On her first day in her new highschool, who does she meet but the girl who made her fail the \
exam! How does Nagisa deal with these complicated emotions?`,
    ``,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/c5d731f9-c1cf-4a69-a797-cd9c2a58316b/anemone-is-in-heat"
      )
    )
  ),
  //
  // --- Wife & Wife ---
  new Manga(
    "Wife & Wife",
    "media/wifewife.png",
    true,
    `\
Sumi and Kinana have just moved in together. This is the refreshing and hilarious story of \
their (romantic) everyday life.`,
    `This is a short and sweet story about a couple moving in together.`,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/bf114abd-9a92-4d30-9f7c-850c93358ce8/fu-fu"
      )
    )
  ),
  //
  // --- Cheerful Amnesia ---
  new Manga(
    "Cheerful Amnesia",
    "media/amnesia.jpg",
    true,
    `\
Mari's girlfriend, Arisa, loses her memories of the past three years, including all memory \
of their life together. However, it turns out that being crazy in love with someone \
transcends all realms of possibility.`,
    `This manga is a bit too unserious for my tastes, but is is still cute.`,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/f9448f90-c068-4b6a-8c85-03d739aef255/cheerful-amnesia"
      )
    )
  ),
  //
  // --- My Food Looks Very Cute ---
  new Manga(
    "My Food Looks Very Cute",
    "media/cute_food.png",
    false,
    `\
A vampire that has been asleep for almost two hundred years, Maria, has been awakened by a \
wolf girl passing by, Xing Lan. When the casket was opened, a curse fell upon Xing Lan. \
Instead of being scared, the naïve Xing Lan instead believed she has found an amazing \
companion, and the two embark on a journey to the city.`,
    `Very cute.`,
    new Source(
      true,
      new Link("Bilibili Comics", "https://www.bilibilicomics.com/detail/mc88")
    )
  ),
  //
  // --- Ring my Bell ---
  new Manga(
    "Ring my Bell",
    "media/bell.jpg",
    true,
    `\
Hell yeah! A major publisher wants Mai Sohn to write a webcomic on relationships. But she's \
struck with heartbreak as her girlfriend abruptly dumps her. It's hard writing about \
relationships without being in one, so she needs to find the inspiration for love — and find \
it fast. And what's up with her possibly homophobic neighbor? Why is she cool with Mai \
one minute and then so awkward and weird to her the next?! Can't a girl catch a break?`,
    `I read this story long ago, so I don't remember much of it, but I do remember it being good.`,
    new Source(
      true,
      new Link("Tapas", "https://tapas.io/series/ringmybell/info")
    )
  ),
  //
  // --- A Joyful Life ---
  new Manga(
    "A Joyful Life",
    "media/joyful_life.png",
    true,
    `\
Joy has been living an "agreeable" life as long as she can remember, making way for the \
happiness of others at the cost of her own emotional well-being. Running into her high \
school crush, Aerie, and reaching a breaking point with her family and work, Joy's \
long-overdue goals of leaving home are placed into action. Will Joy be able to find her way \
in the world, and resolve the long overdue issues that have haunted her ordinary life?`,
    `\
This story is heavy, with references to sexual assault and familial abuse, but it a very \
good and touching story.`,
    new Source(
      true,
      new Link("Comiko", "https://comiko.net/title/86394-a-joyful-life")
    )
  ),
  //
  // --- That Time I Was Blackmailed By the Class's Green Tea Bitch ---
  new Manga(
    "That Time I Was Blackmailed By the Class's Green Tea Bitch",
    "media/blackmail.jpg",
    true,
    `\
Green Tea Bitch (n.): A woman who pretends to be pure and innocent but in fact is \
manipulative and calculating.

After school ends, a good honor student is threatened by the class's green tea bitch.
"I never thought you wide-eyed goody-two-shoes would do something like this."
"If you don't want me to expose your shameful secret…"

A cute romance that stems from a misunderstanding begins in That Time I Was Blackmailed By \
the Class's Green Tea Bitch!`,
    `This is a fun and gay story, but it unfortunately suffers from a rushed ending`,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/73965527-b393-4f65-9bc3-2439ec44935a/that-time-i-was-blackmailed-by-the-class-s-green-tea-bitch"
      )
    )
  ),
  //
  // --- Blooming Sequence ---
  new Manga(
    "Blooming Sequence",
    "media/blooming.jpg",
    true,
    `\
    Seowoo, president of the film club, is standing outside in the rain, a welcome break \
    from the noisy and chaotic bar behind her, when a girl with orange hair stumbles out \
    the doors and practically into her arms. Then she begins singing “Dancing in the Rain” \
    while… dancing in the rain. It's a minute encounter, really, but Seowoo has seen the \
    greatest romances bloom from the smallest moments in the movies. So when Hayoung shows \
    up to join the film club, Seowoo - who's not even sure what she herself is feeling - \
    finds her heart skipping a beat.`,
    ``,
    new Source(
      false,
      new Link(
        "MangaDex",
        "https://mangadex.org/title/243711a2-9455-4459-a00d-300e25fd8af0/blooming-sequence"
      )
    )
  ),
  //
  // --- Doughnuts Under a Crescent Moon ---
  new Manga(
    "Doughnuts Under a Crescent Moon",
    "media/doughnuts.jpg",
    true,
    `\
    Uno Hinako throws herself into makeup, fashion, and falling in love, hoping that will make \
    her seem “normal” to the other people at her job. But no matter how hard she tries, she's \
    a self-doubting mess inside, and her attempts at “normal” romance with men just keep failing. \
    When she starts to think she might be alone forever, a new normal presents itself in the form of \
    her relationship with Asahi Sato, a level-headed woman who works at her company. It starts as \
    respect, and then it becomes far more intimate.`,
    ``,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/doughnuts-under-a-crescent-moon/"
      )
    )
  ),
  //
  // --- If We Leave on the Dot ---
  new Manga(
    "If We Leave on the Dot",
    "media/on_the_dot.webp",
    true,
    `\
    The woman she's interested in carries around the scent of vanilla.
    They would always communicate through exchanging pieces of notes that would be placed inside their coats' pockets.
    'When the weather turns warmer, will everything end?'
    The quiet and cute, Yukawa-san and the beautiful lady, Mizuki-san, where will their love go?
    An exciting and heart-pounding OL Yuri Manga`,
    ``,
    new Source(
      true,
      new Link("Manga Planet", "https://mangaplanet.com/comic/5fe434a974859")
    )
  ),
];

createYuriList(ranking, mangas);
