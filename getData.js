const model = require('./mongoose');
const Film = model.getModel('film');


Film.find({_id: '5d3aa522d5100bec29aec2c2'}).exec(function(err, res) {
  console.log(res);
});
// console.log(film)