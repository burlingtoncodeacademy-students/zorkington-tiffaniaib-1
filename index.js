const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}











// ===========================================================    PLAYER    ======================================================================================
let player = {
  inventory: [],
  status: null
}

// ============================================================    ROOMS    ======================================================================================
// CLASS
class Room {
  constructor(description, connections, inventory, isLocked = false) {   // we set isLocked's default value to false
    this.description = description,
      this.connections = connections,
      this.inventory = inventory,
      this.isLocked = isLocked
  }
}

let street = new Room(
  "You find yourself standing on a bustling street, surrounded by the ebb and flow of city life. ",
  "foyer",
  [],
  true
);

let foyer = new Room(
`You find yourself standing in a grand \x1b[32mfoyer\x1b[0m, the entrance to a mysterious mansion.
On the wall there is a damaged painting, that was visibly cut by a knife;
to the left of the painting there is a \x1b[0;33mnote\x1b[0m
pinned to the wall with a knife.`,
  ['library', 'street'],
  [],
);

let library = new Room(
`Oh wow. You're surrounded by books, shelves that reach the ceiling.
In the middle of the room, on a small wooden table, there is a \x1b[0;33mkey\x1b[0m.
This room has three doors, each one with a sign:
'\x1b[32mkitchen\x1b[0m', '\x1b[32mbedroom\x1b[0m' and '\x1b[32mgreenhouse\x1b[0m'.
Maybe the key opens one of them.`,
  ['kitchen', 'bedroom', 'greenhouse'],
  ['key']
);

let kitchen = new Room(
`You step into a spacious kitchen filled with the aroma of freshly baked bread.
That wouldn't be weird, if it wasn't for the fact that the house looks abandoned.
In the corner you notice something shining: it's a small golden \x1b[0;33mbag\x1b[0m
with the label 'magic seeds'.
You might want to bring them with you, you never know when you need some magic!`,
'library',
['bag'],
true
);

let bedroom = new Room(`You enter a small and plain bedroom.
The atmosphere is calm and peaceful, 
but there doesn't seem to be anything of interest or value here.`,
'library',
[],
);

let greenhouse = new Room(`You step into a lush greenhouse filled with plants and flowers of all kinds.
Towards the corner of the greenhouse, you spot a watering \x1b[0;33mcan\x1b[0m:
it seems ready to use.
Nearby, under an old chair, there is a bag with the label 'magic soil'.
You immediately decide to plant your seeds in it. 
Maybe some water can help them grow.`,
  ['library'],
  [],
  false
);

// ============================================================    ITEMS     ======================================================================================
let sign = {
  description: `This door, guarding the secrets within, remains firmly locked.
If you are worthy of this journey, these numbers aligned in perfect harmony shall grant you passage: 12345`,
  read: function () {
    return `${this.description}`;
  }
}

let note = {
  description: `Dear Adventurer,
To keep track of your possessions and access your inventory
type 'i' or 'inventory' in the command prompt.
Also, be aware that words are precious and shouldn't be wasted,
therefore I prefer commands that have a maximum of two words.
In front of you there is the Luminia \x1b[32mlibrary\x1b[0m, go there
to start unveiling the mysteries of this house.`,
  read: function () {
    return `${this.description}`;
  }
}

let key = {
  name: 'key'
}

let bag = {
  name: 'magic seeds bag'
}

let can = {
  name: 'watering can',
  description: `You immediately see growing under your eyes a  
marvelous hibiscus \x1b[0;33mflower\x1b[0m,
with little diamonds in the middle.
It's something rare, and you want to 
pick it up and bring home with you.`
}

let flower = {
  name: 'hibiscus flower'
}
// ======================================================    STATE MACHINE    ===================================================================================
let locationStates = {
  'street': 'foyer',
  'foyer': ['street', 'library'],
  'library': ['kitchen', 'bedroom', 'greenhouse'],
  'kitchen': 'library',
  'bedroom': 'library',
  'greenhouse': 'library'
}

