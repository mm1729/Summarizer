const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'whatso', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are'];
/*
Reverses string and cuts at capital letter + space + {. or ! or ?}
Then, reverses back to original and creates an array of sentences.
*/
function getSentences(article) {
    var sntRegex = /([A-Z]) (["?\.|!|\?])+(?!rM|sM|rD|srM|rj|rs|[A-Z]|\d)/mg;
    article = String(article).replace(/\n+/, ' ');
    article = String(article).split('').reverse().join(''); // reverse article
    // add '\n' at each sentence and reverse article split at \n.
    var sentences = String(article).replace(sntRegex, '$1\n$2').
        split('').reverse().join('').split('\n');
    return sentences.filter(function(val){return val;})
}

/*
Makes array of sentences into a array or array of keywords
*/
function getKeywords(sentences) {
    var allKeywords = {};
    for(var sentInd in sentences) {
        var sentence = sentences[sentInd];
        sentence = String(sentence).toLowerCase();
        var keywords = String(sentence).split(' ');
        keywords = filterKeyWords(keywords, commonWords);
        if(keywords.length < 3) continue;
        allKeywords[sentInd] = keywords;
    }
    return allKeywords;
}

/*
    Removes most common words and punctuation
*/
function filterKeyWords(words, keywords) {
    var processedArr = [];
    words.forEach(function(w) {
        if(keywords.indexOf(w) == -1)
            if((w = w.replace(/\W/g, '')))
                processedArr.push(w);
    });
    return processedArr;
}

/*
    Calculates title scores
*/
function getTitleScores(title, keywords) {
    if(title.length == 0) return -1;

    for(kwprop in keywords) {
        var kw = keywords[kwprop];
        var TS = 0;
        for(w in kw) {
            if(title.indexOf(kw[w]) != -1)
                TS++;
        }
        kw.push(''+ TS);
    }
    return keywords;
}

/*
    calculates the ranks of kw1 and kw2 and returns an object containing them
*/
function compare(kw1, kw2) {
    var numIntersections = 0;
    //console.log(typeof(kw1));
    //console.log(kw2);
    kw1.forEach(function(w1) {
        if(kw2.indexOf(w1) != -1)
            numIntersections++;
    });
    // normalized intersection_score 0 - 1
    var intersection_score = 2*numIntersections/(kw1.length + kw2.length);
    return intersection_score * kw1.length - intersection_score * kw2.length;
}

function mergeSortSumm(keywords) {
    return recurSumm(keywords, 0, Object.keys(keywords).length - 1);
}

function recurSumm(keywords, begin, end) {
    var len = end - begin;
    if(len <= 0)
        return [Object.keys(keywords)[begin]];
    var middle = Math.floor((begin + end) / 2);
    // divide keywords in two and get their summaries
    var firstObj = recurSumm(keywords, begin, middle);
    var secondObj = recurSumm(keywords, middle + 1, end);
    //console.log(firstObj);
    //console.log(secondObj);
    return merge(keywords, firstObj, secondObj);
}

function merge(keywords, arr1, arr2) {
    var j = 0, k = 0;
    var mergeArr = [];
    var totalLen = arr1.length + arr2.length;
    for(var i = 0; i < totalLen; i++) {
        if(j === arr1.length) { // just dump arr2 into mergeArr
            for(; k < arr2.length; k++)
                mergeArr.push(arr2[k]);
            break;
        }
        if(k === arr2.length) { // just dump arr1 into mergeArr
            for(; j < arr1.length; j++)
                mergeArr.push(arr1[j]);
            break;
        }
        var kw1 = Array.from(keywords[arr1[j]]);
        var kw2 = Array.from(keywords[arr2[k]]);
        var rank = compare(kw1, kw2);
        if(rank > 0) {
            mergeArr[i] = arr1[j];
            j++;
        } else if (rank == 0) {
            var tc1 = 1*kw1[kw1.length - 1];
            var tc2 = 1*kw2[kw2.length - 1];
            if(tc1 > tc2) {
                mergeArr[i] = arr1[j];
                j++;
            } else if(tc1 == tc2) {
                mergeArr[i] = arr1[j];
                mergeArr[i + 1] = arr2[k];
                i++; j++; k++;
            } else {
                mergeArr[i] = arr2[k];
                k++;
            }
        } else {
            mergeArr[i] = arr2[k];
            k++;
        }
    }
    return mergeArr;
}

function summarize(title, article) {
    var sentences = getSentences(article);
    if(sentences.length < 2) return sentences;
    var keywords = getKeywords(sentences);
    title = title.toLowerCase()
        .replace(/[^\sa-zA-Z0-9]/g, '');
    titleW = String(title).split(' ');
    keywords = getTitleScores(titleW, keywords);
    //console.log(keywords);
    summArr = mergeSortSumm(keywords);
    var summarySent = summArr.slice(0, 5).sort();
    var summaryStr = [];
    for(var i = 0; i < 5; i++) {
        var sentNum = 1*summarySent[i];
        summaryStr.push(sentences[sentNum]);
    }

    return summaryStr;


}
