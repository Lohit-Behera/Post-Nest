import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Support } from "../models/support.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendMail.js";
import { SupportEmailTemplate } from "../utils/html/Support.js";

const sendSupportEmail = asyncHandler(async (req, res) => {
    // get data from request
    const { name, email, subject, message, userId, postId } = req.body
    // validate data
    if (!name || !email || !subject || !message) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide all fields"))
    }
    // create support ticket
    const supportTicket = await Support.create({
        name,
        email,
        subject,
        message
    })
    if (userId){
        const user = await User.findById(userId)
        supportTicket.user = user
    }
    if (postId){
        const post = await Post.findById(postId)
        supportTicket.post = post
    }
    await supportTicket.save({ validateBeforeSave: false })

    const support = await Support.findById(supportTicket._id)

    if (!support) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating support ticket"))
    }
    console.log(support.email);
    

    // send email
    await sendEmail(
        support.email,
        support.subject,
        SupportEmailTemplate(support._id, support.name, support.email, support.subject)
    )
    // send response
    res.status(200).json(new ApiResponse(200, {}, "Support ticket created successfully and email sent"))
})

export { sendSupportEmail }