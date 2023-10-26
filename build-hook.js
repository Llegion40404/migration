import { execSync } from "child_process";

execSync("npx json-server --watch db.json --port 8043");
