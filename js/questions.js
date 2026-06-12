/* =====================================================================
   QUESTION BANK for Kids Jeopardy!
   ---------------------------------------------------------------------
   - Geared for kindergarten / 1st grade (ages 5-7).
   - Each category has 4 point tiers: 10, 20, 50, 100 (easy -> harder).
   - Each tier holds several candidate questions; ONE is chosen at random
     per game, so the same category plays differently each time.
   - "answer" is the plain word/phrase. The answer checker in app.js is
     forgiving about spelling, Jeopardy "what is..." phrasing, and accepts
     a number either as a digit ("3") or a word ("three").
   - "choices" powers the "Show choices" multiple-choice fallback. Keep the
     correct answer in the list; order is shuffled at display time.

   To add/edit content: just add objects to any tier array below.
   ===================================================================== */

const QUESTION_POOL = [
  {
    category: "Animals",
    tiers: {
      10: [
        { clue: "This farm animal says 'moo'.", answer: "cow", choices: ["cow", "dog", "duck", "pig"] },
        { clue: "This pet says 'woof' and likes to fetch.", answer: "dog", choices: ["dog", "cat", "fish", "cow"] },
        { clue: "This animal says 'meow' and likes to nap.", answer: "cat", choices: ["cat", "dog", "cow", "bird"] },
      ],
      20: [
        { clue: "This tall animal has a very long neck.", answer: "giraffe", choices: ["giraffe", "mouse", "rabbit", "frog"] },
        { clue: "This jungle animal is called the 'king' and goes 'roar'.", answer: "lion", choices: ["lion", "pig", "duck", "sheep"] },
        { clue: "This gray animal has a long trunk and big ears.", answer: "elephant", choices: ["elephant", "horse", "goat", "cat"] },
      ],
      50: [
        { clue: "This black-and-white animal looks like a horse with stripes.", answer: "zebra", choices: ["zebra", "tiger", "bear", "deer"] },
        { clue: "This animal hops, has a pouch, and lives in Australia.", answer: "kangaroo", choices: ["kangaroo", "monkey", "wolf", "fox"] },
        { clue: "This orange jungle cat has black stripes.", answer: "tiger", choices: ["tiger", "lion", "leopard", "cat"] },
      ],
      100: [
        { clue: "This animal slowly carries its house on its back.", answer: "snail", choices: ["snail", "turtle", "crab", "worm"] },
        { clue: "This bird cannot fly but loves to swim in the cold ice and snow.", answer: "penguin", choices: ["penguin", "eagle", "owl", "robin"] },
        { clue: "This animal changes its color to hide. It is a kind of lizard.", answer: "chameleon", choices: ["chameleon", "snake", "frog", "gecko"] },
      ],
    },
  },

  {
    category: "Colors",
    tiers: {
      10: [
        { clue: "The sky on a sunny day is this color.", answer: "blue", choices: ["blue", "red", "green", "brown"] },
        { clue: "Grass and many leaves are this color.", answer: "green", choices: ["green", "purple", "pink", "blue"] },
        { clue: "A stop sign and a fire truck are this color.", answer: "red", choices: ["red", "yellow", "blue", "white"] },
      ],
      20: [
        { clue: "The sun and many bananas are this color.", answer: "yellow", choices: ["yellow", "blue", "black", "green"] },
        { clue: "Mix red and yellow and you get this fruity color.", answer: "orange", choices: ["orange", "purple", "green", "pink"] },
        { clue: "A grape and many crayons can be this royal color.", answer: "purple", choices: ["purple", "orange", "red", "white"] },
      ],
      50: [
        { clue: "Mix red and white together to make this color.", answer: "pink", choices: ["pink", "gray", "blue", "green"] },
        { clue: "Tree trunks and chocolate are usually this color.", answer: "brown", choices: ["brown", "yellow", "pink", "blue"] },
        { clue: "Mix blue and yellow paint to make this color.", answer: "green", choices: ["green", "purple", "orange", "pink"] },
      ],
      100: [
        { clue: "A rainbow has this many colors: red, orange, yellow, green, blue, indigo, and violet.", answer: "seven", choices: ["seven", "five", "three", "ten"] },
        { clue: "These two colors mix to make purple.", answer: "red and blue", choices: ["red and blue", "yellow and green", "black and white", "orange and pink"] },
        { clue: "When there is no light at all, everything looks this color.", answer: "black", choices: ["black", "white", "yellow", "red"] },
      ],
    },
  },

  {
    category: "Shapes",
    tiers: {
      10: [
        { clue: "This round shape looks like a ball or the sun.", answer: "circle", choices: ["circle", "square", "triangle", "star"] },
        { clue: "This shape has 4 equal sides, like a box.", answer: "square", choices: ["square", "circle", "heart", "oval"] },
        { clue: "We draw this shape to show love. It has two bumps on top.", answer: "heart", choices: ["heart", "star", "square", "circle"] },
      ],
      20: [
        { clue: "This shape has 3 sides and 3 corners.", answer: "triangle", choices: ["triangle", "circle", "square", "diamond"] },
        { clue: "This twinkly shape is in the night sky and has 5 points.", answer: "star", choices: ["star", "moon", "circle", "heart"] },
        { clue: "This shape is like a stretched circle, shaped like an egg.", answer: "oval", choices: ["oval", "square", "triangle", "star"] },
      ],
      50: [
        { clue: "This shape has 4 sides like a square, but it's longer than it is tall, like a door.", answer: "rectangle", choices: ["rectangle", "circle", "triangle", "star"] },
        { clue: "This shape looks like a tilted square or a baseball field. It is also on playing cards.", answer: "diamond", choices: ["diamond", "circle", "oval", "heart"] },
        { clue: "A triangle has this many corners.", answer: "three", choices: ["three", "four", "five", "two"] },
      ],
      100: [
        { clue: "This shape looks like a stop sign and has 8 sides.", answer: "octagon", choices: ["octagon", "triangle", "square", "circle"] },
        { clue: "This shape has 5 sides. A house drawing often has one on top.", answer: "pentagon", choices: ["pentagon", "hexagon", "square", "triangle"] },
        { clue: "This shape has 6 sides, like the cells in a honeycomb.", answer: "hexagon", choices: ["hexagon", "octagon", "circle", "star"] },
      ],
    },
  },

  {
    category: "Counting",
    tiers: {
      10: [
        { clue: "How many is this many fingers: one, two, three?", answer: "three", choices: ["three", "two", "five", "four"] },
        { clue: "How many noses do you have?", answer: "one", choices: ["one", "two", "three", "zero"] },
        { clue: "Count them: 1, 2. How many is that?", answer: "two", choices: ["two", "one", "four", "three"] },
      ],
      20: [
        { clue: "How many fingers are on ONE hand?", answer: "five", choices: ["five", "ten", "two", "four"] },
        { clue: "What number comes right after 6?", answer: "seven", choices: ["seven", "five", "eight", "six"] },
        { clue: "How many legs does a dog have?", answer: "four", choices: ["four", "two", "six", "three"] },
      ],
      50: [
        { clue: "How many fingers are on TWO hands?", answer: "ten", choices: ["ten", "five", "eight", "twelve"] },
        { clue: "What number comes right before 10?", answer: "nine", choices: ["nine", "eight", "eleven", "ten"] },
        { clue: "How many legs does a spider have?", answer: "eight", choices: ["eight", "six", "four", "ten"] },
      ],
      100: [
        { clue: "If you have 2 cookies and get 3 more, how many cookies do you have?", answer: "five", choices: ["five", "four", "six", "three"] },
        { clue: "How many days are in one week?", answer: "seven", choices: ["seven", "five", "ten", "twelve"] },
        { clue: "Count by tens: 10, 20, 30... what comes next?", answer: "forty", choices: ["forty", "fifty", "thirty", "four"] },
      ],
    },
  },

  {
    category: "Yummy Food",
    tiers: {
      10: [
        { clue: "This long yellow fruit is a monkey's favorite. You peel it.", answer: "banana", choices: ["banana", "apple", "grape", "carrot"] },
        { clue: "This red or green round fruit keeps the doctor away.", answer: "apple", choices: ["apple", "banana", "lemon", "potato"] },
        { clue: "This frozen treat comes in a cone and melts in the sun.", answer: "ice cream", choices: ["ice cream", "soup", "bread", "salad"] },
      ],
      20: [
        { clue: "This round food has cheese and sauce and is cut into triangle slices.", answer: "pizza", choices: ["pizza", "apple", "cookie", "milk"] },
        { clue: "These orange veggies are crunchy and rabbits love them.", answer: "carrot", choices: ["carrot", "banana", "grape", "corn"] },
        { clue: "This sour yellow fruit makes you pucker.", answer: "lemon", choices: ["lemon", "apple", "cherry", "melon"] },
      ],
      50: [
        { clue: "These tiny purple or green fruits grow in bunches on a vine.", answer: "grapes", choices: ["grapes", "apple", "banana", "orange"] },
        { clue: "This breakfast food comes from chickens and you can scramble it.", answer: "egg", choices: ["egg", "pizza", "cookie", "apple"] },
        { clue: "This yellow vegetable grows on a cob and can pop into popcorn.", answer: "corn", choices: ["corn", "pea", "carrot", "bean"] },
      ],
      100: [
        { clue: "This sweet food is made by bees and is sticky and golden.", answer: "honey", choices: ["honey", "milk", "butter", "jam"] },
        { clue: "This food is a sandwich with a round bun, meat, and is grilled.", answer: "hamburger", choices: ["hamburger", "soup", "salad", "cereal"] },
        { clue: "This green vegetable looks like a tiny tree on your plate.", answer: "broccoli", choices: ["broccoli", "carrot", "corn", "potato"] },
      ],
    },
  },

  {
    category: "Weather & Seasons",
    tiers: {
      10: [
        { clue: "This big bright ball in the sky keeps us warm in the day.", answer: "sun", choices: ["sun", "moon", "cloud", "star"] },
        { clue: "This wet weather falls from clouds and makes puddles.", answer: "rain", choices: ["rain", "sun", "wind", "snow"] },
        { clue: "This cold white stuff falls in winter and you can build a snowman with it.", answer: "snow", choices: ["snow", "rain", "sun", "sand"] },
      ],
      20: [
        { clue: "These fluffy white things float in the sky.", answer: "clouds", choices: ["clouds", "rocks", "trees", "stars"] },
        { clue: "This colorful arch appears in the sky after the rain.", answer: "rainbow", choices: ["rainbow", "cloud", "moon", "kite"] },
        { clue: "You can fly a kite when there is a lot of this moving air.", answer: "wind", choices: ["wind", "snow", "rain", "fog"] },
      ],
      50: [
        { clue: "This is the hot season when school is out and we go swimming.", answer: "summer", choices: ["summer", "winter", "fall", "spring"] },
        { clue: "This is the cold, snowy season with holidays like Christmas.", answer: "winter", choices: ["winter", "summer", "spring", "fall"] },
        { clue: "This bright flash of light comes in a storm, before the thunder.", answer: "lightning", choices: ["lightning", "rainbow", "snow", "wind"] },
      ],
      100: [
        { clue: "This season comes after winter, when flowers bloom and it rains a lot.", answer: "spring", choices: ["spring", "summer", "fall", "winter"] },
        { clue: "In this season the leaves turn red and orange and fall off the trees.", answer: "fall", choices: ["fall", "spring", "summer", "winter"] },
        { clue: "This loud booming sound comes with a storm after the lightning.", answer: "thunder", choices: ["thunder", "rain", "wind", "snow"] },
      ],
    },
  },

  {
    category: "My Body",
    tiers: {
      10: [
        { clue: "You use these to see things.", answer: "eyes", choices: ["eyes", "ears", "feet", "hands"] },
        { clue: "You use this to smell flowers and it's in the middle of your face.", answer: "nose", choices: ["nose", "ear", "eye", "mouth"] },
        { clue: "You use these to walk and run.", answer: "feet", choices: ["feet", "hands", "ears", "eyes"] },
      ],
      20: [
        { clue: "You use these to hear music and sounds.", answer: "ears", choices: ["ears", "eyes", "nose", "knees"] },
        { clue: "You use this to taste yummy food. It's inside your mouth.", answer: "tongue", choices: ["tongue", "tooth", "nose", "ear"] },
        { clue: "You have ten of these on your hands.", answer: "fingers", choices: ["fingers", "toes", "ears", "eyes"] },
      ],
      50: [
        { clue: "This part bends in the middle of your leg.", answer: "knee", choices: ["knee", "elbow", "wrist", "ankle"] },
        { clue: "This part bends in the middle of your arm.", answer: "elbow", choices: ["elbow", "knee", "shoulder", "neck"] },
        { clue: "Your hair grows on the top of this body part.", answer: "head", choices: ["head", "foot", "hand", "back"] },
      ],
      100: [
        { clue: "This body part thumps in your chest and pumps your blood. We draw it for love too.", answer: "heart", choices: ["heart", "brain", "lung", "tummy"] },
        { clue: "This part inside your head helps you think and remember.", answer: "brain", choices: ["brain", "heart", "bone", "tooth"] },
        { clue: "You breathe air in and out with these two body parts in your chest.", answer: "lungs", choices: ["lungs", "heart", "ears", "eyes"] },
      ],
    },
  },

  {
    category: "On the Farm",
    tiers: {
      10: [
        { clue: "This pink farm animal rolls in the mud and says 'oink'.", answer: "pig", choices: ["pig", "cow", "duck", "cat"] },
        { clue: "This bird wakes up the farm with a 'cock-a-doodle-doo'.", answer: "rooster", choices: ["rooster", "cow", "sheep", "pig"] },
        { clue: "This farm animal gives us wool and says 'baa'.", answer: "sheep", choices: ["sheep", "horse", "duck", "pig"] },
      ],
      20: [
        { clue: "This big animal you can ride and it says 'neigh'.", answer: "horse", choices: ["horse", "pig", "duck", "hen"] },
        { clue: "This bird gives us eggs and says 'cluck'.", answer: "hen", choices: ["hen", "cow", "goat", "pig"] },
        { clue: "This farm animal can eat almost anything and has a little beard. It says 'maa'.", answer: "goat", choices: ["goat", "sheep", "horse", "cow"] },
      ],
      50: [
        { clue: "This big red building on a farm is where animals and hay are kept.", answer: "barn", choices: ["barn", "school", "store", "castle"] },
        { clue: "The person who takes care of the farm and grows the crops is called this.", answer: "farmer", choices: ["farmer", "doctor", "teacher", "pilot"] },
        { clue: "This baby cow has a special name.", answer: "calf", choices: ["calf", "puppy", "kitten", "chick"] },
      ],
      100: [
        { clue: "This machine pulls heavy loads and plows the fields on a farm.", answer: "tractor", choices: ["tractor", "airplane", "boat", "train"] },
        { clue: "A baby sheep is called this.", answer: "lamb", choices: ["lamb", "calf", "foal", "chick"] },
        { clue: "Farmers grow this tall yellow plant to make bread and cereal.", answer: "wheat", choices: ["wheat", "candy", "rock", "ice"] },
      ],
    },
  },

  {
    category: "Under the Sea",
    tiers: {
      10: [
        { clue: "This animal swims in water and breathes with gills. It has fins.", answer: "fish", choices: ["fish", "dog", "bird", "cat"] },
        { clue: "This sea animal has a hard shell and pinches with its claws.", answer: "crab", choices: ["crab", "fish", "frog", "snail"] },
        { clue: "This big sea animal is the largest one of all and squirts water from its top.", answer: "whale", choices: ["whale", "fish", "crab", "duck"] },
      ],
      20: [
        { clue: "This sea animal has 8 arms and can squirt black ink.", answer: "octopus", choices: ["octopus", "crab", "fish", "shark"] },
        { clue: "This sea animal is shaped like a star and has 5 arms.", answer: "starfish", choices: ["starfish", "jellyfish", "crab", "fish"] },
        { clue: "This smart, friendly sea animal jumps and clicks. It is not a fish!", answer: "dolphin", choices: ["dolphin", "shark", "whale", "crab"] },
      ],
      50: [
        { clue: "This sea animal has sharp teeth and a big fin on its back.", answer: "shark", choices: ["shark", "dolphin", "turtle", "fish"] },
        { clue: "This sea animal carries a hard shell and swims slowly with flippers.", answer: "turtle", choices: ["turtle", "crab", "fish", "frog"] },
        { clue: "This sea animal is squishy, see-through, and can sting. It floats in the water.", answer: "jellyfish", choices: ["jellyfish", "starfish", "octopus", "crab"] },
      ],
      100: [
        { clue: "This little orange-and-white fish hides in a sea plant called an anemone.", answer: "clownfish", choices: ["clownfish", "shark", "whale", "eel"] },
        { clue: "This sea animal looks like a tiny horse and the dad carries the babies.", answer: "seahorse", choices: ["seahorse", "starfish", "crab", "fish"] },
        { clue: "These tiny colorful sea creatures build big reefs that look like underwater rocks.", answer: "coral", choices: ["coral", "sand", "ice", "seaweed"] },
      ],
    },
  },

  {
    category: "Story Time",
    tiers: {
      10: [
        { clue: "In the rhyme, this little spider climbed up the water spout.", answer: "itsy bitsy", choices: ["itsy bitsy", "big", "scary", "fast"] },
        { clue: "Twinkle twinkle little ____.", answer: "star", choices: ["star", "moon", "sun", "cloud"] },
        { clue: "Old MacDonald had one of these, E-I-E-I-O.", answer: "farm", choices: ["farm", "boat", "car", "school"] },
      ],
      20: [
        { clue: "Humpty Dumpty sat on this and had a great fall.", answer: "wall", choices: ["wall", "chair", "tree", "bed"] },
        { clue: "Little Miss Muffet was scared away by this creepy crawly.", answer: "spider", choices: ["spider", "dog", "snake", "bee"] },
        { clue: "Jack and Jill went up the hill to fetch a pail of this.", answer: "water", choices: ["water", "milk", "candy", "sand"] },
      ],
      50: [
        { clue: "This fairy tale girl visited three bears and ate their porridge.", answer: "goldilocks", choices: ["goldilocks", "cinderella", "rapunzel", "snow white"] },
        { clue: "This fairy tale princess had very, very long hair to climb up.", answer: "rapunzel", choices: ["rapunzel", "goldilocks", "ariel", "belle"] },
        { clue: "The three little pigs built houses to hide from this animal.", answer: "wolf", choices: ["wolf", "bear", "fox", "lion"] },
      ],
      100: [
        { clue: "This green storybook character is hard to find in 'Where's ____?' books, wearing red and white stripes.", answer: "waldo", choices: ["waldo", "elmo", "nemo", "dora"] },
        { clue: "In a famous book, a very hungry one of these eats through lots of food and becomes a butterfly.", answer: "caterpillar", choices: ["caterpillar", "spider", "worm", "bee"] },
        { clue: "Cinderella lost one of these at the ball at midnight.", answer: "shoe", choices: ["shoe", "hat", "ring", "glove"] },
      ],
    },
  },
];
