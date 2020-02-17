const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');



const db = mongoose.connection;

db.on('error', function(error) {
  console.error('connection error' + error)
})
db.once('open', function() {
  console.log('链接成功');
})

const models = {
  film: {
    name: {
      type: String,
      require: true,
    },
    create_time: {
      type: String,
      default: Date.now,
    },
    picture: {
      type: String,
    },
    desc: {
      type: String,
    }
  }
}

for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
  getModel: function(name) {
    return mongoose.model(name);
  }
}



