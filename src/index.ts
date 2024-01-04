import { runDb } from "./db/db";
import {app} from "./settings";

const port = 3000;

app.listen(port, async () => {
    await runDb()
    console.log(`Listen on port ${port}`);
})