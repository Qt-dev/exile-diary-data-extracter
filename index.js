import generateItems from "./items.js";
import generateAreas from "./areas.js";
import parseStats from "./utils/statsDescriptionParser.js";
import generateMapMods from "./mapMods.js";
import generateWorldAreas from "./worldAreas.js";

await generateItems();
await generateAreas();
await parseStats();
await generateMapMods();
await generateWorldAreas();
console.log("Data generation completed successfully.");                                  