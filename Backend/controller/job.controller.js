import Application from '../modules/application.model.js';
import Job from '../modules/job.model.js';
import Company from '../modules/company.model.js';
import mongoose from "mongoose";
import catchAsync from '../catchAsync.js'; // Added import for catchAsync
import AppError from '../AppError.js'; // Added import for AppError

const toList = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

const parseSalaryRange = (salary) => {
    const numbers = String(salary || "").match(/\d+/g)?.map(Number) || [];
    const salaryMin = numbers[0] || 0;
    const salaryMax = numbers[1] || salaryMin;

    return { salaryMin, salaryMax };
};

const buildJobPayload = (body) => {
    const requirements = toList(body.requirements);
    const skills = toList(body.skills);
    const { salaryMin, salaryMax } = parseSalaryRange(body.salary);

    return {
        title: body.title,
        description: body.description,
        requirements,
        salary: String(body.salary),
        salaryMin,
        salaryMax,
        location: body.location,
        jobType: body.jobType,
        experience: body.experienceLevel || body.experience,
        position: Number(body.position),
        currency: body.currency || "USD",
        skills,
    };
};

const ensureRecruiterOwnsCompany = async (companyId, recruiterId) => {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new AppError("Invalid company ID format", 400);
    }

    const company = await Company.findOne({ _id: companyId, userid: recruiterId });
    if (!company) {
        throw new AppError("You can only use companies owned by your recruiter account", 403);
    }

    return company;
};

const findOwnedJob = async (jobId, recruiterId) => {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new AppError("Invalid Job ID format", 400);
    }

    const job = await Job.findOne({ _id: jobId, created_by: recruiterId });
    if (!job) {
        throw new AppError("Job not found or you do not own this job", 404);
    }

    return job;
};

export const postJob = catchAsync(async (req, res, next) => {
    const { title, description, salary, location, jobType, experienceLevel, position, companyId, companyName, currency = "USD" } = req.body;
    const payload = buildJobPayload(req.body);
    const userid = req.id;

    if (req.role !== "recruiter") {
        return next(new AppError("Only recruiters can post jobs", 403));
    }
    if (!title || !description || payload.requirements.length === 0 || !salary || !location || !jobType || !experienceLevel || !position || (!companyId && !companyName) || !currency || payload.skills.length === 0) {
        return next(new AppError("Complete the missing field", 400));
    }

    let company = companyId;
    if (!company && companyName) {
        const createdCompany = await Company.findOneAndUpdate(
            { name: companyName.trim(), userid },
            { $setOnInsert: { name: companyName.trim(), userid } },
            { new: true, upsert: true }
        );
        company = createdCompany._id;
    } else if (company) { // Only ensure ownership if companyId is provided
        await ensureRecruiterOwnsCompany(company, userid);
    }

    const job = await Job.create({
        ...payload,
        company,
        created_by: userid,
    });
    res.status(201).json({ message: "Job posted successfully", success: true, job });
});

export const getAllJobs = catchAsync(async (req, res, next) => {
    const { keyword = "", page = 1, limit = 10, jobType, location } = req.query;

    // Pagination setup
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { skills: { $regex: keyword, $options: 'i' } },
        ];
    }

    if (jobType) query.jobType = jobType;
    if (location) query.location = { $regex: location, $options: 'i' };

    // Perform data fetching and total count in parallel
    const [jobs, totalJobs] = await Promise.all([
        Job.find(query)
            .populate('company', 'name logo website')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(), // Returns plain JS objects, much faster for reads
        Job.countDocuments(query),
    ]);

    return res.status(200).json({
        success: true,
        totalJobs,
        currentPage: pageNum,
        totalPages: Math.ceil(totalJobs / limitNum),
        jobs: jobs || [],
    });
});

export const getJobById = catchAsync(async (req, res, next) => {
        const jobId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return next(new AppError("Invalid Job ID format", 400));
        }
    
        const job = await Job.findById(jobId)
            .populate('company', 'name website logo') // Select specific fields for company
            .populate({
                path:"applications",
                populate: { path: "applicant", select: "fullname email phonenumber profile" }
            })

        if (!job){
            return next(new AppError("Job not found", 404));
        }
        return res.status(200).json({ job, success: true });
});

// Recruiter-owned jobs. The old /getAdminjobs route still points here for compatibility.
export const getAdminJobs = catchAsync(async (req, res, next) => {
        const AdminId=req.id;
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            jobType,
            companyId,
        } = req.query;
        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
        const query = { created_by: AdminId };

        if (status) query.status = status;
        if (jobType) query.jobType = jobType;
        if (companyId) query.company = companyId;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } },
            ];
        }

        const [jobs, total] = await Promise.all([
            Job.find(query)
            .populate({ path:'company' })
                .sort({ createdAt:-1 })
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber),
            Job.countDocuments(query),
        ]);

        return res.status(200).json({
            jobs,
            total,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            success:true
        });
});

export const updateJob = catchAsync(async (req, res, next) => {
    if (req.role !== "recruiter") {
        return next(new AppError("Only recruiters can update jobs", 403));
    }

    const job = await findOwnedJob(req.params.id, req.id);

    const payload = buildJobPayload({ ...job.toObject(), ...req.body });
    if (req.body.companyId && String(req.body.companyId) !== String(job.company)) {
        await ensureRecruiterOwnsCompany(req.body.companyId, req.id);
        payload.company = req.body.companyId;
    }

    Object.assign(job, payload);
    await job.save();

    return res.status(200).json({ message: "Job updated successfully", success: true, job });
});

export const updateJobStatus = catchAsync(async (req, res, next) => {
    if (req.role !== "recruiter") {
        return next(new AppError("Only recruiters can change job status", 403));
    }

    const { status } = req.body;
    if (!["active", "paused", "closed"].includes(status)) {
        return next(new AppError("Status must be active, paused, or closed", 400));
    }

    const job = await findOwnedJob(req.params.id, req.id);

    job.status = status;
    await job.save();

    return res.status(200).json({ message: `Job ${status} successfully`, success: true, job });
});
