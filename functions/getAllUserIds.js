var Airtable = require("airtable");
var apiKey = process.env.AIRTABLE_API_KEY;
var baseId = process.env.AIRTABLE_BASE_ID;
var table = process.env.AIRTABLE_TABLE_NAME;
var base = new Airtable({ apiKey: apiKey }).base(baseId);
exports.handler = function(event, context, callback) {
  // heres the array to store the user ids
  var ids = [];
  base(table)
    .select({ view: "Grid view" })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
          console.log("id", record.get("id"));
          console.log("email", record.get("email"));
          ids.push(record.get("id").toString());
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );

  console.log("ids", ids);
  return callback(null, {
    statusCode: 200,
    body: ids.toString()
  });
};
