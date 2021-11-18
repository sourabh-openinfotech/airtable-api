const Airtable = require("airtable");
const chunk = require("lodash.chunk");
const base = new Airtable({ apiKey: auths.airtable.api_key }).base(
  params.base_id
);

const BATCH_SIZE = 10; // The Airtable API allows us to update up to 10 rows per request.

const airtableAccounts = [];
const records = await base(params.table_name).select().all();
records.forEach((record) => {
  return airtableAccounts.push(record.fields);
});
if (!Array.isArray(airtableAccounts)) {
  airtableAccounts = JSON.parse(airtableAccounts);
}

let data = steps.get_request.$return_value.accounts;
console.log(data);
if (!Array.isArray(data)) {
  data = JSON.parse(data);
}
data = data.map((fields) => ({
  fields,
}));

if (!data.length) {
  throw new Error(
    "No Airtable record data passed to step. Please pass at least one record"
  );
}

const checkIfItemsIsNewandMapId = (item) => {
  const airTableEntry = records.find((record) => {
    return record.fields._id === item.fields._id;
  });

  if (airTableEntry) {
    item.id = airTableEntry.id;
  }
  return item;
};

const [newItems, oldItems] = data.reduce(
  (acc, item) => {
    item = checkIfItemsIsNewandMapId(item);
    return item.id ? (acc[1].push(item), acc) : (acc[0].push(item), acc);
  },
  [[], []]
);

//check if item is deleted based on api response
const deletedRecords = records.reduce((acc, record) => {
  const exists = data.some(
    (apiRecord) => apiRecord.fields._id === record.fields._id
  );
  if (!exists) {
    acc.push(record.id);
  }
  return acc;
}, []);

console.log("Records deleted", deletedRecords.length);
console.log("New Records added", newItems.length);


const customParams = {
  typecast: true,
};

const responses = [];

//   delete records which are not present in api call
for (const deletedRecordsOfBatchSize of chunk(deletedRecords, BATCH_SIZE)) {
  try {
    responses.push(await base(params.table_name).destroy(deletedRecordsOfBatchSize));
  } catch (err) {
    throw Error(`${err.error} - ${err.statusCode} - ${err.message}`);
  }
}

for (const c of chunk(newItems, BATCH_SIZE)) {
  try {
    responses.push(...(await base(params.table_name).create(c, customParams)));
  } catch (err) {
    throw Error(`${err.error} - ${err.statusCode} - ${err.message}`);
  }
}

for (const oldItemsArrayOfBatchSize of chunk(oldItems, BATCH_SIZE)) {
  try {
    responses.push(
      await base(params.table_name).update(oldItemsArrayOfBatchSize, customParams)
    );
  } catch (err) {
    throw Error(`${err.error} - ${err.statusCode} - ${err.message}`);
  }
}
return responses;
