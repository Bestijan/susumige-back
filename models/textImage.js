const { mongoose } = require('mongoose');

/**
 * Image inside the news
 */
class TextImage extends mongoose.Model {
    id;
    fileName = '';
    fileSize = 0;
    fileAsBase64 = '';
    fileType = '';
    source = '';

    constructor(id) {
        super(id);
    }
}

const TextImageModel = mongoose.model(TextImage, new mongoose.Schema({
    id: { type: Number, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true},
    fileAsBase64: { type: String, required: true},
    fileType: { type: String, required: true},
    source: { type: String, required: true}
}));

module.exports = { TextImage, TextImageModel };