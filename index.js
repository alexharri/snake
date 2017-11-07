function genEl(type, c, text, attrs) {
  const el = document.createElement(type);

  if (Array.isArray(c)) {
    for (let i = 0; i < c.length; i += 1) {
      el.classList.add(c[i]);
    }
  }
  if (typeof c === "string") {
    el.classList.add(c);
  }

  if (typeof text === "string") {
    el.appendChild(document.createTextNode(text));
  }

  if (attrs && typeof attrs === "object") {
    const keys = Object.keys(attrs);
    for (let i = 0; i < keys.length; i += 1) {
      el[keys[i]] = attrs[keys[i]];
    }
  }

  el.withChildren = function withChildren(children) {
    if (!Array.isArray(children)) {
      throw new Error("Expected 'children' to be an array of nodes.");
    }

    for (let i = 0; i < children.length; i += 1) {
      // Make sure that we're appending valid nodes.
      if (!(children[i] && children[i].nodeType)) {
        throw new Error(`Invalid child at index ${i}. Expected HTML node.`);
      }

      el.appendChild(children[i]);
    }

    return el;
  };

  return el;
}


const container = document.getElementById("snake-container");

const numRows = 8;
const columns = 8;

const rows = [];

const getCellByCoords = (x, y) => {
  return rows[y].children[x];
}

for (let i = 0; i < numRows; i += 1) {
  const row = genEl("div", "row");

  for (let j = 0; j < columns; j += 1) {
    row.appendChild(genEl("div", "cell"));
  }

  rows.push(row);
  container.appendChild(row);
}

rows[4].children[3].classList.add("active");

const directionMap = {
  38: "LEFT",
  37: "UP",
  40: "RIGHT",
  39: "DOWN",
};

let direction = "LEFT";

document.addEventListener("keydown", (e) => {
  if (directionMap[e.keyCode]) {
    direction = directionMap[e.keyCode];
  }
});

const genMove = {
  LEFT: (x, y) => {
    if (x === 0) {
      return { x: columns - 1, y };
    }
    return { x: x - 1, y };
  },
  RIGHT: (x, y) => {
    if (x === columns - 1) {
      return { x: 0, y };
    }
    return { x: x + 1, y };
  },
  UP: (x, y) => {
    if (y === 0) {
      return { x, y: numRows - 1 };
    }
    return { x, y: y - 1 };
  },
  DOWN: (x, y) => {
    if (y === numRows - 1) {
      return { x, y: 0 };
    }
    return { x, y: y + 1 };
  },
};

const snake = [
  { x: 4, y: 4 },
];

const cellsToClear = [];

function genPart() {
  return {
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
  };
}

function render() {
  for (let i = 0; i < cellsToClear.length; i += 1) {
    const coords = cellsToClear[i];
    getCellByCoords(coords.x, coords.y).classList.remove("active");
  }

  for (let i = 0; i < snake.length; i += 1) {
    const cell = getCellByCoords(snake[i].x, snake[i].y);
    cell.classList.add("active");

  }

  cellsToClear.length = 0;
}

setInterval(() => {
  for (let i = 0; i < snake.length; i += 1) {
    if (i === 0) {
      const head = snake[i];
      const oldCoords = { x: head.x, y: head.y };
      const newCoords = genMove[direction](head.x, head.y);
      head.x = newCoords.x;
      head.y = newCoords.y;

      cellsToClear.push(oldCoords);
    }
  }
  render();
}, 100);
