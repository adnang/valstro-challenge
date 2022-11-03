import * as readline from "readline/promises";
import { io } from "socket.io-client";
import { stdin, stdout } from "process";

const rl = readline.createInterface(stdin, stdout);
const socket = io("http://localhost:3000", {
  autoConnect: true,
});

socket.on("search", async (msg: Search) => {
  if (msg.error) {
    console.error(msg.error);
  } else {
    console.log(
      `(${msg.page}/${msg.resultCount}) - ${msg.name} appeared in: ${msg.films}`
    );
    if (msg.page && msg.page !== msg.resultCount) {
      return;
    } else {
      console.log("Finished search.\n");
    }
  }
  await getInput();
});

const getInput = async () => {
  const ans = await rl.question("Search? (or 'quit'): ");
  if (ans === "quit") {
    console.log("Exiting.");
    rl.close();
    socket.close();
  } else socket.emit("search", { query: ans });
};

console.log("Starting app");
await getInput();
