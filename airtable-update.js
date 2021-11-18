let table = base.getTable("Quests");
let inputConfig = input.config();
let authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTMxZmJjODc5M2M4ZjVkMTE4YzhmOTYiLCJlbWFpbCI6InNvdXJhYmgub3BlbmluZm90ZWNoQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiZXhwIjoxNjQwMzA1NDQ3Ljk3NSwiaWF0IjoxNjM2NzA1NDQ3fQ.BKJf5Z7auBQYzzWU1DC32HgGWBmFrgbzZbX5kaFd2yY";

// let query = await table.selectRecordsAsync({
//     recordIds: [inputConfig.recordId], fields: [
//         "_id",
//         "isGlobal",
//         "completionBy",
//         "qna",
//         "creator",
//         "category",
//         "title",
//         "description",
//         "outcome",
//         "reward",
//         "badge",
//         "account"
//     ]
// });


//  const body = {
//         _id: record.getCellValue("_id"),
//         isGlobal: record.getCellValue("isGlobal"),
//         completionBy: record.getCellValue("completionBy"),
//         qna: record.getCellValue("qna"),
//         creator: record.getCellValue("creator"),
//         category: record.getCellValue("category"),
//         title: record.getCellValue("title"),
//         description: record.getCellValue("description"),
//         outcome: record.getCellValue("outcome"),
//         reward: record.getCellValue("reward"),
//         badge: record.getCellValue("badge"),
//         account: record.getCellValue("account")
//     };
// for (let record of query.records) {


const body =
{
    isGlobal: inputConfig.isGlobal,
    completionBy: inputConfig.completionBy,
    qna: JSON.parse(inputConfig.qna),
    creator: inputConfig.creator,
    category: JSON.parse(inputConfig.category),
    title: inputConfig.title,
    description: inputConfig.description,
    outcome: inputConfig.outcome,
    reward: inputConfig.reward,
    badge: JSON.parse(inputConfig.badge),
    account: inputConfig.account
};
const stringifiedBody = JSON.stringify(body);
const response = await fetch(`http://54.77.153.203:8080/v1/quests/${inputConfig.id}`,
    {
        headers: {
            'Authorization': 'Bearer ' + authorizationToken,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: stringifiedBody
    });
console.log(await response.text());

// }
