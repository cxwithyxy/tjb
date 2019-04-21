import { app } from 'electron'
import { Main_display } from './Main_display';

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    await new Main_display().display()
});

