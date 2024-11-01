const { app } = require('@azure/functions');
const sql = require("mssql");

const config = {
    user: "earthstrix",               
    password: "#Earth450550",           
    server: "cloud-comp.database.windows.net", 
    database: "sql-trigger",          
    options: {
        encrypt: true,
    },
};

app.http('sql_trigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        try {
            await sql.connect(config);

            const result = await sql.query`SELECT * FROM Users WHERE Name = ${name}`;

            return {
                status: 200,
                body: result.recordset.length > 0 
                    ? JSON.stringify(result.recordset)
                    : `No user found with the name ${name}`
            };
        } catch (err) {
            context.log.error("Error connecting to the database", err);
            return {
                status: 500,
                body: "Error querying the database. Please check the server logs."
            };
        } finally {
            await sql.close();
        }
    }
});
