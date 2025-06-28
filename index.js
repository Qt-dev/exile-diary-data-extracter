import generateItems from "./items.js";
import generateAreas from "./areas.js";
import parseStats from "./utils/statsDescriptionParser.js";
import generateMapMods from "./mapMods.js";

await generateItems();
await generateAreas();
await parseStats();
await generateMapMods();
console.log("Data generation completed successfully.");                                  