const {Vote, Comment, CrimeReport} = require('../models/index');

const comment = async (user_id, crime_report_id, comment_content) => {
    const report = await CrimeReport.findByPk(crime_report_id);

    console.log("report",report);
    console.log("crime report id",user_id, crime_report_id, comment_content);
    if (!report || report.is_deleted) {
        throw new Error('Crime report not found or deleted');
    }

    

    return Comment.create({
        user_id,
        crime_report_id,
        content: comment_content
    });
};

const deleteComment = async (comment_id) => {
    const comment = await Comment.findByPk(comment_id);
    
    if (!comment) {
        throw new Error('Comment not found');
    }
 
    return comment.destroy();
 };

const vote = async (user_id, crime_report_id, vote_type) => {
    const report = await CrimeReport.findByPk(crime_report_id);
    if (!report || report.is_deleted) {
        throw new Error('Crime report not found or deleted');
    }

    const existingVote = await Vote.findOne({
        where: { user_id, crime_report_id }
    });

    if (existingVote) {
        if (existingVote.vote_type === vote_type) {
            await existingVote.destroy();
            return null;
        }
        existingVote.vote_type = vote_type;
        return existingVote.save();
    }

    

    return Vote.create({
        user_id,
        crime_report_id,
        vote_type
    });
};



module.exports = {
    comment, vote, deleteComment
};