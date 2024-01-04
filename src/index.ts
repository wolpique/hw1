import { runDb } from "./db/db";
import {app} from "./settings";

const port = 80;

app.listen(port, async () => {
    await runDb()
    console.log(`Listen on port ${port}`);
})