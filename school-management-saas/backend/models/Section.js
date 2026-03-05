import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Section name is required'],
        trim: true,
        uppercase: true
    },
    class: {
        type: String,
        required: [true, 'Class is required'],
        trim: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate section per class per school
sectionSchema.index({ name: 1, class: 1, schoolId: 1 }, { unique: true });

export default mongoose.model('Section', sectionSchema);
