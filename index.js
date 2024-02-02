import { transformQuestionAnswersToIntents } from './helpers.js';
import fs from 'fs';

/**
 *  Usage instructions:
 *  Import your file/data in anyway you want
 *  Change the adapter function to transform your data into an array of {question:string, answer:string}
 *  run the scrip with yarn run start
 *  The output will be in intents.json
 *  You can now import this file into your database via compass or atlas
 */

function adapter(data){
  /**
   * transform your data as needed
   * [
   *  {
   *     question: 'What is the capital of France?',
   *     answer: 'Paris',
   *  }
   * ]
   *
   * */

  return JSON.parse(data)
}

// Change as needed
const data = fs.readFileSync('input.json', 'utf8');

const intents = transformQuestionAnswersToIntents({
  groupId: '',
  clientId: '',
  marketId: '',
  rowData: adapter(data)
});

fs.writeFileSync('intents.json', JSON.stringify(intents, null, 2));
