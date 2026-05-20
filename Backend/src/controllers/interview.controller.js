const pdfParse = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model")

const generateInterviewReportController = async(req, res) => {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription, jobDescription} = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    console.log("AI RESPONSE:", interviewReportByAi);

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        Message: "Interview report generated successfully",
        interviewReport
    })
}

const getInterviewReportControllerById = async(req, res) => {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
    if(!interviewReport) {
        return res.status(404).json({
            Message: "Interview report not found"
        })
    }

    res.status(200).json({
        Message: "Interview report fetched successfully",
        interviewReport
    })
}

const getAllInterviewReportsController = async(req, res) => {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -preparationPlan -skillGaps")
    res.status(200).json({
        Message: "Interview reports fetched successfully",
        interviewReports
    })
}

const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportControllerById, getAllInterviewReportsController, generateResumePdfController }