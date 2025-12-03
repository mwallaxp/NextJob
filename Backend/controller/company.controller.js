import Company from "../modules/company.model.js";
import getDataUrl from "../utility/DataUrl.js";
import cloudinary from "../utility/Cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

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
  } catch (error) {
    console.error("Error registering company:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userid: userId });

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
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    let logo;
    if (req.file) {
      const fileUrl = getDataUrl(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUrl);
      logo = cloudResponse.secure_url;
    }

    const updateData = { name, description, website, location };
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(
      req.params.id, 
      updateData, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    return res.status(200).json({
      message: "Company information updated successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};