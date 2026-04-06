import { program } from "commander";
import { askChatService } from "../services/applicationService.js"
import { cvTemplate, jobDescriptionExaple } from "../utils/constants.js";

async function askGpt() {
    program
        .option('-i, --input <string>')

    program.parse();

    const options = program.opts()
    const input = options.input ?? jobDescriptionExaple

    const stream = await askChatService({ jobDescription: input, cvTemplate })
    stream.pipe(process.stdout)
}

askGpt()