let locationCurrent = "street";
// ======================================================    LOOKUP TABLES    ===================================================================================
const commandLookup = {
  inventory: ['i', 'inventory'],
  use: ['use'],
  pickup: ['take', 'get', 'pick'],
  drop: ['drop'],
  move: ['move', 'go'],
  read: ['read'],
  open: ['open'],
};

const roomLookup = {
  street: street,
  foyer: foyer,
  library: library,
  kitchen: kitchen,
  bedroom: bedroom,
  greenhouse: greenhouse
}

const itemLookup = {
  sign: sign,  // this way we have a string that points to an object
  note: note,
  key: key,
  bag: bag,
  can: can,
  flower: flower
};
// ========================================================    FUNCTIONS    =====================================================================================
function transition(newRoom) {
  const validTransitions = locationStates[locationCurrent];
  const newLocation = roomLookup[newRoom];

  if (validTransitions.includes(newRoom)) {
    // if the door is not locked
    if (newLocation.isLocked === false) {
      locationCurrent = newRoom;
      console.log(`You walk to the ${newRoom}.\n${newLocation.description}`);
    } else {
      // if it's locked
      console.log(`The door is locked. You can't go this way.`);
    }
  } else {
    console.log(`You can't go to ${newRoom} from here.`);
  }
}

function printInventory() {
  if (player.inventory.length === 0) {
    console.log(`Your inventory is empty.`);
  } else {
    console.log(`You are carrying: ${player.inventory.join(', ')}`); // we combined all the elements of the array into a string with ".join()" 
  }
}

function pickItem(item) {
  let takeableItems = ["book", "key", "bag", "flower"];
  if (takeableItems.includes(item)) {
    player.inventory.push(item);
    console.log(`Now ${item} is part of your inventory`);
  } else {
    console.log(`You can't pick the ${item}`);
  }
}

function dropItem(item) {
  player.inventory.pop();
}

function useItem(item) {
  
  if (item === "key") {
    const targetRoom = roomLookup['kitchen']; // Get the room object

    if (targetRoom.isLocked) {
    console.log(`You use the key to unlock the door to the kitchen.`);
    targetRoom.isLocked = false; // Unlock the room
    } else {
    console.log(`The door to the ${roomName} is already unlocked.`);
    }
    transition("kitchen");
    } 

  else {
  console.log(`You use the ${item}`);
  let itemObj = itemLookup[item];
  console.log(itemObj.description);
  }
}

function openDoor() {
  const currentRoom = roomLookup[locationCurrent]; // Get the current room object
  if (currentRoom.isLocked === true) {
    console.log(`Perfect! Now the door opens.`);
    currentRoom.isLocked = false;
  }
}


start();
async function start() {
  console.log(
    `182 Main St.
You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten \x1b[0;33msign\x1b[0m.`
  );


  while (true) {
    let answer = await ask('What would you like to do?\n');
    let answerSplit = answer.split(' '); // the player's answer (string) is divided in two parts
    let command = answerSplit[0]; // it can be 'read', 'pick', etc.
    let thing = answerSplit[1]; // for example 'sign', if the input was 'read sign'

    // basing on the command a line of code from above will run
    if (commandLookup.move.includes(command)) {
      transition(thing);
    }
    else if (commandLookup.pickup.includes(command)) {
      pickItem(thing);
    }
    else if (commandLookup.inventory.includes(command)) {
      printInventory();
    }
    else if (commandLookup.drop.includes(command)) {
      dropItem(thing);
    }
    else if (commandLookup.use.includes(command)) {
      useItem(thing);
    }
    else if (commandLookup.read.includes(command)) {
      const item = itemLookup[thing]; // Retrieve the corresponding object based on the input
      if (item && typeof item.read === 'function') {
        console.log(item.read());
      } else {
        console.log(`You can't read ${thing}`);
      }
    }
    else if (command.includes('12345')) {
      openDoor();
      transition("foyer");
    } else {
      console.log(`I don't know how to ${command}, please try a different command`);
    }
  }
  process.exit();
}
