const XLSX = require('xlsx');
const { ObjectId, MongoClient } = require('mongodb');

function extractRawData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data;
}

function getPlaceholderLanguageData() {
  return {
    isLive: false,
    utterances: [],
    responses: [],
  };
}

function getIntentDataFromQA(q, a) {
  return {
    isLive: true,
    utterances: [
      {
        _id: new ObjectId(),
        text: q,
      },
    ],
    responses: [
      [
        {
          text: {
            content: a,
          },
        },
      ],
    ],
  };
}

function getIntentsFromXLSX(filePath, { clientId, botId, marketId }) {
  const rawData = extractRawData(filePath);

  const result = rawData.map((row) => {
    const q = row['Question'];
    const a = row['Answer'];

    return {
      name: q,
      bot: new ObjectId(botId),
      client: new ObjectId(clientId),
      market: new ObjectId(marketId),
      content: {
        en: getIntentDataFromQA(q, a),
        el: getPlaceholderLanguageData(),
        de: getPlaceholderLanguageData(),
        es: getPlaceholderLanguageData(),
        fr: getPlaceholderLanguageData(),
        pt: getPlaceholderLanguageData(),
        'zh-cn': getPlaceholderLanguageData(),
      },
      isRemoved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return result;
}

async function writeToDB(connectionString, data) {
  const client = new MongoClient(connectionString);

  // Database Name
  const dbName = 'prod';

  async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('intents');

    const output = await collection.insertMany(data);
    console.log(output);

    return 'done.';
  }

  main();
}

const intents = getIntentsFromXLSX('questions.xlsx', {
  clientId: 'clientId',
  botId: 'botId',
  marketId: 'marketId',
});

writeToDB('insert+your+connection+string+here', intents);
