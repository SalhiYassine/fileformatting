import { ObjectId } from "mongodb"

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
        _id: formatId(new ObjectId().toHexString()),
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

export function transformQuestionAnswersToIntents({ clientId, groupId, marketId, rowData }) {
  const result = rowData.map((row) => {
    const q = row.question;
    const a = row.answer;

    return {
      name: q,
      groupId: formatId(new ObjectId(groupId).toHexString()),
      client: formatId(new ObjectId(clientId).toHexString()),
      market: formatId(new ObjectId(marketId).toHexString()),
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
      createdAt: formatDate(new Date().toISOString()),
      updatedAt: formatDate(new Date().toISOString()),
    };
  });

  return result;
}

function formatId(id) {
  return { "$oid": id };
}

function formatDate(date) {
  return { "$date": date };
}
