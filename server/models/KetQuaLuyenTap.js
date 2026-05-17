const mongoose = require("mongoose");

const ketQuaLuyenTapSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NguoiDung",
            required: true,
            index: true,
        },
        luyenTapID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LuyenTap",
            required: true,
            index: true,
        },
        soCauDung: {
            type: Number,
            default: 0,
        },
        tongSoCau: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("KetQuaLuyenTap", ketQuaLuyenTapSchema);