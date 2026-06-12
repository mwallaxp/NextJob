import Company from "../modules/company.model.js";

const canAccessCompany = (company, req) => {
  return req.role === "admin" || String(company.userid) === String(req.id);
};

export const registerCompany = async (req, res) => {
  try {
    const companyName = req.body.companyName || req.body.name;

    if (!companyName) {
      return res
        .status(400)
        .json({ message: "Company name is required", success: false });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res
        .status(400)
        .json({ message: "The company already exists", success: false });
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
      return res
        .status(404)
        .json({ message: "No companies found", success: false });
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
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    if (req.role === "recruiter" && !canAccessCompany(company, req)) {
      return res
        .status(403)
        .json({ message: "You can only access companies owned by your account", success: false });
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
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    // Ensure only the owner or admin can update the company
    if (req.role === "recruiter" && !canAccessCompany(existingCompany, req)) {
      return res
        .status(403)
        .json({ message: "You can only update companies owned by your account", success: false });
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
