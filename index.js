import generateItems from "./items.js";
import generateAreas from "./areas.js";

await generateItems();
await generateAreas();
console.log("Data generation completed successfully.");