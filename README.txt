Summarizer Algorithm:

Problem: Summarize news articles given a title and article

Currently, there exist three types of summarization algorithms:
1. Extraction-based : Finds "central" sentences in the content.
2. Abstraction-based : Finds important phrases and paraphrases them.
3. Aided : Uses machine learning, aided by human or machine, to make summary.

Since, (2) and (3) are unnecessarily complex and require a lot of time to build,
it is better to build an Extraction-based algorithm.

The conventional algorithm used in Extraction-based summarization is the Textrank.

However, there is a much simpler algorithm mentioned here:
http://thetokenizer.com/2013/04/28/build-your-own-summary-tool/

Since we are specifically summarizing news articles, we can assume:
1. News articles usually provide a lot of details in a linear fashion (as
    opposed to essays that connect paragraphs to the thesis).
2. The title is the gist of the article. Essentially, the title is a "one-line"
    summary.

Since the title is a "one-line" summary, we can use it to find a group of sentences that discuss the ideas described in the title. In most news articles,
the title is contains keywords as capitalized words. We can use them to find
sentences that have these keywords mentioned in them.

However, a news article is usually divided into paragraphs such that each
paragraph discusses one detail of the news. Some articles have 2-3 line paragraph and some have 5-7 line paragraphs.

So, we propose that we find a sentence from each paragraph that has the most
intersections with other sentences in the same paragraph. Also, we find a sentence that has the most intersections with the title. Now, two things may happen:
1. The title-centric(TC) and paragraph-centric(PC) sentences are the same.
    Then, we pick that sentence to be in our summary.

2. The title-centric(TC) and paragraph-centric(PC) sentences are different.
    Then, we find the normalized intersection between TC and PC. If it is greater
    than some constant k, we pick the TC. Or else, we include both TC and PC in
    our summary.

Then, we have a list of sentences in our summary. Now, the sentences that are
right next to each other are from neighboring paragraphs. So, for each pair of
sentences we find the normalized intersection and if it greater that some
constant m, we include the sentence that is more TC and discard the other one.

We keep repeating the above procedure until each neighboring pair of sentences
have a normalized intersection less than m.

Then, we have a group of sentences that each discuss separate ideas in the article. Then, using the normalized TC scores of each sentence, we include only the sentences with a score of greater than some constant n.

Hence, we are left with a group of sentences that are highly TC as well as PC. This will be the summary of the article.


ALGORITHM RUN TIME: Since we utilize a merge sort like algorithm, we make only O(nlogn) comparisons instead of the usual O(n^2). Hence, this algorithm is very applicable to large articles.

FEATURES: This algorithm was implemented as a Chrome extension. The 'theme' of this implementation is that we provide a 5-line summary for every article. Also, we save all the computed summaries in history.

HOW TO USE:
- Click on SUMMARIZE PAGE to view a summary of the open tab.
- Click on HISTORY to view the previous summaries
    - Click on the 'plus' sign to expand previous summary and article link
- Click on 5-LINE SUMMARY to go back to homepage

** PLEASE refresh the page if summarizer does could not display anything. This means the extractor.js has not been injected.

GITHUB:
https://github.com/mm1729/Summarizer
