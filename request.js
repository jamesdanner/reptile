const request = require('request');
const cheerio =require('cheerio');
const iconv = require('iconv-lite');
const model = require('./mongoose');
const Film = model.getModel('film');

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, {encoding: null}, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        const bufs = iconv.decode(body, 'gb2312');
        const html = bufs.toString('utf8');
        resolve(html);
      } else {
        reject(error || response.statusCode);
      }
    });
  });
}


const getMovieDetail = async (url) => {
  try {
    const html = await requestPromise(host + url);
    const $ = cheerio.load(html);
    const movie = {
      name: $('#header > div > div.bd2 > div > div.co_area2 > div.title_all > h1').text(),
      desc: $('#Zoom').html(),
      picture: $('#Zoom > p:nth-child(1) > img').attr('src'),
    }
    Film.create(movie);
  } catch (error) {
    console.log(error);
  }
}

const url = 'https://www.ygdy8.net/html/gndy/china/index.html';
const host = 'https://www.ygdy8.net';

const getList = async () => {
  try {
    const pageList = await requestPromise(url);
    const $ = cheerio.load(pageList);
    $('.co_content8 table').each((index, item) => {
      const hrefItem = $(item).find('tbody > tr:nth-child(2) > td:nth-child(2) a:nth-child(2)').attr('href');
      getMovieDetail(hrefItem);
    });
  } catch (error) {
    console.log(error);
  }
};
const arr = [
  'https://www.ygdy8.net/html/gndy/china/index.html',
];
for(let i = 0; i <= 153; i++) {
  arr.push(`https://www.ygdy8.net/html/gndy/china/index_${i}.html`);
}
// console.log(arr);

arr.reduce((rs, url, index) => {
  return rs.then(() => {
    return new Promise(async (resolve) => {
      console.time('---');
      await getList(url);
      resolve();
      console.timeEnd('---');
      console.log(url);
    });
  })
  
}, Promise.resolve());