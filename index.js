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
  "",
  "foyer",
  [],
  true
);

let foyer = new Room(
  `INTRO: 182 Main St.
  You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign`,
  "foyer",
  [],
);
// ============================================================    ITEMS     ======================================================================================
let sign = {
  description: "Welcome to Burlington Code Academy! Come on up to the third floor.\nIf the door is locked, use the code 12345.",
  read: function () {
    return `${this.description}`;
  }
}

// ======================================================    STATE MACHINE    ===================================================================================
let locationStates = {
  'street': 'foyer',
  'foyer': 'library',
  'library': ['kitchen', 'bedroom', 'greenhouse'],
  'kitchen': 'library',
  'bedroom': 'library',
  'greenhouse': 'library'
}

let locationCurrent = null;
// ======================================================    LOOKUP TABLES    ===================================================================================
const commandLookup = {
  inventory: ['i', 'inventory'],
  use: ['use'],
  pickup: ['take', 'get', 'pick'],
  drop: ['drop'],
  move: ['move'],
  read: ['read'],
  open: ['open'],
};

const roomLookup = {
  street: street,
  foyer: foyer
}

const itemLookup = {
  sign: sign,  // this way we have a string that points to an object
};
// ========================================================    FUNCTIONS    =====================================================================================
// function printDescription(item) {
//   console.log(item.description);
// }

function transition(newRoom) {
  const currentRoom = locationStates[locationCurrent];
  const newLocation = locationStates[newRoom];

  if (currentRoom.connections.includes(newRoom)) {
    // if the door is not locked
    if (!newLocation.locked) {  
      locationCurrent = newRoom;
      console.log(`You walk to the ${newRoom}\n${newLocation.description}`);
    } else {
      // if it's locked
      console.log(`The door is locked. You can't go this way.`);
    }
  } else {
    console.log(`You can't go to ${newRoom} from here.`);
  }
}

function printInventory(item) {
  let stringInventory = item.inventory.toString(', '); //we turn the inventory (arr) into a string using the method toString()
  console.log(`You are carrying: ${stringInventory} `);
}

function pickItem(item) {
  let takeableItems = ["book"];
  if (takeableItems.includes(item)){
    player.inventory.push(item);
    console.log(`Now ${item} is part of your inventory`);
  } else {
    console.log(`You can't pick ${item}`);
  }
}

function dropItem(item) {
  player.inventory.pop();
}

function useItem(item) {
  console.log(`You use the ${item}`);
}

function openDoor(item) {
  const doorStatus = //;
    console.log(`Perfect! Now the door opens.`);
  doorStatus = true;
}


start();
async function start() {
  console.log(
    `182 Main St.
You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.`
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
      printInventory(thing);
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

    } else {
      console.log(`I don't know how to ${command}, please try a different command`);
    }
  }
  process.exit();
}
