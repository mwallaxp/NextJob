import Company from "../modules/company.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

const canAccessCompany = (company, req) => {
  return req.role === "admin" || String(company.userid) === String(req.id);
};

export const registerCompany = catchAsync(async (req, res, next) => {
    const companyName = req.body.companyName || req.body.name;

    if (!companyName) {
      return next(new AppError("Company name is required", 400));
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return next(new AppError("The company already exists", 400));
    }

    company = await Company.create({
      name: companyName,
      userid: req.id,
    });

    return res.status(201).json({
      message: "Company registration successful",
      company,
      success: true,
    });
});

export const getCompany = catchAsync(async (req, res, next) => {
    const userId = req.id;
    // Populate the company's user to ensure it's linked to the recruiter
    const companies = await Company.find({ userid: userId }).populate('userid', 'fullname email');

    if (!companies || companies.length === 0) {
      return next(new AppError("No companies found", 404));
    }

    console.log("Fetched Companies:", companies);

    return res.status(200).json({
      companies,
      success: true,
    });
});

export const getCompanyById = catchAsync(async (req, res, next) => {
    const companyId = req.params.id;
    // Populate the company's user to ensure it's linked to the recruiter
    const company = await Company.findById(companyId).populate('userid', 'fullname email');

    if (!company) {
      return next(new AppError("Company not found", 404));
    }
    if (req.role === "recruiter" && !canAccessCompany(company, req)) {
      return next(new AppError("You can only access companies owned by your account", 403));
    }

    return res.status(200).json({
      company,
      success: true,
    });
});

export const updateCompany = catchAsync(async (req, res, next) => {
    const { name, description, website, location } = req.body;

    // Prepare update data, including logo if a file was uploaded
    const updateData = { name, description, website, location };
    if (req.fileUrl) updateData.logo = req.fileUrl;

    const existingCompany = await Company.findById(req.params.id);

    if (!existingCompany) {
      return next(new AppError("Company not found", 404));
    }
    // Ensure only the owner or admin can update the company
    if (req.role === "recruiter" && !canAccessCompany(existingCompany, req)) {
      return next(new AppError("You can only update companies owned by your account", 403));
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      message: "Company information updated successfully",
      company,
      success: true,
    });
});
