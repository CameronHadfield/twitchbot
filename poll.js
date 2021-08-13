import * as fs from 'fs';
import * as promises from 'fs/promises';

var folder = await promises.mkdir('./poll', {});

function beginPoll(optA, optB){
    await promises.open("./poll/poll.txt");
}
