// required: true - флаг на обязательность поля ввода
// String - класс JS
// unique: true - user должен быть уникален
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{type: Types.ObjectId, ref: 'Link'}]
})

module.exports = model('user', schema)