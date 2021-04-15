import {ApolloServer} from "apollo-server";
const { print } = require('graphql');

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {Context} from "./context";
import {resolvers} from "./resolvers/resolvers";
import {Resolvers} from "./types";
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

const corsOrigins = [
    "http://localhost:5000",
    "https://localhost:5000",
    "http://omo.local:5000",
    "https://omo.local:5000",
    "https://omo.li",
    "https://circles.land"
];

/*
class BasicLogging {
    requestDidStart(args:{queryString:any, parsedQuery:any, variables:any}) {
        const {queryString, parsedQuery, variables} = args;
        const query = queryString || print(parsedQuery);
        console.log(query);
        console.log(variables);
    }

    willSendResponse(args:{graphqlResponse:any}) {
        console.log(JSON.stringify(args, null, 2));
    }
}
 */


export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;

    constructor()
    {
        const apiSchemaTypeDefs = importSchema("../src/server-schema.graphql");
        this._resolvers = resolvers;

        console.log("cors origins: ", corsOrigins);

        this._server = new ApolloServer({
            // extensions: [() => new BasicLogging()],
            plugins: [httpHeadersPlugin],
            context: Context.create,
            typeDefs: apiSchemaTypeDefs,
            resolvers: this._resolvers,
            cors: {
                origin: corsOrigins,
                credentials: true
            }
        });
    }

    async run()
    {
        await this._server.listen({
            port: parseInt("8989")
        }).then(o => {
            console.log("listening at port 8989")
        });
    }
}

new Main()
    .run()
    .then(() => "Running");
