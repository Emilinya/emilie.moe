class Link {
  name: string;
  link: string;

  constructor(name: string, link: string) {
    this.name = name;
    this.link = link;
  }
}

class Source {
  licensed: boolean;
  link: Link;

  constructor(licensed: boolean, link: Link) {
    this.licensed = licensed;
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
    var extension = split_path.pop();
    var body = split_path.join(".");

    // Image
    var wide_source = document.createElement("source");
    wide_source.media = "(orientation: portrait)";
    wide_source.srcset = `${body}_wide.${extension}`;

    var tall_source = document.createElement("source");
    tall_source.media = "(orientation: landscape)";
    tall_source.srcset = `${body}_tall.${extension}`;

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

    var pronoun = " It"
    if (this.comments == "") {
      pronoun = "This manga"
    }

    var link = `<a target="_blank" class="listLink" href="${this.source.link.link}">${this.source.link.name}</a>`;

    if (this.source.licensed) {
      comments.innerHTML += `${pronoun} is officially licensed by ${link}.`;
    } else {
      comments.innerHTML += `${pronoun} has no official translation, but a fan translation is available on ${link}.`;
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
  "Hino-san is a Dummy",
  "Still Sick",
  "Let's Love Girlfriends and Secrets",
  "The Regular Customer's Goal is...?",
  "Senpai, Does It Taste Good?",
  "Mimi Mix!",
  "Breasts Are My Favorite Things in the World!",
  "About a College Girl Who Gets Picked Up at a Mixer by an Older Girl",
  "Demi Life!",
  "I Hope It's Sunny Tomorrow",
  "Shiki-senpai is too Handsome!",
  "Everyday Lily",
  "I Married My Best Friend to Shut My Parents Up",
  "Moon and Love Waxes and Wanes",
  "The Secret Recipe",
  "There's Weird Voices Coming from the Room Next Door!",
  "Cooking in Summer",
  "Holic",
  "Mr. Right Turned Out To Be A Younger Woman!?",
  "Ayaka is in Love with Hiroko!",
  "Your True Color",
  "Aqua Blue Cinema",
  "Swap ⇔ Swap",
  "2DK, G-pen, Alarm clock",
  "Only One Way to Keep Her From Taking the Last Train Home",
  "Silent Snow",
  "An Easy Introduction to Love Triangles (To Pass the Exam!)",
  "Failed Princesses",
  "Under One Roof Today",
  "Girl Friends",
  "High School Girl and Her Male Classmate's Mom",
  "Come Rain or Shine",
  "Uniformed Vampiress Lord",
  "Pocha Climb!"
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
his feelings to her...she feels nothing. Disappointed and confused, Yuu enters high school \
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
"If you don't want me to expose your shameful secret..."

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
while... dancing in the rain. It's a minute encounter, really, but Seowoo has seen the \
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
  //
  // --- Hino-san is a Dummy ---
  new Manga(
    "Hino-san is a Dummy",
    "media/on_the_dot.webp",
    true,
    `\
Class president and overall good girl Koguma is concerned that her classmate Hino often skips classes \
by spending her time behind one of the school buildings. Koguma feels it's her duty to guide Hino down \
a better path, even if it means going along with Hino's unusual requests.`,
    `\
The synopsis might indicate that this manga is generic, but it is anything but. You could reasonably argue \
that this manga is problematic, but I liked it a lot.`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/af737f18-6d40-4537-b0e6-ad32f2054daa/hino-san-no-baka"
      )
    )
  ),
  //
  // --- Still Sick ---
  new Manga(
    "Still Sick",
    "media/on_the_dot.webp",
    true,
    `\
Shimizu Makoto, a well-paid R&D lead for an industrial firm, has a secret - she draws and sells gay \
fanfiction on her days off. But when her sweet summery colleague, Maekawa, accidentally enters her \
secret world of girls who like other girls, Shimizu has to come face to face with some serious \
realizations... and deal with just how much of a weirdo Maekawa is!`,
    ``,
    new Source(
      true,
      new Link(
        "INKR",
        "https://comics.inkr.com/title/31-still-sick?utm_source=mgd"
      )
    )
  ),
  //
  // --- Let's Love Girlfriends and Secrets ---
  new Manga(
    "Let's Love Girlfriends and Secrets",
    "media/on_the_dot.webp",
    true,
    `\
A yuri comedy between two girls who seem different but are actually quite similar, each with a secret of her own.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/f98660a1-d2e2-461c-960d-7bd13df8b76d/kanojo-to-himitsu-to-koimoyou"
      )
    )
  ),
  //
  // --- The Regular Customer's Goal is...? ---
  new Manga(
    "The Regular Customer's Goal is...?",
    "media/on_the_dot.webp",
    true,
    `The goal of the regular customer who come everyday is...`,
    `On Mangadex, you should not read the first chapter (Ch. 0) as it is just a worse version of chapter 1.`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/1b98d236-77fc-4c54-869a-11c129512993/the-regular-customer-s-goal-is"
      )
    )
  ),
  //
  // --- Senpai, Does It Taste Good? ---
  new Manga(
    "Senpai, Does It Taste Good?",
    "media/on_the_dot.webp",
    true,
    `\
Miho is a university student who bears trauma relating to food. Suddenly, she finds herself with a pretend partner. \
Not only that, her pretend partner is the #1 most beautiful woman in the university, Mori-senpai!? A girl's \
socializing story presented through food by the author of Fuzuroi no Renri!`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/ea58f55b-16d4-43dd-ae69-af91fcb3db46/senpai-oishiidesu-ka"
      )
    )
  ),
  //
  // --- Breasts Are My Favorite Things in the World! ---
  new Manga(
    "Breasts Are My Favorite Things in the World!",
    "media/on_the_dot.webp",
    true,
    `\
Chiaki Ichihara is the princely heartthrob all the girls crush on, but she's got a not-so-charming secret: \
a serious boob fetish! Chiaki is so obsessed with breasts, she can hardly function without copping a feel. \
To satiate this need (and keep her classmates from finding out), she has enlisted Hana Harumi, whose \
perfectly sized and shaped bust may just be everything Chiaki's ever wanted... Will their odd \
partnership bloom into a bosom bond like no other?`,
    `This manga is definitely problematic, but it is also hilarious.`,
    new Source(
      true,
      new Link(
        "Yen Press",
        "https://yenpress.com/titles/9781975310035-breasts-are-my-favorite-things-in-the-world-vol-1"
      )
    )
  ),
  //
  // --- About a College Girl Who Gets Picked Up at a Mixer by an Older Girl ---
  new Manga(
    "About a College Girl Who Gets Picked Up at a Mixer by an Older Girl",
    "media/on_the_dot.webp",
    true,
    `\
College girl Kawada Rika gets roped into going to a mixer where she meets an older \
girl named Suda Natsuko and they are immediately enamored with each other.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/f9a2a3de-8556-4d4b-af98-2bf2bd6d84eb/about-a-college-girl-who-gets-picked-up-at-a-mixer-by-an-older-girl"
      )
    )
  ),
  //
  // --- Demi Life! ---
  new Manga(
    "Demi Life!",
    "media/on_the_dot.webp",
    true,
    `\
Azuma Manaka enrolled in a school filled with demis?! She'll be learning along them. \
What's more, the inari dorm which she'll be living in is filled with demi girls?! \
Surrounded by eccentric girls, her school life has just begun. Everyone is \
different and that's fine. Manaka's life with the demis is starting!`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/ae4d5376-b1b4-4c0f-b925-a4cc985d5a8e/demi-life"
      )
    )
  ),
  //
  // --- I Hope It's Sunny Tomorrow ---
  new Manga(
    "I Hope It's Sunny Tomorrow",
    "media/on_the_dot.webp",
    true,
    `A oneshot about parents and their daughter.`,
    `This is so cute!`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/5c0e3f57-9e62-4143-a1e4-cef563798e2f/i-hope-it-s-sunny-tomorrow"
      )
    )
  ),
  //
  // --- Shiki-senpai is too Handsome! ---
  new Manga(
    "Shiki-senpai is too Handsome!",
    "media/on_the_dot.webp",
    true,
    `\
A high school freshman bumps into a cool and beautiful upperclassman and falls in love at first \
sight. Upon seeing her at the Basketball Club, she fumbles her confession and the upperclassman \
takes it as her wanting to join the club.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/48da8c50-1c6b-439c-96af-8cfcf1dc543d/ikemen-sugidesu-shiki-senpai"
      )
    )
  ),
  //
  // --- Everyday Lily ---
  new Manga(
    "Everyday Lily",
    "media/on_the_dot.webp",
    true,
    `\
A realist lesbian accidentally comes out to a closeted lesbian, whose only lesbian experience was \
through 2-D artworks. Find out how their college lives start involving a daily dose of lily.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/71937147-e3e7-4ba6-9cd9-912b8289223d/everyday-lily"
      )
    )
  ),
  //
  // --- I Married My Best Friend to Shut My Parents Up ---
  new Manga(
    "I Married My Best Friend to Shut My Parents Up",
    "media/friendmarriage.jpg",
    true,
    `\
Morimoto, a young professional woman in Japan, is tired of fending off her parents' questions about her being single. \
They want her to marry a man and settle down, and they'll insist on nitpicking her choice of groom to death. In an \
unexpected move, another woman in the office—who has a crush on her—offers to be her wife in a sham marriage, which \
might make her parents back off. But this “fake” marriage could unearth something very real!`,
    `If you for whatever reason decide to read this story on mangadex, note that chapter 3.5 is an unrelated oneshot.`,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/i-married-my-best-friend-to-shut-my-parents-up/"
      )
    )
  ),
  //
  // --- Moon and Love Waxes and Wanes ---
  new Manga(
    "The Moon and Love Waxes and Wanes",
    "media/on_the_dot.webp",
    true,
    `\
Yamabe Kanoko and Mizuno Shiori have been best friends since childhood.

When they were students, they had a barrier between their adolescent hearts, but after they became working adults and got together, \
they were somehow unable to express their true feelings to each other, perhaps because of the eyes of those around them...

The time when they wanted to grow up quickly and the present when they don't want to grow up at all, where will their love go?

A slightly bittersweet but very sweet love story that depicts the shape of the two's love as it changes with the passage of time.`,
    `\
This manga does not even have a translated title or description on mangadex, so the description is from the \
Japanese Amazon page, and the title is translated (probably incorrectly) by me.`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/ca5e6f09-5ccd-436d-8ab5-077c2cc596e3/tsuki-to-koi-wa-michireba-kakeru"
      )
    )
  ),
  //
  // --- The Secret Recipe ---
  new Manga(
    "The Secret Recipe",
    "media/on_the_dot.webp",
    true,
    `\
The only first-year member of the struggling cooking club, an irreverent manipulative airhead, comes to the prim and proper new
club president, pressuring her for "advice" (a trial girl-girl kiss). Supposedly, the newbie has recently developed feelings for
an unspecified girl and suspects herself of being lesbian. Unless proven wrong, she will quit the club, since cooking was
only ever for raising appeal to potential future husbands anyway...`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/a2b157fe-0afb-45a2-ad69-04ba6af15a6a/himitsu-no-recipe"
      )
    )
  ),
  //
  // --- There's Weird Voices Coming from the Room Next Door! ---
  new Manga(
    "There's Weird Voices Coming from the Room Next Door!",
    "media/on_the_dot.webp",
    true,
    `\
Nakano's moved out of home for uni, but she's freaked out by the weird noises coming from the room next door!
Can this naïve kid survive getting wrapped up in big-city ideas of female friendship and love?
It's the start of a "Neighborhood Yuri Romcom"!`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/d7370cf3-c764-4469-9c72-8b70222f0409/there-s-weird-voices-coming-from-the-room-next-door"
      )
    )
  ),
  //
  // --- Cooking in Summer ---
  new Manga(
    "Cooking in Summer",
    "media/on_the_dot.webp",
    true,
    `\
Cooking in the summer is hard work. Going to the store for ingredients, doing something in front of the fire, or even \
washing dishes with your hands in cold water makes you sweat.
But she can't starve to death, so she pushes through the sweltering heat to meet the chef at the restaurant, who was \
introduced to her by a friend from before.
Why does it feel like a connection now, unlike last time, and is it okay to start a new relationship?`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/06d546b4-f9d2-4cda-bc4e-dad8a96edf62/cooking-in-summer"
      )
    )
  ),
  //
  // --- Shoujo Holic ---
  new Manga(
    "Shoujo Holic",
    "media/on_the_dot.webp",
    true,
    `\
A girl's father is relocated by his job. She's recently found the "boy of her dreams" and decides that she's staying no \
matter where her parents move to! She's sent to live with her grandmother and enters the same high school her mother \
attended. It's a religious school run by nuns. She meets a very strange girl who thinks she's cute and shows \
quite an interest in her.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/27cc4285-acce-4350-8d38-32a2c3d0bb89/shoujo-holic"
      )
    )
  ),
  //
  // --- Mr. Right Turned Out To Be A Younger Woman!? ---
  new Manga(
    "Mr. Right Turned Out To Be A Younger Woman!?",
    "media/on_the_dot.webp",
    true,
    `\
Still single at age 33, Haruki Shiina is standing at the biggest crossroads of her life. While unlucky in love, \
she's popular among her female coworkers for her laid-back and boyish personality. The only one who gives her \
the cold shoulder is Risa Takagai, a beautiful and capable new hire who is already climbing her way up the \
corporate ladder. Haruki sees her as her biggest rival and is sure that the feeling is mutual, but why \
does Risa always seem to be watching her...?`,
    ``,
    new Source(
      true,
      new Link(
        "EbookRenta",
        "https://www.ebookrenta.com/renta/sc/frm/item/142845"
      )
    )
  ),
  //
  // --- Ayaka is in Love with Hiroko! ---
  new Manga(
    "Ayaka is in Love with Hiroko!",
    "media/on_the_dot.webp",
    true,
    `\
Soft and bubbly office lady Ayaka is madly in love with her senior at work, Hiroko! Two lovestruck coworkers who both \
think the other is straight totally crush on each other... popular Twitter artist Sal Jiang's latest office rom-com! `,
    `The first volume of this manga is really annoying, but it gets good after that.`,
    new Source(
      true,
      new Link("MangaPlaza", "https://mangaplaza.com/title/0303001565/")
    )
  ),
  //
  // --- Your True Color ---
  new Manga(
    "Your True Color",
    "media/on_the_dot.webp",
    true,
    `Hinata idolizes the dazzling actress Sumika, until one day she happens to meet the real deal, who is not at all like her ideal.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/7875975e-b88e-4629-9ea2-feb495b73793/your-true-color"
      )
    )
  ),
  //
  // --- Aqua Blue Cinema ---
  new Manga(
    "Aqua Blue Cinema",
    "media/on_the_dot.webp",
    true,
    `Aqua Blue Cinema is about an actress and a girl she meets through unusual circumstances.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/a060c3b9-f974-45cf-8626-8a9758cc4981/mizuiro-cinema"
      )
    )
  ),
  //
  // --- Swap ⇔ Swap ---
  new Manga(
    "Swap ⇔ Swap",
    "media/on_the_dot.webp",
    true,
    `\
Two girls, Ichinose Haruko and Nikaido Natsuko, bump into each other by accident, resulting in a kiss that would change their lives...`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/af6b26ab-b3dd-4e87-8a7a-7fd988482eb2/swap-swap"
      )
    )
  ),
  //
  // --- 2DK, G-pen, Alarm clock ---
  new Manga(
    "2DK, G-pen, Alarm clock",
    "media/on_the_dot.webp",
    true,
    `\
A mangaka and her salarywoman roommate come to realize that their feelings of friendship might actually be something quite different.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/10db587f-a232-485d-b4a8-68ee0cb15e3c/2dk-g-pen-alarm-clock"
      )
    )
  ),
  //
  // --- Only One Way to Keep Her From Taking the Last Train Home ---
  new Manga(
    "Only One Way to Keep Her From Taking the Last Train Home",
    "media/on_the_dot.webp",
    false,
    `\
Nanako Morito fell in love with her senpai Ayaka Segawa when Ayaka led Nanako's new employee orientation session. \
Morito kept her feelings to herself until she was jolted by the news that Segawa-san was quitting the company.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/40931d0c-b05e-423c-b79d-1c6d21199ec5/shuuden-de-kaesanai-tatta-hitotsu-houhou"
      )
    )
  ),
  //
  // --- Silent Snow ---
  new Manga(
    "Silent Snow",
    "media/on_the_dot.webp",
    true,
    ``,
    `I don't typically recommend oneshots, but this one is so good I had to include it.`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/a1551ed7-dd4a-4f8e-a61c-b65ef1c20a91/silent-snow"
      )
    )
  ),
  //
  // --- An Easy Introduction to Love Triangles (To Pass the Exam!) ---
  new Manga(
    "An Easy Introduction to Love Triangles (To Pass the Exam!)",
    "media/on_the_dot.webp",
    true,
    `\
Middle-schooler Mayuki wants to enter Ohtomo high school to join her beloved senpai Akira. Problem is: \
her grades are so terrible there's no way she can make it into such a high level school.

Thus her mother hires a high school girl named Rin as a private teacher to help her daughter. Seeing how the \
girl looks so much more mature than her, Mayuki ends up asking Rin to teach her more than just school subjects...
    `,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/e30c2d88-3c91-4166-91be-9ee38bfe94fe/goukaku-no-tame-no-yasashii-sankaku-kankei-nyuumon"
      )
    )
  ),
  //
  // --- Failed Princesses ---
  new Manga(
    "Failed Princesses",
    "media/on_the_dot.webp",
    true,
    `\
Fujishiro Nanaki is super cute, super popular, and super annoyed with anyone as plain as her classmate Kurokawa Kanade. \
When Nanaki finds out her boyfriend's cheating on her, however, her life makes a complete 180—as does her \
relationship with Kanade. This all-new yuri manga series explores the budding romance between the \
cool girl in school and the “plain” girl she once brushed off!`,
    ``,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/failed-princesses/"
      )
    )
  ),
  //
  // --- Under One Roof Today ---
  new Manga(
    "Under One Roof Today",
    "media/on_the_dot.webp",
    true,
    `\
A heartwarming autobiographical comic offering a peek into the daily life of Inui Ayu and her girlfriend, Kon-san.`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/d20ded9e-4df4-4dea-94e1-3905df5c4c16/under-one-roof-today"
      )
    )
  ),
  //
  // --- Girl Friends ---
  new Manga(
    "Girl Friends",
    "media/on_the_dot.webp",
    true,
    `\
When it comes to grades, bookish high school student Mariko Kumakura is at the top of her class. Socially, however, \
she is shy and lonely, typically eating lunch by herself. Enter the charismatic and beautiful Akko Oohashi, \
whose goal is to befriend Mariko and burst her out of her introverted shell.

In the process of transforming Plain Jane Mariko into one of the cutest, most popular girls in school, \
deep feelings begin to emerge that suggest something deeper than friendship. Will these feelings \
destroy the budding relationship between Mariko and Akko, or will it turn into something else?`,
    `This manga is incredibly painful at times, but it is also very good.`,
    new Source(
      true,
      new Link(
        "Seven Seas Entertainment",
        "https://sevenseasentertainment.com/series/girl-friends/"
      )
    )
  ),
  //
  // --- High School Girl and Her Male Classmate's Mom ---
  new Manga(
    "High School Girl and Her Male Classmate's Mom",
    "media/on_the_dot.webp",
    true,
    `Nakashima Yuka falls in love with her male classmate Toi Takuya's mother, Mihoko. Gay hilarity ensues.`,
    `This story does feature a sketchy age-gap, but I think it is handled well enough?`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/24c2e0fc-e381-4e84-b011-1a11887ee6f0/jk-chan-and-her-classmate-s-mom"
      )
    )
  ),
  //
  // --- Come Rain or Shine ---
  new Manga(
    "Come Rain or Shine",
    "media/on_the_dot.webp",
    true,
    `\
Country-born Mikoto and student council member Ren have always spent their time after school together. \
But one day, that ordinary routine suddenly comes to an end… With Uchouten High School as the stage, \
the love and youth of these impressionable young girls is about to begin!`,
    ``,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/43df19d5-0990-46ec-9367-ea29c502e7bb/ame-demo-hare-demo"
      )
    )
  ),
  //
  // --- Uniformed Vampiress Lord ---
  new Manga(
    "Uniformed Vampiress Lord",
    "media/on_the_dot.webp",
    true,
    `\
Normal high school girl Irie Yuunagi suddenly has her blood sucked by a strange man one night. \
Yuunagi wakes up as a vampire and learns that she has been added to the man who bit her, \
Rin's, family. She begins to learn about the rules of the vampire world from Rin.`,
    `The synopsis makes it seem like this is a heterosexual story, but I promise it is not.`,
    new Source(
      false,
      new Link(
        "Mangadex",
        "https://mangadex.org/title/6cac6915-b058-43b0-ad6c-305144c78627/seifuku-no-vampiress-lord"
      )
    )
  ),
  //
  // --- Pocha Climb! ---
  new Manga(
    "Pocha Climb!",
    "media/on_the_dot.webp",
    true,
    `\
Tsugumi is a high school girl trapped between her desire to lose weight and her love for doughnuts.
She has an unexpected reunion with Aira, her childhood friend, and joins the bouldering club
with her to rekindle their (more than?) friendship.`,
    `This manga suffers from a somewhat rushed ending, but is otherwise good.`,
    new Source(
      false,
      new Link("Mangadex", "https://mangadex.org/title/b553b7c3-cee3-4689-aa54-fbc1bc1da71d/pocha-climb")
    )
  ),
];

createYuriList(ranking, mangas);
