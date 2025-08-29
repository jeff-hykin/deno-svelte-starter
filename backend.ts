#!/usr/bin/env -S deno run --allow-all
import { fromFileUrl, extname, join } from "https://deno.land/std@0.224.0/path/mod.ts"
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts"

// replace with actual cert file contents
import { certFileContents, keyFileContents } from "./dummyCertFiles.js"

// you probably want to get rid of these (they're my custom libraries)
import { parseArgs, flag, required, initialValue } from "https://raw.githubusercontent.com/jeff-hykin/good-js/1.18.0.0/source/flattened/parse_args.js"
import { didYouMean } from "https://raw.githubusercontent.com/jeff-hykin/good-js/1.18.0.0/source/flattened/did_you_mean.js"

const argsInfo = parseArgs({
    rawArgs: Deno.args,
    fields: [
        [["--debug", "-d"], flag],
        [["--help"], flag],
        [["--port"], initialValue(`9093`), (str) => str],
        [["--address"], initialValue(`0.0.0.0`), (str) => str],
        [["--serve-dir"], initialValue(`./build`), (str) => str],
        [["--secure-websockets"], flag],
    ],
    namedArgsStopper: "--",
    nameRepeats: "useLast",
    valueTransformer: JSON.parse,
    isolateArgsAfterStopper: false,
    argsByNameSatisfiesNumberedArg: true,
    implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
    implictFlagPattern: null,
})
didYouMean({
    givenWords: Object.keys(argsInfo.implicitArgsByName).filter((each) => each.startsWith(`-`)),
    possibleWords: Object.keys(argsInfo.explicitArgsByName).filter((each) => each.startsWith(`-`)),
    autoThrow: true,
    suggestionLimit: 1,
})
const args = argsInfo.simplifiedNames
if (args.help) {
    console.log(`
Usage: rrs [options]

Options:
    --debug, -d
        Run in debug mode (prints more stuff, maybe)
    
    --port
        The port to run the server on
        default: 9093

    --address
        The address to run the server on
        default: 0.0.0.0
    
    --secure-websockets
        Use a secure websocket connection (wss) instead of plain websocket
    
Notes:
    - Giving an argument twice will use the last one given
`)
    Deno.exit()
}

const subscribers = []
let extras = {}
if (args.secureWebsockets) {
    extras = {
        cert: certFileContents,
        key: keyFileContents,
    }
}
Deno.serve(
    {
        port: args.port - 0,
        hostname: args.address,
        ...extras,
        // onListen: () => {
        //     console.log(`Running on http://${args.address}:${args.port}`)
        // },
    },
    async (req) => {
        //
        // normal http request
        //
        if (req.headers.get("upgrade") != "websocket") {
            const url = new URL(req.url)
            let filePath = decodeURIComponent(url.pathname)
            if (filePath === "/") filePath = "/index.html"

            const fullPath = join(args.serveDir, filePath)

            try {
                const file = await Deno.readFile(fullPath)
                const mime = contentType(extname(fullPath)) || "application/octet-stream"
                return new Response(file, {
                    status: 200,
                    headers: {
                        "content-type": mime,
                    },
                })
            } catch (err) {
                if (err instanceof Deno.errors.NotFound) {
                    return new Response("404 - File Not Found", { status: 404 })
                } else {
                    return new Response("500 - Internal Server Error", { status: 500 })
                }
            }
        }

        //
        // websocket request
        //
        const { socket, response } = Deno.upgradeWebSocket(req)
        subscribers.push(socket)
        socket.addEventListener("open", () => {
            console.log("a client connected!")
        })
        socket.addEventListener("message", (event) => {
            // TODO: clean up
            if (event.data === "ping") {
                console.log(`got ping`)
            }
        })
        socket.addEventListener("close", () => {
            subscribers = subscribers.filter((each) => each !== socket)
        })

        return response
    }
)
