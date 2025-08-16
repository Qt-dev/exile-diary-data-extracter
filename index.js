import generateItems from "./items.js";
import generateUniques from "./uniques.js";
import generateAreas from "./areas.js";
import parseStats from "./utils/statsDescriptionParser.js";
import generateMapMods from "./mapMods.js";
import generateWorldAreas from "./worldAreas.js";
import generateEvents from "./events.js"

await generateItems();
await generateUniques();
await generateAreas();
await parseStats();
await generateMapMods();
await generateWorldAreas();
await generateEvents();

console.log("Data generation completed successfully.");                                  